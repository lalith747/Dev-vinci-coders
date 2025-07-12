from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, items

app = FastAPI()

origins = ["*"]  # Allow all origins for hackathon

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(items.router, prefix="/items", tags=["Items"])

@app.get("/")
def root():
    return {"message": "ReWear backend is live!"}
