from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import asyncio
import tiktoken

from ..database import get_db
from ..models.models import User, Expert, Chat, Message

router = APIRouter()


@router.post("/users/", response_model=dict)
def create_user(name: str, db: Session = Depends(get_db)):
    user = User(name=name)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"user_id": user.user_id, "name": user.name}


@router.get("/experts/", response_model=list)
def get_experts(db: Session = Depends(get_db)):
    experts = db.query(Expert).all()
    return [{"expert_id": expert.expert_id, "name": expert.name} for expert in experts]


@router.post("/chats/", response_model=dict)
def create_chat(user_id: int, db: Session = Depends(get_db)):
    chat = Chat(user_id=user_id)
    db.add(chat)
    db.commit()
    db.refresh(chat)
    return {"chat_id": chat.chat_id, "user_id": chat.user_id}


@router.post("/chats/{chat_id}/messages/")
def send_message(
    chat_id: int, user_id: int, content: str, db: Session = Depends(get_db)
):
    message = Message(chat_id=chat_id, user_id=user_id, sender="user", content=content)
    db.add(message)
    db.commit()
    db.refresh(message)
    return {"message_id": message.message_id, "content": message.content}


@router.get("/chats/{chat_id}/messages/", response_model=list)
def get_messages(chat_id: int, db: Session = Depends(get_db)):
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


@router.post("/chats/{chat_id}/experts/{expert_id}/respond")
async def expert_respond(chat_id: int, expert_id: int, db: Session = Depends(get_db)):
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
        enc = tiktoken.encoding_for_model("gpt-4o-mini")
        tokenized_response = enc.encode(example_full_response)
        for token in tokenized_response:
            partial_response_chunk = enc.decode([token])
            await asyncio.sleep(0.01)
            yield partial_response_chunk

    return StreamingResponse(fake_llm_response(), media_type="text/event-stream")
