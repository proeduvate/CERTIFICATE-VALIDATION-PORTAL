from sqlalchemy import Column, Integer, String, Date, ForeignKey, LargeBinary, Boolean
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)

    intern_id = Column(
        Integer,
        ForeignKey("interns.id", ondelete="CASCADE"),
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
    image_data = Column(LargeBinary, nullable=True)
    is_frozen = Column(Boolean, default=False, nullable=False)

    qr_code = Column(String(255))

    intern = relationship("Intern", back_populates="certificates")