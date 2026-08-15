from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)

    intern_id = Column(
        Integer,
        ForeignKey("interns.id"),
        nullable=False
    )

    certificate_number = Column(
        String(100),
        unique=True,
        nullable=False
    )

    issue_date = Column(Date)

    file_path = Column(String(255))

    qr_code = Column(String(255))

    intern = relationship("Intern")