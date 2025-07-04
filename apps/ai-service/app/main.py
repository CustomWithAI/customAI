from fastapi import FastAPI, HTTPException, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
import os
import glob
import subprocess
import requests
import traceback

from app.services.dataset.dataset import preprocess_all_dataset, augment_dataset_class, augment_dataset_obj, augment_dataset_seg, prepare_dataset
from app.services.model.training import MLTraining, DLTrainingPretrained, ConstructTraining
from app.models.ml import MachineLearningClassificationRequest
from app.models.dl import (
    DeepLearningClassification,
    DeepLearningYoloRequest,
    DeepLearningClassificationConstruct,
    DeepLearningObjectDetectionConstructFeatex,
    DeepLearningObjectDetectionConstructRequest,
)
from app.models.dataset import DatasetConfigRequest, PrepareDatasetRequest
from app.models.use_model import UseModelRequest
from app.services.model.use_model import UseModel
from app.helpers.models import delete_all_models, get_model
from app.helpers.evaluation import get_all_evaluation, clear_evaluation_folder
from app.helpers.dataset import clear_dataset
from app.helpers.realtime_log import r, redirect_stdout_to_ws

ml_training = MLTraining()
dl_training_pretrained = DLTrainingPretrained()
construct_training = ConstructTraining()

app = FastAPI()

@app.exception_handler(Exception)
async def exception_handler(request: Request, e: Exception):
    delete_all_models()
    clear_evaluation_folder()
    return JSONResponse(
        status_code=500,
        content={
            "detail": "An unexpected error occurred.",
            "path": str(request.url),
            "error_type": type(e).__name__,
            "error_message": str(e),
            # Optional: add traceback for debug (should close in production)
            "trace": traceback.format_exc()
        },
    )


@app.get("/")
async def status():
    return {"message": "server is running"}


@app.post("/training-ml")
async def training_ml(config: MachineLearningClassificationRequest, request: Request):
    with redirect_stdout_to_ws(request):
        ml_training.training_ml_cls(config)
    return get_model("cls", "ml")


@app.post("/training-dl-cls-pt")
async def training_dl(config: DeepLearningClassification, request: Request):
    with redirect_stdout_to_ws(request):
        dl_training_pretrained.train_cls(config)
    return get_model("cls", "pt")


@app.post("/training-dl-cls-construct")
async def construct_model(config: DeepLearningClassificationConstruct, request: Request):
    with redirect_stdout_to_ws(request):
        if config.featex:
            construct_training.train_cls_featex(config)
        else:
            construct_training.train_cls(config)
    return get_model("cls", "construct")

@app.post("/training-dl-od-construct")
async def construct_model(config: DeepLearningObjectDetectionConstructRequest, request: Request):
    with redirect_stdout_to_ws(request):
        if isinstance(config, DeepLearningObjectDetectionConstructFeatex):
            construct_training.train_od_featex(config)
        else:
            construct_training.train_od(config)
    return get_model("od", "construct")


@app.post("/create_yolo_venv")
async def create_venv():
    # Create venv for yolov5
    subprocess.run(["python", "-m", "venv", "yolov5_venv"], check=True)
    subprocess.run(
        "yolov5_venv/bin/python -m pip install -r app/services/model/yolov5/requirements.txt", shell=True, check=True)

    # Create venv for yolov8
    subprocess.run(["python", "-m", "venv", "yolov8_venv"], check=True)
    subprocess.run(
        "yolov8_venv/bin/python -m pip install ultralytics==8.2.103 -q", shell=True, check=True)

    # Create venv for yolov11
    subprocess.run(["python", "-m", "venv", "yolov11_venv"], check=True)
    subprocess.run(
        'yolov11_venv/bin/python -m pip install "ultralytics<=8.3.40" supervision roboflow', shell=True, check=True)

    return {"message": "Venvs created successfully"}


@app.post("/training-yolo-pt")
async def training_yolo_pretrained(config: DeepLearningYoloRequest, request: Request):
    with redirect_stdout_to_ws(request):
        await dl_training_pretrained.train_yolo(config, request.headers.get("X-TRAINING-ID", "default-id"))
    if config.type == "object_detection":
        return get_model("od", "pt", config.model)
    elif config.type == "segmentation":
        return get_model("seg", "pt", config.model)
    else:
        raise ValueError("Invalid type for deep learning workflow")


@app.post("/dataset")
async def create_dataset(data: PrepareDatasetRequest, request: Request):
    with redirect_stdout_to_ws(request):
        delete_all_models()
        prepare_dataset(data)


@app.post("/dataset-config")
async def config_dataset(config: DatasetConfigRequest, request: Request):
    with redirect_stdout_to_ws(request):
        # TODO: Get dataset

        # TODO: Preprocess images
        if config.preprocess:
            print("DOING PREPROCESS")
            dataset_dir = "dataset"
            preprocess_all_dataset(dataset_dir, config.preprocess)

        # TODO: Augmentation
        if config.augmentation and config.type:
            print("DOING AUGMENTATION")
            training_path = "dataset/train"

            # Count how many training dataset exist
            image_extensions = ['*.png', '*.jpg']
            image_count = 0
            for ext in image_extensions:
                image_count += len(glob.glob(os.path.join(training_path,
                                '**', ext), recursive=True))

            total_target_number = config.augmentation.number - image_count
            print("TOTAL TARGER:", total_target_number)

            # Do Augmentation
            if total_target_number > 0:
                if config.type == "classification":
                    augment_dataset_class(
                        training_path, config.augmentation)
                if config.type == "object_detection":
                    augment_dataset_obj(
                        training_path, config.augmentation)
                if config.type == "segmentation":
                    augment_dataset_seg(
                        training_path, config.augmentation)


@app.post("/use-model")
async def use_all_model(payload: UseModelRequest):
    
    image_bytes: bytes
    model_bytes: bytes
    
    response = requests.get(payload.img, stream=True)
    if (response.status_code == 200):
        image_bytes = response.content
    else:
        raise HTTPException(400, "Can't download image")
    
    response = requests.get(payload.model, stream=True)
    if (response.status_code == 200):
        model_bytes = response.content
    else:
        raise HTTPException(400, "Can't download model")

    use_model = UseModel(model_bytes=model_bytes)

    if payload.type == "ml":
        prediction = use_model.use_ml(image_bytes)
        return {"prediction": prediction.tolist()[0]}

    if payload.type == "dl_cls":
        prediction = use_model.use_dl_cls(image_bytes)
        return {"prediction": int(prediction)}

    if payload.type == "dl_od_pt":
        prediction = use_model.use_dl_od_pt(image_bytes, payload.version, payload.confidence)
        return {"prediction": prediction}

    if payload.type == "dl_od_con":
        prediction = use_model.use_dl_od_con(image_bytes, payload.confidence)
        return {"prediction": prediction}

    if payload.type == "dl_seg":
        prediction = use_model.use_dl_seg(image_bytes, payload.version, payload.confidence)
        return {"prediction": prediction}

    raise HTTPException(400, "Invalid Model Type")

@app.get("/evaluation")
async def get_evaluation_result(workflow: str, yolo: str | None = None):
    evaluation = get_all_evaluation(workflow, yolo)
    delete_all_models()
    clear_evaluation_folder()
    # clear_dataset()
    return JSONResponse(evaluation, status_code=200)
