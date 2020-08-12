import base64
import requests
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from pydantic.main import BaseModel
from starlette import status

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")
endpoint = "https://api.fiw.fhws.de/auth/api/users/me"


class User(BaseModel):
    email: str
    current_token: str
    role: str


active_users = []


async def get_current_user(token: str = Depends(oauth2_scheme)):
    headers = {"Authorization": "Bearer " + token}

    response = authorize_with_fhws(headers, "Invalid token")
    json = response.json()

    user_email = json["emailAddress"]
    user = next((u for u in active_users if u.email == user_email), None)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


def user_login(login_data: str):

    login_encoded = base64.b64encode(login_data.encode("utf-8"))
    headers = {"Authorization": "Basic " + login_encoded.decode('ascii')}

    response = authorize_with_fhws(headers, "Incorrect email or password")
    json = response.json()
    token = response.headers.get("X-fhws-jwt-token")

    user_email = json["emailAddress"]
    role = json["role"]

    add_user(user_email, token, role)

    return token


def add_user(email: str, token: str, role: str):
    user = next((x for x in active_users if x.email == email), None)

    if not user:
        active_users.append(User(email=email, current_token=token, role=role))
    else:
        user.current_token = token


def refresh_login(user: User):
    headers = {"Authorization": "Bearer " + user.current_token}

    response = authorize_with_fhws(headers, "Invalid token")

    token = response.headers.get("X-fhws-jwt-token")
    user.current_token = token
    return token


def authorize_with_fhws(headers, detail):
    response = requests.get(endpoint, headers=headers)

    status_code = response.status_code

    if not (status_code == 200):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )
    return response
