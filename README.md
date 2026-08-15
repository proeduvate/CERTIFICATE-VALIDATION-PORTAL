# ProEduvate — Certificate Validation Portal

Internship management for administrators, and public certificate verification
for anyone holding a reference number.

```
backend/    FastAPI + SQLAlchemy API
frontend/   React 19 + Vite single-page app
```

## Running it locally

Two processes: the API on `:8000` and the frontend on `:5173`.

### 1. Backend

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r app/requirements.txt
cp .env.example .env          # defaults work as-is for local development
.venv/bin/python -m uvicorn app.main:app --reload --port 8000
```

Interactive API docs: <http://localhost:8000/docs>

The default `.env` uses SQLite (`app.db`), created on first start. For MySQL,
set `DATABASE_URL=mysql+pymysql://user:password@localhost:3306/proeduvate`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env          # points at http://localhost:8000
npm run dev -- --port 5173
```

Port 5173 matters: it is the origin allowed by `CORS_ORIGINS` in the backend
`.env`. Change both together if you use a different port.

### 3. Create your account

Register at <http://localhost:5173/login> → "Forgot your password?" has the
sign-up path, or POST directly:

```bash
curl -X POST http://localhost:8000/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"full_name":"Your Name","email":"you@example.com","password":"ChangeMe123!"}'
```

**The first account registered becomes the administrator.** Every later account
is created as `intern` (read-only). Promote someone afterwards with:

```sql
UPDATE users SET role = 'admin' WHERE email = 'them@example.com';
```

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

Public certificate verification (`GET /certificates/verify/{number}`) needs no
account at all, and returns a narrow projection: it confirms issuance and
describes the internship without exposing the intern's contact details,
attendance or documents.

## Notes for deployment

- Set a real `SECRET_KEY` — `python -c "import secrets; print(secrets.token_urlsafe(48))"`.
- Set `CORS_ORIGINS` to your deployed frontend origin.
- `/auth/forgot-password` returns the reset token in its response because no
  mail transport is configured yet. Send it by email and stop returning it
  before going live.
- `create_tables()` runs at import and only creates missing tables; it will not
  migrate existing ones. Adopt Alembic before changing a live schema.
