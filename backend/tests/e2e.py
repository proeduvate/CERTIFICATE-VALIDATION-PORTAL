"""End-to-end check of the integrated stack against a running API."""

import json
import urllib.error
import urllib.request

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

status, public = call("GET", f"/certificates/verify/{NUMBER}")
check("PUBLIC verify works with no token", 200, status)
check("public verify returns the intern name", "Aarav Menon",
      public["intern_name"])
check("public verify withholds email", False, "email" in public)
check("public verify withholds attendance", False,
      "present_days" in public)
check("unknown reference 404s", 404, call(
    "GET", "/certificates/verify/CERT-0000-0000")[0])
check("'verify' is not parsed as an id", 404, call(
    "GET", "/certificates/verify/not-a-number")[0])
check("admin lookup by number", 200, call(
    "GET", f"/certificates/number/{NUMBER}", token=TOKEN)[0])

# ------------------------------------------------------ lor & documents
section("LOR & documents")

check("create LOR", 201, call("POST", "/lors/", {
    "intern_id": INTERN_ID, "issue_date": "2026-07-11",
    "issued_by": "Preethi R", "status": "Issued"}, token=TOKEN)[0])
check("list LORs", 200, call("GET", "/lors/", token=TOKEN)[0])
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
check("lors_issued is real", 1, summary["lors_issued"])
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
