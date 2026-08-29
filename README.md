# ProEduvate — Certificate Validation Portal

Internship management for administrators, and public certificate verification
for anyone holding a reference number.

```
backend/    FastAPI + SQLAlchemy API
frontend/   React 19 + Vite single-page app
```

## Running it locally

Two processes: the API on `:8000` and the frontend on `:5173`.

### 1. Database

PostgreSQL. Create the database once:

```bash
createdb proeduvate_portal
```

### 2. Backend

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r app/requirements.txt
cp .env.example .env          # set DATABASE_URL to your Postgres user
.venv/bin/alembic upgrade head
.venv/bin/python -m uvicorn app.main:app --reload --port 8000
```

Interactive API docs: <http://localhost:8000/docs>

The schema is owned by Alembic — the app does **not** create tables on start,
so `alembic upgrade head` is required before first run and after every pull
that adds a migration.

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env          # points at http://localhost:8000
npm run dev -- --port 5173
```

Port 5173 matters: it is the origin allowed by `CORS_ORIGINS` in the backend
`.env`. Change both together if you use a different port.

### 4. Create your account

Register at <http://localhost:5173/login> → "Forgot your password?" has the
sign-up path, or POST directly:

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"full_name":"Your Name","email":"you@example.com","password":"ChangeMe123!"}'
```

**The first account registered becomes the administrator.** Every later account
is created as `intern` (read-only). Promote someone afterwards with:

```sql
UPDATE users SET role = 'admin' WHERE email = 'them@example.com';
```

## Migrations

The schema lives in `backend/migrations/`. After changing a model:

```bash
cd backend
.venv/bin/alembic revision --autogenerate -m "what changed"
```

Read the generated file before applying it — autogenerate is a starting point,
not an oracle. It does not detect table or column renames (it emits a drop plus
an add, which loses the data), and it cannot infer how to backfill a new
NOT NULL column.

```bash
.venv/bin/alembic upgrade head     # apply
.venv/bin/alembic downgrade -1     # step back one
.venv/bin/alembic current          # what is applied
.venv/bin/alembic history          # full history
```

`migrations/env.py` takes the URL from `app.core.config.settings`, so
migrations always target the same database as the application.

To confirm models and database agree, autogenerate a throwaway revision: an
empty `upgrade()` means there is no drift. Delete the file afterwards.

## Verifying the stack

With both services running:

```bash
python3 backend/tests/e2e.py
```

Exercises authentication, roles, CRUD, public verification, and CORS against a
live server. Run it against an empty database (`rm backend/app.db`) — it
registers the first user and expects that account to be the admin.

## Roles

| | Intern | Admin |
|---|---|---|
| Read interns, certificates, LORs, documents | ✅ | ✅ |
| Create / edit / delete records | ❌ | ✅ |
| Issue certificates and letters | ❌ | ✅ |
| Dashboard summary | ❌ | ✅ |

### Verification

Public verification (`GET /api/v1/verify/{intern_id}`) needs no account. It is keyed on
the **intern ID** printed on the certificate and returns the intern's public
identity, the internship, the certificate issued for it, and the supporting
documents — offer letter (OL), acknowledgement letter (AL), terms and
conditions (TC), and the letter of recommendation (LOR) where one exists.

Email, date of birth, attendance and internal remarks are withheld.

Marking a record verified is a **separate, code-gated action**, not a field in
the edit form. An admin must also enter the shared `VERIFICATION_CODE`, so only
the admins entrusted with it can sign a record off even though any admin can
edit one. Editing a record never resets its verification.

### Documents

Admins upload the documents themselves — offer letter (OL), acknowledgement
letter (AL), terms and conditions (TC) and, if issued, the letter of
recommendation (LOR). Paths are never typed in.

Files are stored under `backend/uploads/` and served from `/uploads`. The
client filename is never used on disk: it can contain path separators, and two
uploads sharing a name would overwrite each other, so names are generated and
the extension comes from the declared content type. PDFs and images up to
10 MB are accepted.

Uploads apply immediately rather than on form submit, and replacing a document
deletes the file it supersedes.

### Attendance

Attendance is not entered through the admin forms. The Attendance page reads
whatever the intern records currently hold and is a placeholder until the
existing attendance database is connected.

## Notes for deployment

- Set a real `SECRET_KEY` — `python -c "import secrets; print(secrets.token_urlsafe(48))"`.
- Set `CORS_ORIGINS` to your deployed frontend origin.
- `/auth/forgot-password` returns the reset token in its response because no
  mail transport is configured yet. Send it by email and stop returning it
  before going live.
- Run `alembic upgrade head` as part of deployment, before starting the app.
- Change `VERIFICATION_CODE` from its default and share it only with the
  admins allowed to sign records off.
