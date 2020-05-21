from fastapi import APIRouter

from app.api.api_v1.endpoints import chemicals

api_router = APIRouter()
api_router.include_router(chemicals.router, prefix="/chemicals", tags=["chemicals"])
