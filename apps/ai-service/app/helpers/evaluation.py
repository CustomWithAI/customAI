import os
import csv
import shutil
import base64
import mimetypes

from typing import Literal, Optional, List

def clear_folder(path: str) -> None:
    for filename in os.listdir(path):
        file_path = os.path.join(path, filename)
        if os.path.isfile(file_path) or os.path.islink(file_path):
            os.unlink(file_path)
        elif os.path.isdir(file_path):
            shutil.rmtree(file_path, ignore_errors=True)

def read_evaluation(filepath: str, type: Literal["txt", "csv"]) -> str:
    try:
        if type == "txt":
            with open(filepath, 'r') as file:
                lines = file.readlines()
                header = []
                values = []
                
                for line in lines:
                    if line.strip():
                        if ":" in line:
                            key, value = line.split(":")
                            header.append(key.strip())
                            values.append(value.strip())
                        else:
                            raise ValueError(f"Invalid line format in {filepath}: {line.strip()}")

                csv_output = ",".join(header) + "\n" + ",".join(values)
                return csv_output
        elif type == "csv":
            with open(filepath, newline='', encoding='utf-8') as csvfile:
                reader = csv.reader(csvfile)
                rows = [",".join(row) for row in reader]
                return "\n".join(rows).strip()
        else:
            raise ValueError(f"Unsupported file type: {type}")
    except FileNotFoundError:
        raise ValueError(f"File not found: {filepath}") 
    except Exception as e:
        raise ValueError(f"An error occurred reading {filepath}: {str(e)}")

def image_to_data_uri(image_path: str):
    mime_type, _ = mimetypes.guess_type(image_path)

    if mime_type is None or not mime_type.startswith("image/"):
        mime_type = "image/jpeg"

    with open(image_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode("utf-8")

    return f"data:{mime_type};base64,{encoded_string}"

def get_folder_path(workflow: Literal["cls", "od", "seg"], yolo: Optional[Literal["yolov5", "yolov8", "yolov11"]] = None):
    if workflow == "cls":
        folder_path = os.path.join("evaluation_results")
    elif workflow == "od":
        if yolo and yolo == "yolov5":
            folder_path = os.path.join("app", "services", "model", "yolov5", "runs", "train", "exp")
        elif yolo:
            folder_path = os.path.join("runs", "detect", "train")
        else:
            folder_path = os.path.join("evaluation_results")
    elif workflow == "seg":
        folder_path = os.path.join("runs", "segment", "train")
    else:
        raise ValueError(f"Invalid workflow type: '{workflow}'")
    return folder_path

def get_evaluation_file_path(workflow: Literal["cls", "od", "seg"], yolo: Optional[Literal["yolov5", "yolov8", "yolov11"]] = None):
    if workflow == "cls":
        file_path = os.path.join("metrics.txt")
    elif workflow == "od":
        if yolo and yolo == "yolov5":
            file_path = os.path.join("results.csv")
        elif yolo:
            file_path = os.path.join("results.csv")
        else:
            file_path = os.path.join("metrics.txt")
    elif workflow == "seg":
        file_path = os.path.join("results.csv")
    else:
        raise ValueError(f"Invalid workflow type: '{workflow}'")
    return file_path

def get_evaluation(
    workflow: Literal["cls", "od", "seg"],
    yolo: Optional[Literal["yolov5", "yolov8", "yolov11"]] = None,
):
    file_type = "txt" if (workflow == "cls") or (workflow == "od" and yolo is None) else "csv"
    return read_evaluation(os.path.join(get_folder_path(workflow, yolo), get_evaluation_file_path(workflow, yolo)), file_type)
  
def get_evaluation_image(
    workflow: Literal["cls", "od", "seg"],
    yolo: Optional[Literal["yolov5", "yolov8", "yolov11"]] = None
):
    folder_path = get_folder_path(workflow, yolo)
    if workflow == "cls":
        result = {
            "confusion_matrix": image_to_data_uri(os.path.join(folder_path, "confusion_matrix.png")),
        }
        accuracy_loss_per_epoch_path = os.path.join(folder_path, "accuracy_loss_per_epoch.png")
        if os.path.isfile(accuracy_loss_per_epoch_path):
            result["accuracy_loss_per_epoch"] = image_to_data_uri(accuracy_loss_per_epoch_path)
        return result
    elif workflow == "od":
        if yolo is None:
            return {
                "metric_summary": image_to_data_uri(os.path.join(folder_path, "metric_summary.png")),
                "metrics_per_epoch": image_to_data_uri(os.path.join(folder_path, "metrics_per_epoch.png")),
            }
        return {
            "confusion_matrix": image_to_data_uri(os.path.join(folder_path, "confusion_matrix.png")),
            "results": image_to_data_uri(os.path.join(folder_path, "results.png")),
        }
    elif workflow == "seg":
        return {
            "confusion_matrix": image_to_data_uri(os.path.join(folder_path, "confusion_matrix.png")),
            "results": image_to_data_uri(os.path.join(folder_path, "results.png")),
        }
    else:
        raise ValueError("Invalid workflow type")

def get_all_evaluation(workflow: Literal["cls", "od", "seg"],
    yolo: Optional[Literal["yolov5", "yolov8", "yolov11"]] = None
):
    return {
        "evaluation": get_evaluation(workflow, yolo),
        "evaluation_image": get_evaluation_image(workflow, yolo),
    }

def clear_evaluation_folder():
    clear_folder(os.path.join("evaluation_results"))