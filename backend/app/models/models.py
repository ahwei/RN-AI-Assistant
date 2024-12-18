from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from ..database import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)

    chats = relationship("Chat", back_populates="user")
    messages = relationship("Message", back_populates="user")


class Expert(Base):
    __tablename__ = "experts"

    expert_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    description = Column(String)
    avatar_url = Column(String, nullable=True)

    messages = relationship("Message", back_populates="expert")


class Chat(Base):
    __tablename__ = "chats"

    chat_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="chats")
    messages = relationship("Message", back_populates="chat")


class Message(Base):
    __tablename__ = "messages"

    message_id = Column(Integer, primary_key=True, autoincrement=True)
    chat_id = Column(Integer, ForeignKey("chats.chat_id"))
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    expert_id = Column(Integer, ForeignKey("experts.expert_id"), nullable=True)
    sender = Column(String)
    content = Column(Text)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    chat = relationship("Chat", back_populates="messages")
    user = relationship("User", back_populates="messages")
    expert = relationship("Expert", back_populates="messages")
