from fastapi import APIRouter, Form, Depends
from fastapi.responses import JSONResponse
from modules.llm import get_llm_chain
from modules.query_handlers import query_chain
from langchain_core.documents import Document
from langchain.schema import BaseRetriever
from langchain_community.embeddings import HuggingFaceEmbeddings
from pinecone import Pinecone
from pydantic import Field
from typing import List
from logger import logger
from middlewares.auth import verify_api_token
from middlewares.rate_limit import limiter
import os

router = APIRouter()


@router.post("/ask/")
@limiter.limit("10/minute")
async def ask_question(
    question: str = Form(...),
    _: bool = Depends(verify_api_token),
):
    try:
        logger.info(f"user query: {question}")

        # Pinecone setup
        pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])
        index = pc.Index(os.environ["PINECONE_INDEX_NAME"])

        # Embedding model
        embed_model = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )

        embedded_query = embed_model.embed_query(question)

        # Query Pinecone
        res = index.query(
            vector=embedded_query,
            top_k=3,
            include_metadata=True
        )

        docs = [
            Document(
                page_content=match["metadata"].get("text", ""),
                metadata=match["metadata"]
            )
            for match in res["matches"]
        ]

        # Custom Retriever
        class SimpleRetriever(BaseRetriever):
            docs: List[Document] = Field(default_factory=list)

            def __init__(self, documents: List[Document]):
                super().__init__(docs=documents)

            def _get_relevant_documents(
                self,
                query: str
            ) -> List[Document]:
                return self.docs

        retriever = SimpleRetriever(docs)

        # LLM chain
        chain = get_llm_chain(retriever)
        result = query_chain(chain, question)

        # Extract response cleanly
        answer = (
            result.get("response")
            if isinstance(result, dict)
            else str(result)
        )

        # Format sources
        sources = list(set([
            f"{doc.metadata.get('source', 'Unknown')} "
            f"(Page {doc.metadata.get('page', 'Unknown')})"
            for doc in docs
        ]))

        logger.info("query successful")

        return {
            "success": True,
            "question": question,

            "answer": {
                "title": "Medical Assistant Response",
                "content": answer,
                "disclaimer":
                    "This information is based on the uploaded medical documents. "
                    "Please consult a healthcare professional for diagnosis or treatment."
            },

            "sources": sources if sources else [
                "No source found"
            ]
        }

    except Exception as e:
        logger.exception("Error processing question")

        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": str(e)
            }
        )