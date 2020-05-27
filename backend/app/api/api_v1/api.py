from fastapi import APIRouter

from app.api.api_v1.endpoints import chemicals, login, user

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(user.router, prefix="/users", tags=["users"])
api_router.include_router(chemicals.router, prefix="/chemicals", tags=["chemicals"])
