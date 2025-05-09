import os
import redis.asyncio as redis
import asyncio

REDIS_HOST = os.getenv("REDIS_HOST", "redis")
REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
REDIS_DB = int(os.getenv("REDIS_DB_INDEX", "1"))

r = redis.Redis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    db=REDIS_DB,
)

class RedisLogHandler:
    def __init__(self, user_id: str):
        self.user_id = user_id

    def write(self, message: str):
        if message.strip():
            asyncio.create_task(r.publish(self.user_id, message))

    def flush(self):
        pass

class TeeStream:
    def __init__(self, user_id: str, original_stream):
        self.handler = RedisLogHandler(user_id)
        self.original = original_stream

    def write(self, message: str):
        self.handler.write(message)
        self.original.write(message)

    def flush(self):
        self.handler.flush()
        self.original.flush()

async def log_message(user_id: str, message: str):
    await r.publish(user_id, message)