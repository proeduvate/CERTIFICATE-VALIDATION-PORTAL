import os
import uuid

from fastapi import HTTPException, UploadFile, status

from app.core.config import settings

# Documents are letters and certificates: PDFs, or scans/photos of them.
ALLOWED_CONTENT_TYPES = {
    "application/pdf": ".pdf",
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/webp": ".webp",
}

MAX_UPLOAD_BYTES = 10 * 1024 * 1024


def save_upload(file: UploadFile, folder: str, stem: str) -> str:
    """
    Persist an uploaded file and return the stored path.

    The client filename is never used on disk. It can contain path separators
    ("../" escapes the upload directory) and two uploads sharing a name would
    silently overwrite each other, so the name is generated from `stem` plus a
    random suffix, and the extension comes from the declared content type
    rather than from the filename.
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

    directory = os.path.join(settings.UPLOAD_DIR, folder)
    os.makedirs(directory, exist_ok=True)

    safe_stem = "".join(
        char if char.isalnum() or char in "-_" else "-" for char in stem
    ).strip("-") or "document"

    extension = ALLOWED_CONTENT_TYPES[file.content_type]
    name = f"{safe_stem}-{uuid.uuid4().hex[:8]}{extension}"
    path = os.path.join(directory, name)

    with open(path, "wb") as handle:
        handle.write(contents)

    # Forward slashes so the path works as a URL against the /uploads mount.
    return path.replace(os.sep, "/")


def delete_upload(path: str | None) -> None:
    """Remove a stored file, ignoring one that has already gone."""
    if not path:
        return

    # Only ever delete inside the upload directory.
    normalised = os.path.normpath(path)
    if not normalised.startswith(os.path.normpath(settings.UPLOAD_DIR)):
        return

    try:
        os.remove(normalised)
    except OSError:
        pass
