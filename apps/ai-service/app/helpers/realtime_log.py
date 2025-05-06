# app/helpers/realtime_log.py
import redis.asyncio as redis
import sys
import asyncio

r = redis.Redis()

class RedisLogHandler:
    def __init__(self, user_id: str):
        self.user_id = user_id

    def write(self, message: str):
        if message.strip():
            asyncio.create_task(r.publish(self.user_id, message))

    def flush(self):
        pass  # For compatibility