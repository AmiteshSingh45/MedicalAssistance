import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.middleware import SlowAPIMiddleware
from slowapi.errors import RateLimitExceeded

from middlewares.exception_handlers import catch_exception_middleware
from middlewares.rate_limit import limiter, rate_limit_exceeded_handler
from routes.upload_pdfs import router as upload_router
from routes.ask_question import router as ask_router


FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

app = FastAPI(title="Medical Assistant API", description="API for AI Medical Assistant Chatbot")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Rate limiting
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)


# middleware exception handlers
app.middleware("http")(catch_exception_middleware)

# routers

# 1. upload pdfs documents
app.include_router(upload_router)
# 2. asking query
app.include_router(ask_router)