class AppException(Exception):
    """Base application exception."""


class NotFoundError(AppException):
    """Raised when a requested resource is not found."""
