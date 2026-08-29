import uuid

from fastapi import HTTPException, UploadFile, status

# Documents are letters and certificates: PDFs, or scans/photos of them.
ALLOWED_CONTENT_TYPES = {
    "application/pdf": ".pdf",
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/webp": ".webp",
}

MAX_UPLOAD_BYTES = 10 * 1024 * 1024


def read_and_validate_upload(file: UploadFile, stem: str) -> tuple[bytes, str, str]:
    """
    Validate an uploaded file and return (contents, content_type, filename).

    File contents are returned in memory for storing directly in the database.
    """
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Upload a PDF or an image (PNG, JPEG or WebP)",
        )

    contents = file.file.read()

    if not contents:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="That file is empty",
        )

    if len(contents) > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File must be 10 MB or smaller",
        )

    safe_stem = "".join(
        char if char.isalnum() or char in "-_" else "-" for char in stem
    ).strip("-") or "document"

    extension = ALLOWED_CONTENT_TYPES[file.content_type]
    name = f"{safe_stem}-{uuid.uuid4().hex[:8]}{extension}"

    return contents, file.content_type, name


def save_upload(file: UploadFile, folder: str, stem: str) -> tuple[bytes, str, str]:
    """Backwards compatible helper returning (contents, content_type, name)."""
    return read_and_validate_upload(file, stem)


def delete_upload(path: str | None) -> None:
    """No-op when files are stored in database."""
    pass

