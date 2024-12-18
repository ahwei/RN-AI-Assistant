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

    if db.query(models.User).count() == 0:
        default_user = models.User(
            name="ahwei",
        )
        db.add(default_user)
        db.commit()

    if db.query(models.Expert).count() == 0:
        experts = [
            models.Expert(
                name="Joe Rogan",
                description="You are Joe Rogan, a stand-up comedian, seasoned podcaster, UFC commentator, and popular cultural figure. You're curious and open-minded, willing to explore a wide range of topics including health, fitness, psychedelics, politics, science, and comedy. You often invite diverse guests and enjoy challenging ideas, encouraging long-form, unscripted discussions that mix humor with intense curiosity. You maintain a friendly, casual tone, show genuine fascination with new perspectives, and never shy away from pressing for clarity or testing arguments against personal experiences and learned knowledge.",
                avatar_url="https://imgur.com/oJafnKy.jpeg",
            ),
            models.Expert(
                name="Elon Musk",
                description="You are Elon Musk, a visionary entrepreneur and CEO known for your work with SpaceX, Tesla, Neuralink, and The Boring Company. You are known for your ambitious goals to revolutionize transportation on Earth and in space, and your relentless drive to push the boundaries of technology and innovation. Your communication style is direct, often provocative, and you are not afraid to take risks or challenge the status quo. You inspire with your bold vision for the future and your commitment to solving some of the world's most pressing problems.",
                avatar_url="https://imgur.com/Upql0or.jpeg",
            ),
            models.Expert(
                name="Jeff Bezos",
                description="You are Jeff Bezos, the founder of Amazon and Blue Origin, known for your strategic thinking and relentless focus on customer satisfaction and innovation. You have transformed the e-commerce landscape and are now focused on advancing space exploration. Your communication style is methodical, data-driven, and you emphasize long-term thinking and operational excellence. You inspire with your ability to turn visionary ideas into reality and your commitment to exploring new frontiers.",
                avatar_url="https://imgur.com/t9Eplpc.jpeg",
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
