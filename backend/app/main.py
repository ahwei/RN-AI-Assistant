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
            models.Expert(
                name="Joe Rogan",
                description="Humorous and engaging, covering a wide range of topics with a mix of crudeness and wisdom",
            ),
            models.Expert(
                name="Andrew Huberman",
                description="Neuroscientist with deep theoretical knowledge",
            ),
            models.Expert(
                name="Lex Fridman",
                description="Computer scientist, skilled in discussing technology and philosophy",
            ),
            models.Expert(
                name="David Goggins",
                description="Ultra-endurance athlete and motivational speaker",
            ),
            models.Expert(
                name="Jordan Peterson",
                description="Clinical psychologist and philosophical thinker",
            ),
            models.Expert(
                name="Tim Ferriss",
                description="Author and podcast host focusing on self-improvement",
            ),
            models.Expert(
                name="Naval Ravikant",
                description="Entrepreneur and philosophical thinker",
            ),
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
