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
        # Markdown
        example_responses = [
            "# AI and Machine Learning Expert\n\n",
            "## Introduction\nAs an AI researcher with extensive experience in machine learning, ",
            "I specialize in developing and implementing advanced AI solutions. ",
            "\n\n## Key Areas of Expertise\n- Deep Learning\n- Neural Networks\n- Natural Language Processing\n",
            "## Recent Developments\nIn recent years, we've seen significant advances in:\n",
            "1. Transformer architectures\n2. Self-supervised learning\n3. Multi-modal models\n\n",
            "## Practical Applications\nThese technologies have revolutionized:\n- Computer Vision\n- Language Processing\n- Robotics\n\n",
            "## Future Directions\nThe field is moving towards:\n",
            "- More efficient training methods\n- Better interpretability\n- Reduced computational requirements\n\n",
            "## Conclusion\nThe future of AI is incredibly promising, with new breakthroughs happening regularly.",
        ]

        for chunk in example_responses:
            await asyncio.sleep(0.5)  # delay 0.5 s
            yield chunk

    return StreamingResponse(fake_llm_response(), media_type="text/event-stream")
