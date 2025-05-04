# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy app requirements first
COPY requirements.txt .

# Install app dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Clone YOLOv5 *after* copying project to prevent overwrite
RUN git clone https://github.com/ultralytics/yolov5 app/services/model/yolov5

# Set up venvs
RUN python -m venv /app/yolov5_venv && \
    /app/yolov5_venv/bin/pip install --no-cache-dir -r /app/app/services/model/yolov5/requirements.txt && \
    python -m venv /app/yolov8_venv && \
    /app/yolov8_venv/bin/pip install ultralytics==8.2.103 && \
    python -m venv /app/yolov11_venv && \
    /app/yolov11_venv/bin/pip install "ultralytics<=8.3.40" supervision roboflow

# Expose FastAPI app port
EXPOSE 80

# Start the FastAPI app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80", "--reload"]
