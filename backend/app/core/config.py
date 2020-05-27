import os
import secrets

PROJECT_NAME = "toxic-webservice"

BACKEND_CORS_ORIGINS = 'http://localhost:8000,http://localhost'

SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")

API_V1_STR = '/api/v1'

FRONTEND_SERVER_URL = os.getenv('FRONTEND_SERVER_URL')

USERS_OPEN_REGISTRATION: bool = True

SECRET_KEY: str = secrets.token_urlsafe(32)
