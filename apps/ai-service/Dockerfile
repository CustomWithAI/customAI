# Stage 1: Builder
FROM python:3.10-slim AS builder

ENV PYTHONUNBUFFERED=1

# Install build dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install to virtual environments
COPY requirements.txt ./
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Clone yolov5 manually to avoid overwrite
RUN git clone https://github.com/ultralytics/yolov5 /app/yolov5

# Create yolov5 venv
RUN python -m venv /app/yolov5_venv && \
    /app/yolov5_venv/bin/pip install --no-cache-dir -r /app/yolov5/requirements.txt

# Create yolov8 venv
RUN python -m venv /app/yolov8_venv && \
    /app/yolov8_venv/bin/pip install --no-cache-dir ultralytics==8.2.103

# Create yolov11 venv
RUN python -m venv /app/yolov11_venv && \
    /app/yolov11_venv/bin/pip install --no-cache-dir "ultralytics<=8.3.40" supervision roboflow

# Stage 2: Final minimal image
FROM python:3.10-slim AS runtime

ENV PYTHONUNBUFFERED=1

# Install only necessary system libraries
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /usr/local/lib/python3.10 /usr/local/lib/python3.10
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy the venvs
COPY --from=builder /app/yolov5_venv /app/yolov5_venv
COPY --from=builder /app/yolov8_venv /app/yolov8_venv
COPY --from=builder /app/yolov11_venv /app/yolov11_venv

# Copy app source
COPY . /app
COPY --from=builder /app/yolov5 /app/app/services/model/yolov5

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
