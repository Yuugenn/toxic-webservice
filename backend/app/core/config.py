import os

PROJECT_NAME = "toxic-webservice"

BACKEND_CORS_ORIGINS = 'http://localhost:8000,http://localhost,http://localhost:3000,http://localhost:8080'

SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")

API_V1_STR = '/api/v1'

FRONTEND_SERVER_URL = os.getenv('FRONTEND_SERVER_URL')
