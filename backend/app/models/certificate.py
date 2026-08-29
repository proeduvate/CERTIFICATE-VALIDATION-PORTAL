from sqlalchemy import Column, Integer, String, Date, ForeignKey, LargeBinary
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
    file_data = Column(LargeBinary, nullable=True)
    file_mime_type = Column(String(100), nullable=True)
    file_name = Column(String(255), nullable=True)

    qr_code = Column(String(255))

    intern = relationship("Intern")