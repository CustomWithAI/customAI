import os
import redis.asyncio as redis
import asyncio
import sys
import json

from contextlib import contextmanager
from fastapi import Request

REDIS_HOST = os.getenv("REDIS_HOST", "redis")
REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
REDIS_DB = int(os.getenv("REDIS_DB_INDEX", "1"))

r = redis.Redis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    db=REDIS_DB,
    decode_responses=True
)

async def log_message(training_id: str, message: str, echo: bool = True):
    if message.strip():
        payload = {
            "trainingId": training_id,
            "data": message.strip()
        }
        await r.publish(os.getenv("REDIS_LOG_CHANNEL", "training-logs"), json.dumps(payload))
    if echo:
        sys.__stdout__.write(message + "\n")
        sys.__stdout__.flush()

class RedisLogHandler:
    def __init__(self, training_id: str):
        self.training_id = training_id

    def write(self, message: str):
        if message.strip():
            payload = {
                "trainingId": self.training_id,
                "data": message.strip()
            }
            asyncio.create_task(r.publish(os.getenv("REDIS_LOG_CHANNEL", "training-logs"), json.dumps(payload)))

    def flush(self):
        pass

class TeeStream:
    def __init__(self, training_id: str, original_stream):
        self.handler = RedisLogHandler(training_id)
        self.original = original_stream

    def write(self, message: str):
        self.handler.write(message)
        self.original.write(message)

    def flush(self):
        self.handler.flush()
        self.original.flush()

@contextmanager
def redirect_stdout_to_ws(request: Request):
    training_id = request.headers.get("X-TRAINING-ID", "default-id")
    original_stdout = sys.stdout
    original_stderr = sys.stderr
    sys.stdout = TeeStream(training_id, original_stdout)
    sys.stderr = TeeStream(training_id, original_stderr)
    try:
        yield
    finally:
        sys.stdout = original_stdout
        sys.stderr = original_stderr