from sqlalchemy import Column, Integer, String, Date, Float
from app.db.base import Base
class Intern(Base):
    __tablename__ = "interns"

    id = Column(Integer, primary_key=True, index=True)

    # Existing fields
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    department = Column(String(100), nullable=False)
    college = Column(String(100), nullable=False)

    # Identity tab
    intern_id = Column(String(20), unique=True)
    internship_role = Column(String(100))
    referral_person = Column(String(100))
    dob = Column(Date)
    linkedin = Column(String(255))
    github = Column(String(255))
    year = Column(String(20))
    whatsapp_group = Column(String(50))
    location = Column(String(100))

    #Internship tab

    mode = Column(String(50))
    domain = Column(String(100))
    mentor = Column(String(100))
    organization = Column(String(100))
    start_date = Column(Date)
    end_date = Column(Date)
    duration = Column(String(50))
    status = Column(String(50))

    #work tab
    work_year = Column(String(20))
    work_domain = Column(String(100))
    responsibilities = Column(String(500))
    work_information = Column(String(1000))

    #attendance tab

    present_days = Column(Integer)
    absent_days = Column(Integer)
    leave_days = Column(Integer)
    working_days = Column(Integer)
    holidays = Column(Integer)
    attendance_percentage = Column(Float)

    #document tab
    offer_letter = Column(String(255))
    completion_letter = Column(String(255))
    lor = Column(String(255))
    certificate = Column(String(255))
    resume = Column(String(255))

    #verification tab
    verification_status = Column(String(50))
    verified_by = Column(String(100))
    verification_date = Column(Date)
    remarks = Column(String(500))