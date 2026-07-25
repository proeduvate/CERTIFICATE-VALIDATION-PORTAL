from fastapi import Depends, HTTPException, status
from app.core.security import get_current_user

def role_required(allowed_roles: list):
    def checker(current_user=Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access Denied"
            )
        return current_user
    return checker