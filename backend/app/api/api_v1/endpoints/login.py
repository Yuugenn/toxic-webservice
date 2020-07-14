import requests
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm, HTTPBasic, HTTPBasicCredentials
from pydantic import BaseModel
from starlette import status

router = APIRouter()

security = HTTPBasic()

endpoint = "https://api.fiw.fhws.de/auth/api/users/me"
# data = {"ip": "1.1.2.3"}
# headers = {"Authorization": "Bearer MYREALLYLONGTOKENIGOT"}


class AuthResponse(BaseModel):
    email: str
    fhws_token: str


@router.get("/", response_model=AuthResponse)
async def login(
        login_encoded: str
):

    headers = {"Authorization": "Basic " + login_encoded}

    response = send_auth_request(headers)

    status_code = response.status_code

    if not (status_code == 200):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    return create_auth_response(response)


@router.get("/token", response_model=AuthResponse)
async def login(
        token: str
):
    headers = {"Authorization": "Bearer " + token}

    response = send_auth_request(headers)

    status_code = response.status_code

    if not (status_code == 200):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    return create_auth_response(response)


def send_auth_request(header):
    return requests.get(endpoint, headers=header)


def create_auth_response(response: requests.Response):
    token = response.headers.get("X-fhws-jwt-token")

    json = response.json()
    user_email = json["emailAddress"]

    return AuthResponse(email=user_email, fhws_token=token)
