from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

import src.models
from src.router import (
    analytics,
    exports,
    product,
    user,
    equipment,
    workout_session,
    meal_log,
    biometrics_log,
    etl
)


app = FastAPI()

# Configuration CORS pour permettre au frontend d'accéder à l'API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Frontend Vue.js
        "http://127.0.0.1:5173",
        "http://localhost:3000",  # Au cas où
    ],
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],  # Tous les headers
)

api = APIRouter(prefix="/api/v0")
api.include_router(analytics.router)
api.include_router(exports.router)
api.include_router(product.router)
api.include_router(user.router)
api.include_router(equipment.router)
api.include_router(workout_session.router)
api.include_router(meal_log.router)
api.include_router(biometrics_log.router)
app.include_router(etl.router)

app.include_router(api)