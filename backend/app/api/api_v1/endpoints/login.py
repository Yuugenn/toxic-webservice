from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from requests import requests
router = APIRouter()


@router.get("/")
async def login(
        form_data: OAuth2PasswordRequestForm = Depends()
):
    id = form_data.username
    password = form_data.password

    requests.get()


    return
