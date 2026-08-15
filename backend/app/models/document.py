from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)

    intern_id = Column(
        Integer,
        ForeignKey("interns.id"),
        nullable=False,
    )

    appointment_letter = Column(String(255))
    offer_letter = Column(String(255))
    transfer_certificate = Column(String(255))
    other_document = Column(String(255))

    intern = relationship("Intern")