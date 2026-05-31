import os

from fastapi import Request
from fastapi.responses import JSONResponse
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

RATE_LIMIT = os.getenv("RATE_LIMIT", "10/minute")

limiter = Limiter(key_func=get_remote_address, default_limits=[RATE_LIMIT])


def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={
            "success": False,
            "error": "Rate limit exceeded. Please try again later."
        }
    )
