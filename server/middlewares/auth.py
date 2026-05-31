import os

from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

security = HTTPBearer(auto_error=False)
API_TOKEN = os.getenv("API_TOKEN")


def verify_api_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Missing or invalid authorization token")

    if API_TOKEN is None:
        raise HTTPException(
            status_code=500,
            detail="Server configuration error: API_TOKEN is not configured"
        )

    if credentials.credentials != API_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorized")

    return True
