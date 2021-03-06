# toxic-webservice

## Features
- **FastAPI** with Python 3.7
- **React 16** with Typescript, Redux, and react-router
- Postgres
- SqlAlchemy with Alembic for migrations
- Docker compose for easier development

## Development

The only dependencies for this project should be docker and docker-compose.

### Quick Start
Starting the project with hot-reloading enabled 
(the first time it will take a while):
```
docker-compose up -d
```
- Backend will be at http://localhost:8888
- Auto-generated docs at 
http://localhost:8888/docs
- Frontend at http://localhost:8000

### Rebuilding containers:
```
docker-compose build
```

### Restarting containers:
```
docker-compose restart
```

### Bringing containers down:
```
docker-compose down
```

### Frontend Development
Alternatively to running inside docker, it can sometimes be easier 
to use npm directly for quicker reloading.  To run using npm:
```
cd frontend
npm install
npm start
```
This should redirect you to http://localhost:3000

### Frontend Tests
```
cd frontend
npm install
npm test
```

## Migrations

Migrations are run using alembic.  To run all migrations:
```
docker-compose run --rm backend alembic upgrade head
```

To create a new migration:
```
alembic revision -m "create users table"
```

And fill in `upgrade` and `downgrade` methods.  For more information see
[Alembic's official documentation](https://alembic.sqlalchemy.org/en/latest/tutorial.html#create-a-migration-script).

## Logging
```
docker-compose logs
```

Or for a specific service:
```
docker-compose logs -f name_of_service # frontend|backend|db
```

## Project Layout
```
backend
└── app
    ├── alembic
    │   └── versions # where migrations are located
    ├── api
    │   └── api_v1
    │       └── endpoints
    |           ├──chemicals
    |           └──login
    ├── core    # config
    ├── db      # db models and config
    └── main.py # entrypoint to backend

frontend
└── public
└── src
    ├── components
    │   └── Home.tsx
    ├── config
    │   └── index.tsx   # constants
    ├── __tests__
    │   └── test_home.tsx
    ├── index.tsx   # entrypoint
    └── App.tsx     # handles routing
```