from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class LOR(Base):
    __tablename__ = "lors"

    id = Column(Integer, primary_key=True, index=True)

    intern_id = Column(
        Integer,
        ForeignKey("interns.id"),
        nullable=False,
    )

    issue_date = Column(Date)

    issued_by = Column(String(100))

    status = Column(String(50))

    file_path = Column(String(255))

    intern = relationship("Intern")