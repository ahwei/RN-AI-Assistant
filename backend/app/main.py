from fastapi import FastAPI
from .database import engine, SessionLocal
from .models import models
from .api.endpoints import router
from .core.config import settings

app = FastAPI()

# Include API routes
app.include_router(router)

# Create database tables
models.Base.metadata.create_all(bind=engine)


@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    if db.query(models.Expert).count() == 0:
        experts = [
            models.Expert(name="Lex Fridman", description=""),
            models.Expert(name="Elon Musk", description=""),
            models.Expert(name="Ray Dalio", description=""),
        ]
        db.add_all(experts)
        db.commit()
    db.close()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=True,
        workers=1,
    )
