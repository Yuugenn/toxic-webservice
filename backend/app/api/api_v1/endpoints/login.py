from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from app.api.user_management import active_users, User, get_current_user, user_login, refresh_login

router = APIRouter()


@router.post("")
async def login(
        form_data: OAuth2PasswordRequestForm = Depends()
):
    login_data = form_data.username + ':' + form_data.password

    token = user_login(login_data)

    return {"access_token": token, "token_type": "bearer", "expires-in": "30m"}


@router.get("/refresh")
async def read_users_me(current_user: User = Depends(get_current_user)):
    token = refresh_login(current_user)
    return {"access_token": token, "token_type": "bearer", "expires-in": "30m"}


@router.get("/users/me")
async def read_users_me(current_user: User = Depends(get_current_user)):
    return {"user": current_user, "access_token": current_user.current_token, "token_type": "bearer"}


@router.get("/users/all")
async def read_users_me():
    return active_users
