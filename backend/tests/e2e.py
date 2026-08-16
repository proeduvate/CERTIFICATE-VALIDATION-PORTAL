"""End-to-end check of the integrated stack against a running API."""

import json
import os
import urllib.error
import urllib.request
import uuid

API = "http://localhost:8000"

passed = 0
failed = 0


def call(method, path, body=None, token=None, headers=None):
    """Returns (status_code, parsed_body_or_text)."""
    data = json.dumps(body).encode() if body is not None else None

    req = urllib.request.Request(f"{API}{path}", data=data, method=method)
    if data is not None:
        req.add_header("Content-Type", "application/json")
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    for key, value in (headers or {}).items():
        req.add_header(key, value)

    try:
        with urllib.request.urlopen(req) as response:
            raw = response.read()
            try:
                return response.status, json.loads(raw)
            except ValueError:
                return response.status, raw
    except urllib.error.HTTPError as error:
        raw = error.read()
        try:
            return error.code, json.loads(raw)
        except ValueError:
            return error.code, raw


def upload(path, filename, content, content_type, token):
    """Minimal multipart POST — avoids a dependency just to send one file."""
    boundary = uuid.uuid4().hex

    body = (
        f'--{boundary}\r\n'
        f'Content-Disposition: form-data; name="file"; filename="{filename}"\r\n'
        f'Content-Type: {content_type}\r\n\r\n'
    ).encode() + content + f'\r\n--{boundary}--\r\n'.encode()

    req = urllib.request.Request(f"{API}{path}", data=body, method="POST")
    req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")
    req.add_header("Authorization", f"Bearer {token}")

    try:
        with urllib.request.urlopen(req) as response:
            return response.status, json.loads(response.read())
    except urllib.error.HTTPError as error:
        raw = error.read()
        try:
            return error.code, json.loads(raw)
        except ValueError:
            return error.code, raw


def check(name, expected, actual):
    global passed, failed
    if expected == actual:
        print(f"  \033[32m✓\033[0m {name:<54} {actual}")
        passed += 1
    else:
        print(f"  \033[31m✗\033[0m {name:<54} expected {expected!r}, got {actual!r}")
        failed += 1


def section(title):
    print(f"\n\033[1m── {title} {'─' * max(0, 66 - len(title))}\033[0m")


# ---------------------------------------------------------------- auth
section("Auth")

check("health", 200, call("GET", "/health")[0])

status, _ = call("POST", "/auth/register", {
    "full_name": "Dhanush C",
    "email": "admin@proeduvate.in",
    "password": "Passw0rd!",
})
check("register first user", 201, status)

check("duplicate email rejected", 400, call("POST", "/auth/register", {
    "full_name": "X", "email": "admin@proeduvate.in", "password": "Passw0rd!",
})[0])

check("short password rejected", 422, call("POST", "/auth/register", {
    "full_name": "X", "email": "x@y.com", "password": "short",
})[0])

status, login = call("POST", "/auth/login", {
    "email": "admin@proeduvate.in", "password": "Passw0rd!",
})
check("login via JSON body (not query string)", 200, status)
check("first user is admin (no manual SQL needed)", "admin", login["user"]["role"])

TOKEN = login["access_token"]

check("wrong password rejected", 401, call("POST", "/auth/login", {
    "email": "admin@proeduvate.in", "password": "wrongpass",
})[0])

unknown = call("POST", "/auth/login",
               {"email": "ghost@nowhere.com", "password": "wrongpass"})[1]
wrongpw = call("POST", "/auth/login",
               {"email": "admin@proeduvate.in", "password": "wrongpass"})[1]
check("no account enumeration (identical message)",
      unknown["detail"], wrongpw["detail"])

check("/auth/me works (previously 500)", 200, call("GET", "/auth/me", token=TOKEN)[0])
check("/auth/me rejects anonymous", True, call("GET", "/auth/me")[0] in (401, 403))

# ------------------------------------------------------- password reset
section("Password reset")

status, forgot = call("POST", "/auth/forgot-password",
                      {"email": "admin@proeduvate.in"})
RESET = forgot.get("reset_token")
check("forgot-password issues a token", True, bool(RESET))
check("unknown email gets the same 200", 200, call(
    "POST", "/auth/forgot-password", {"email": "ghost@nowhere.com"})[0])
check("unknown email leaks no token", None, call(
    "POST", "/auth/forgot-password",
    {"email": "ghost@nowhere.com"})[1].get("reset_token"))
check("forged token rejected", 401, call("POST", "/auth/reset-password", {
    "token": "forged.token.here", "new_password": "Hacked123!"})[0])
check("access token cannot be used as a reset token", 401, call(
    "POST", "/auth/reset-password",
    {"token": TOKEN, "new_password": "Hacked123!"})[0])
check("valid reset token works", 200, call("POST", "/auth/reset-password", {
    "token": RESET, "new_password": "Passw0rd!"})[0])

# ------------------------------------------------------------- interns
section("Interns")

status, intern = call("POST", "/interns/", {
    "name": "Aarav Menon",
    "email": "aarav@example.com",
    "department": "Computer Science",
    "college": "Anna University",
    "intern_id": "PEV-INT-000123",
    "internship_role": "Full Stack Developer Intern",
    "offer_letter": "uploads/documents/ol.pdf",
    "acknowledgement_letter": "uploads/documents/al.pdf",
    "terms_conditions": "uploads/documents/tc.pdf",
}, token=TOKEN)
check("create intern with only the 4 required fields", 201, status)
INTERN_ID = intern["id"]

check("list interns", 200, call("GET", "/interns/", token=TOKEN)[0])

detail = call("GET", f"/interns/{INTERN_ID}", token=TOKEN)[1]
check("detail includes id (was omitted)", INTERN_ID, detail["id"])
check("detail is grouped into sections", True,
      {"identity_details", "internship_information", "attendance_summary"}
      <= detail.keys())

check("partial update (was all-fields-or-422)", 200, call(
    "PUT", f"/interns/{INTERN_ID}",
    {"working_days": 100, "present_days": 95}, token=TOKEN)[0])

detail = call("GET", f"/interns/{INTERN_ID}", token=TOKEN)[1]
check("attendance recalculated server-side", 95.0,
      detail["attendance_summary"]["attendance_percentage"])
check("partial update preserved other fields", "Aarav Menon",
      detail["identity_details"]["name"])

check("duplicate intern email rejected", 400, call("POST", "/interns/", {
    "name": "Dup", "email": "aarav@example.com",
    "department": "X", "college": "Y"}, token=TOKEN)[0])
check("pagination", 200, call(
    "GET", "/interns/pagination?page=1&size=10", token=TOKEN)[0])
check("xlsx export", 200, call("GET", "/interns/export", token=TOKEN)[0])
check("missing intern 404s", 404, call(
    "GET", "/interns/99999", token=TOKEN)[0])

# -------------------------------------------------------- certificates
section("Certificates & public verification")

status, cert = call("POST", "/certificates/", {
    "intern_id": INTERN_ID, "issue_date": "2026-07-10"}, token=TOKEN)
check("issue certificate", 201, status)
NUMBER = cert["certificate_number"]
check("server assigned the reference", True, bool(NUMBER))

# The intern is not signed off yet, so this route withholds the record. The
# published case is asserted after sign-off, further down.
check("certificate route withholds an unverified record", 404,
      call("GET", f"/certificates/verify/{NUMBER}")[0])
check("unknown reference 404s", 404, call(
    "GET", "/certificates/verify/CERT-0000-0000")[0])
check("'verify' is not parsed as an id", 404, call(
    "GET", "/certificates/verify/not-a-number")[0])
check("admin lookup by number", 200, call(
    "GET", f"/certificates/number/{NUMBER}", token=TOKEN)[0])

listing = call("GET", "/certificates/", token=TOKEN)[1]
check("list row carries the intern name", "Aarav Menon",
      listing[0]["intern_name"])
check("list row carries the printed intern ID", "PEV-INT-000123",
      listing[0]["intern_code"])

# ------------------------------------------- verification by intern id
section("Public lookup withholds unverified records")

# Nothing is published before an administrator signs the record off.
status, public = call("GET", "/verify/PEV-INT-000123")
check("an unverified record still answers", 200, status)
check("but is flagged unverified", False, public["verified"])
check("and reports its status", "Pending", public["status"])
check("no intern block", None, public["intern"])
check("no internship block", None, public["internship"])
check("no certificate", None, public["certificate"])
check("no documents", [], public["documents"])

leaked = json.dumps(public)
check("the name does not appear anywhere", False, "Aarav Menon" in leaked)
check("no stored file paths appear", False, "uploads/" in leaked)

# The certificate number is a second public door onto the same record.
check("the certificate route withholds it too", 404,
      call("GET", f"/certificates/verify/{NUMBER}")[0])

check("unknown intern ID still 404s", 404, call("GET", "/verify/NOPE-000")[0])

# ------------------------------------------------ code-gated sign-off
# ------------------------------------------------ code-gated sign-off
section("Code-gated verification")

check("wrong code is refused", 403, call(
    "POST", f"/interns/{INTERN_ID}/verify",
    {"code": "not-the-code", "verified_by": "Someone"}, token=TOKEN)[0])
check("still unverified after a failed attempt", "Pending",
      call("GET", "/verify/PEV-INT-000123")[1]["status"])
check("correct code is accepted", 200, call(
    "POST", f"/interns/{INTERN_ID}/verify",
    {"code": "proeduvate-verify-2026", "verified_by": "Dhanush C",
     "remarks": "Checked all documents"}, token=TOKEN)[0])

public = call("GET", "/verify/PEV-INT-000123")[1]
check("now reads Verified publicly", "Verified",
      public["verification"]["status"])
check("records who signed it off", "Dhanush C",
      public["verification"]["verified_by"])

# Only now do the details become public.
check("the record is flagged verified", True, public["verified"])
check("the intern name is published", "Aarav Menon", public["intern"]["name"])
check("the internship is published", "Full Stack Developer Intern",
      public["internship"]["internship_role"])
check("the document slots are published", ["OL", "AL", "TC", "LOR"],
      [d["key"] for d in public["documents"]])
check("email is still withheld", False, "email" in public["intern"])
check("attendance is still withheld", False,
      any("days" in key for key in public["intern"]))
check("the certificate route works once verified", 200,
      call("GET", f"/certificates/verify/{NUMBER}")[0])
check("lookup is case-insensitive", 200,
      call("GET", "/verify/pev-int-000123")[0])

# Withdrawing the sign-off must hide it again.
call("POST", f"/interns/{INTERN_ID}/verify",
     {"code": "proeduvate-verify-2026", "verified_by": "Dhanush C",
      "verification_status": "Rejected"}, token=TOKEN)
rejected = call("GET", "/verify/PEV-INT-000123")[1]
check("a rejected record is hidden again", False, rejected["verified"])
check("and leaks nothing", False, "Aarav Menon" in json.dumps(rejected))

# Restore for the checks that follow.
call("POST", f"/interns/{INTERN_ID}/verify",
     {"code": "proeduvate-verify-2026", "verified_by": "Dhanush C"}, token=TOKEN)

# Editing must not silently undo a sign-off.
call("PUT", f"/interns/{INTERN_ID}", {"mentor": "New Mentor"}, token=TOKEN)
check("an edit does not reset verification", "Verified",
      call("GET", "/verify/PEV-INT-000123")[1]["verification"]["status"])

# ------------------------------------------- picker + lifecycle
section("Intern picker & lifecycle")

status, options = call("GET", "/interns/options?q=Aarav", token=TOKEN)
check("picker search finds by name", 200, status)
check("picker returns the match", "Aarav Menon", options["results"][0]["name"])
check("picker reports the full total", True, "total" in options)
check("picker search finds by intern ID", 1, len(
    call("GET", "/interns/options?q=PEV-INT-000123", token=TOKEN)[1]["results"]))
check("picker search finds by department", True, len(
    call("GET", "/interns/options?q=Computer", token=TOKEN)[1]["results"]) >= 1)
check("picker returns nothing for a miss", 0, len(
    call("GET", "/interns/options?q=zzzznomatch", token=TOKEN)[1]["results"]))
check("picker respects the limit", 1, len(
    call("GET", "/interns/options?limit=1", token=TOKEN)[1]["results"]))
check("picker payload stays narrow", set(), set(
    options["results"][0]) - {"id", "name", "intern_id", "department", "status"})

check("mark completed", 200, call(
    "POST", f"/interns/{INTERN_ID}/complete", token=TOKEN)[0])
check("status is now Completed", "Completed",
      call("GET", f"/interns/{INTERN_ID}", token=TOKEN)[1]
      ["internship_information"]["status"])
check("completing twice is refused", 400, call(
    "POST", f"/interns/{INTERN_ID}/complete", token=TOKEN)[0])
check("completed interns are excluded when asked", 0, len([
    r for r in call(
        "GET", "/interns/options?include_completed=false", token=TOKEN)[1]["results"]
    if r["id"] == INTERN_ID]))
check("completed interns are included by default", 1, len([
    r for r in call("GET", "/interns/options", token=TOKEN)[1]["results"]
    if r["id"] == INTERN_ID]))
check("reopen restores Active", "Active", call(
    "POST", f"/interns/{INTERN_ID}/reopen", token=TOKEN)[1]["status"])
# --------------------------------------------------- document uploads
section("Document uploads")

# A syntactically valid, minimal PDF.
PDF = (
    b"%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n"
    b"2 0 obj<</Type/Pages/Kids[]/Count 0>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF"
)

status, uploaded = upload(
    f"/interns/{INTERN_ID}/documents/offer_letter",
    "offer.pdf", PDF, "application/pdf", TOKEN)
check("upload an offer letter", 200, status)
check("stored under the upload directory", True,
      uploaded["path"].startswith("uploads/documents/"))
check("the client filename is not reused on disk", False,
      os.path.basename(uploaded["path"]) == "offer.pdf")

check("a disallowed type is refused", 415, upload(
    f"/interns/{INTERN_ID}/documents/lor",
    "x.exe", b"MZ", "application/x-msdownload", TOKEN)[0])
check("an empty file is refused", 400, upload(
    f"/interns/{INTERN_ID}/documents/lor",
    "e.pdf", b"", "application/pdf", TOKEN)[0])
check("an unknown document slot is refused", 400, upload(
    f"/interns/{INTERN_ID}/documents/nonsense",
    "a.pdf", PDF, "application/pdf", TOKEN)[0])

public = call("GET", "/verify/PEV-INT-000123")[1]
by_key = {d["key"]: d["url"] for d in public["documents"]}
check("the upload appears on public verification", True, bool(by_key["OL"]))

first_path = uploaded["path"]
replaced = upload(
    f"/interns/{INTERN_ID}/documents/offer_letter",
    "offer2.pdf", PDF, "application/pdf", TOKEN)[1]
check("replacing stores a new path", True, replaced["path"] != first_path)

# An unrelated edit must not clear an uploaded document.
call("PUT", f"/interns/{INTERN_ID}", {"mentor": "Someone Else"}, token=TOKEN)
check("an edit does not wipe uploads", True, bool(
    {d["key"]: d["url"]
     for d in call("GET", "/verify/PEV-INT-000123")[1]["documents"]}["OL"]))

check("removing a document succeeds", 200, call(
    "DELETE", f"/interns/{INTERN_ID}/documents/offer_letter", token=TOKEN)[0])
check("the removed document leaves verification", None,
      {d["key"]: d["url"]
       for d in call("GET", "/verify/PEV-INT-000123")[1]["documents"]}["OL"])

# ------------------------------------------------------ lor & documents
section("LOR & documents")

# Letters are uploaded through the intern's own document slots, so the LOR
# listing is derived and read-only.
check("no LOR record can be created", 405, call("POST", "/lors/", {
    "intern_id": INTERN_ID}, token=TOKEN)[0])
check("list LORs", 200, call("GET", "/lors/", token=TOKEN)[0])
check("an intern without a letter is absent", 0, len(
    call("GET", "/lors/", token=TOKEN)[1]))

upload(f"/interns/{INTERN_ID}/documents/lor",
       "lor.pdf", PDF, "application/pdf", TOKEN)

lors = call("GET", "/lors/", token=TOKEN)[1]
check("uploading against the intern lists the letter", 1, len(lors))
check("the row is keyed on the intern", INTERN_ID, lors[0]["intern_id"])
check("and carries the intern name", "Aarav Menon", lors[0]["intern_name"])
check("and the stored letter", True,
      (lors[0]["file_path"] or "").startswith("uploads/documents/"))
check("the listing is searchable", 1, len(
    call("GET", "/lors/?q=Aarav", token=TOKEN)[1]))
check("and filters out non-matches", 0, len(
    call("GET", "/lors/?q=zzzznomatch", token=TOKEN)[1]))

# The letter shown publicly is the one uploaded against the intern.
published = {d["key"]: d["url"]
             for d in call("GET", "/verify/PEV-INT-000123")[1]["documents"]}
check("the uploaded letter is the one published", lors[0]["file_path"],
      (published["LOR"] or "").lstrip("/"))

check("removing it drops the row", 200, call(
    "DELETE", f"/interns/{INTERN_ID}/documents/lor", token=TOKEN)[0])
check("the listing is empty again", 0, len(
    call("GET", "/lors/", token=TOKEN)[1]))
check("intern with no documents returns empty, not 404", 200, call(
    "GET", f"/documents/intern/{INTERN_ID}", token=TOKEN)[0])
check("create document", 201, call("POST", "/documents/", {
    "intern_id": INTERN_ID,
    "offer_letter": "uploads/offer.pdf"}, token=TOKEN)[0])

docs = call("GET", f"/documents/intern/{INTERN_ID}", token=TOKEN)[1]
check("intern documents expose the offer letter",
      "uploads/offer.pdf", docs["offer_letter_url"])

# ----------------------------------------------------------- dashboard
section("Dashboard")

status, summary = call("GET", "/dashboard/summary", token=TOKEN)
check("summary", 200, status)
check("certificates_issued is real (was hardcoded 0)", 1,
      summary["certificates_issued"])
check("lors_issued counts intern records", 0, summary["lors_issued"])
check("total_interns", 1, summary["total_interns"])
check("mode distribution computed (was zeros)", True,
      bool(summary["internship_mode_distribution"]))
check("department distribution computed", True,
      bool(summary["department_distribution"]))
check("average attendance computed", 95.0, summary["average_attendance"])

# ------------------------------------------------------- authorization
section("Authorization")

call("POST", "/auth/register", {
    "full_name": "Intern User", "email": "intern@proeduvate.in",
    "password": "Passw0rd!"})
ITOKEN = call("POST", "/auth/login", {
    "email": "intern@proeduvate.in",
    "password": "Passw0rd!"})[1]["access_token"]

check("second user is NOT admin", "intern",
      call("GET", "/auth/me", token=ITOKEN)[1]["role"])
check("non-admin blocked from dashboard", 403, call(
    "GET", "/dashboard/summary", token=ITOKEN)[0])
check("non-admin cannot create interns", 403, call("POST", "/interns/", {
    "name": "N", "email": "n@x.com", "department": "D",
    "college": "C"}, token=ITOKEN)[0])
check("non-admin cannot delete interns", 403, call(
    "DELETE", f"/interns/{INTERN_ID}", token=ITOKEN)[0])
check("non-admin cannot issue certificates", 403, call(
    "POST", "/certificates/",
    {"intern_id": INTERN_ID, "issue_date": "2026-07-10"}, token=ITOKEN)[0])
check("non-admin CAN read interns", 200, call(
    "GET", "/interns/", token=ITOKEN)[0])
check("garbage token rejected", 401, call(
    "GET", "/interns/", token="garbage")[0])
check("non-admin cannot verify even with the code", 403, call(
    "POST", f"/interns/{INTERN_ID}/verify",
    {"code": "proeduvate-verify-2026", "verified_by": "Sneaky"},
    token=ITOKEN)[0])
check("non-admin cannot complete an internship", 403, call(
    "POST", f"/interns/{INTERN_ID}/complete", token=ITOKEN)[0])
check("non-admin cannot reopen an internship", 403, call(
    "POST", f"/interns/{INTERN_ID}/reopen", token=ITOKEN)[0])
check("non-admin cannot upload documents", 403, upload(
    f"/interns/{INTERN_ID}/documents/offer_letter",
    "a.pdf", PDF, "application/pdf", ITOKEN)[0])

# ------------------------------------------------------------------ cors
section("CORS")

status, _ = call("OPTIONS", "/interns/", headers={
    "Origin": "http://localhost:5173",
    "Access-Control-Request-Method": "GET",
    "Access-Control-Request-Headers": "authorization",
})
check("preflight succeeds", 200, status)

req = urllib.request.Request(f"{API}/interns/", method="OPTIONS")
req.add_header("Origin", "http://localhost:5173")
req.add_header("Access-Control-Request-Method", "GET")
with urllib.request.urlopen(req) as response:
    check("preflight allows the Vite origin", "http://localhost:5173",
          response.headers.get("access-control-allow-origin"))

print(f"\n{'═' * 72}")
colour = "\033[32m" if failed == 0 else "\033[31m"
print(f"  {colour}PASSED: {passed}   FAILED: {failed}\033[0m")
print(f"{'═' * 72}")

raise SystemExit(1 if failed else 0)
