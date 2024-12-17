from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from ..core.openai_config import get_chat_completion
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

    expert = db.query(Expert).filter(Expert.expert_id == expert_id).first()
    if not expert:
        raise HTTPException(status_code=404, detail="Expert not found")

    messages = (
        db.query(Message)
        .filter(Message.chat_id == chat_id)
        .order_by(Message.timestamp)
        .all()
    )
    if not messages:
        raise HTTPException(status_code=404, detail="Chat history not found")

    #  messages
    system_prompt = f"""You are a professional {expert.name}.
    Your expertise is in {expert.description}.
    Please respond to user questions in a professional and friendly manner.
    Use markdown format for your responses.
    Ensure your answers are well-structured and informative.
    Focus on providing accurate, up-to-date information in your area of expertise.
    """

    openai_messages = [{"role": "system", "content": system_prompt}]

    # add history message
    for msg in messages:
        role = "assistant" if msg.sender == "expert" else "user"
        openai_messages.append({"role": role, "content": msg.content})

    async def stream_response():
        response = await get_chat_completion(openai_messages)

        async for chunk in response:
            if chunk.choices[0].delta.content is not None:
                yield chunk.choices[0].delta.content

    return StreamingResponse(stream_response(), media_type="text/event-stream")


@router.get("/users/{user_id}/chats/", response_model=list)
def get_user_chats(user_id: int, db: Session = Depends(get_db)):
    chats = (
        db.query(Chat)
        .filter(Chat.user_id == user_id)
        .order_by(Chat.chat_id.desc())
        .limit(10)
        .all()
    )
    return [{"chat_id": chat.chat_id, "user_id": chat.user_id} for chat in chats]
