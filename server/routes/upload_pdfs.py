from fastapi import APIRouter, UploadFile, File, Depends
from typing import List
from modules.load_vectorstore import load_vectorstore
from fastapi.responses import JSONResponse
from logger import logger
from middlewares.auth import verify_api_token
from middlewares.rate_limit import limiter


router = APIRouter()

@router.post("/upload_pdfs/")
@limiter.limit("10/minute")
async def upload_pdfs(
    files: List[UploadFile] = File(...),
    _: bool = Depends(verify_api_token),
):
    try:
        logger.info("Recieved uploaded files")
        load_vectorstore(files)
        logger.info("Document added to vectorstore")
        return {"messages":"Files processed and vectorstore updated"}
    except Exception as e:
        logger.exception("Error during PDF upload")
        return JSONResponse(status_code=500,content={"error":str(e)})   