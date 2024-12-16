"""
This is a simple FastAPI backend for the frontend prototype.

Please use Python for your backend. We use FastAPI for our web framework,
but you can choose to use another Python web framework if you prefer.

The backend is not particularly well-designed, but it's a good starting point.
This is intentional, and you should consider how you would restructure this
backend to make the frontend more maintainable, and easier to implement.
There are many ways to do this, and you should feel free to make any changes
you see fit to this backend.
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Text,
    ForeignKey,
    DateTime,
    func,
)
from sqlalchemy.orm import relationship
import tiktoken
import datetime
import asyncio

import uvicorn

# Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


### SQLAlchemy Models. Feel free to move these to another Python file.


class User(Base):
    __tablename__ = "user_"

    user_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)

    chats = relationship("Chat", back_populates="user")
    messages = relationship("Message", back_populates="user")


class Expert(Base):
    __tablename__ = "expert"

    expert_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    description = Column(String)

    messages = relationship("Message", back_populates="expert")


class Chat(Base):
    __tablename__ = "chat"

    chat_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user_.user_id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="chats")
    messages = relationship("Message", back_populates="chat")


class Message(Base):
    __tablename__ = "message"

    message_id = Column(Integer, primary_key=True, autoincrement=True)
    chat_id = Column(Integer, ForeignKey("chat.chat_id"))
    user_id = Column(Integer, ForeignKey("user_.user_id"), nullable=True)
    expert_id = Column(Integer, ForeignKey("expert.expert_id"), nullable=True)
    sender = Column(String)  # 'user' or 'expert'
    content = Column(Text)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    chat = relationship("Chat", back_populates="messages")
    user = relationship("User", back_populates="messages")
    expert = relationship("Expert", back_populates="messages")


# Create the database tables
Base.metadata.create_all(bind=engine)


### FastAPI app
app = FastAPI()


# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Endpoints


@app.post("/users/", response_model=dict)
def create_user(name: str, db: SessionLocal = Depends(get_db)):
    user = User(name=name)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"user_id": user.user_id, "name": user.name}


@app.get("/experts/", response_model=list)
def get_experts(db: SessionLocal = Depends(get_db)):
    experts = db.query(Expert).all()
    return [{"expert_id": expert.expert_id, "name": expert.name} for expert in experts]


@app.post("/chats/", response_model=dict)
def create_chat(user_id: int, db: SessionLocal = Depends(get_db)):
    chat = Chat(user_id=user_id)
    db.add(chat)
    db.commit()
    db.refresh(chat)
    return {"chat_id": chat.chat_id, "user_id": chat.user_id}


@app.post("/chats/{chat_id}/messages/")
def send_message(
    chat_id: int, user_id: int, content: str, db: SessionLocal = Depends(get_db)
):
    message = Message(chat_id=chat_id, user_id=user_id, sender="user", content=content)
    db.add(message)
    db.commit()
    db.refresh(message)
    # Here, trigger the expert responses (stubbed)
    return {"message_id": message.message_id, "content": message.content}


@app.get("/chats/{chat_id}/messages/", response_model=list)
def get_messages(chat_id: int, db: SessionLocal = Depends(get_db)):
    messages = (
        db.query(Message)
        .filter(Message.chat_id == chat_id)
        .order_by(Message.timestamp)
        .all()
    )
    return [
        {
            "message_id": msg.message_id,
            "sender": msg.sender,
            "content": msg.content,
            "timestamp": msg.timestamp,
        }
        for msg in messages
    ]


@app.post("/chats/{chat_id}/experts/{expert_id}/respond")
async def expert_respond(
    chat_id: int, expert_id: int, db: SessionLocal = Depends(get_db)
):
    # This is a stub implementation simulating the LLM response for one user message
    # You may want to restructure this api to have the user message sent with this
    # request, and have multiple experts respond to the same message, all
    # streaming back to the frontend.
    async def fake_llm_response():
        await asyncio.sleep(1.0)
        example_full_response = (
            "Hello, I'm Lex Fridman. I'm a research scientist at MIT, focusing on human-centered artificial intelligence, "
            "deep learning, and autonomous vehicles. I'm also known for hosting the Lex Fridman Podcast where I have in-depth "
            "conversations with scientists, engineers, artists, and leaders across many fields. My academic work explores the "
            "intersection of AI and human intelligence, particularly in areas like human-robot interaction and machine learning. "
            "I've had the privilege of interviewing many influential figures including Elon Musk, Mark Zuckerberg, and Ray Dalio. "
            "My approach combines rigorous technical understanding with philosophical inquiry about consciousness, intelligence, "
            "and the future of humanity. I'm deeply interested in questions about AGI, consciousness, and how technology will "
            "shape our future. I also practice jiu-jitsu and believe in the importance of both physical and mental discipline. "
            "I aim to bridge the gap between technical AI concepts and their broader implications for society through my research, "
            "teaching, and public communication."
        )
        enc = tiktoken.encoding_for_model("gpt-4o")
        tokenized_response = enc.encode(example_full_response)
        for token in tokenized_response:
            partial_response_chunk = enc.decode([token])
            await asyncio.sleep(0.01)
            assert isinstance(partial_response_chunk, str)
            print(partial_response_chunk, end="", flush=True)  # Print to terminal
            yield partial_response_chunk
        print()  # Add newline at end

    # TODO: Save the response to the database
    return StreamingResponse(fake_llm_response(), media_type="text/event-stream")


# Add initial experts if none exist
@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    if db.query(Expert).count() == 0:
        expert1 = Expert(name="Lex Fridman", description="")
        expert2 = Expert(name="Elon Musk", description="")
        expert3 = Expert(name="Ray Dalio", description="")
        db.add_all([expert1, expert2, expert3])
        db.commit()
    else:
        print(
            "Experts already exist. Skipping initial seeding of database with experts."
        )
    db.close()


if __name__ == "__main__":
    uvicorn.run(
        "backend:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        workers=1,
    )
