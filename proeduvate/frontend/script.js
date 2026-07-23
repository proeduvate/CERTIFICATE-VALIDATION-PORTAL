const defaultStore = {
  students: {
    STU001: {
      password: "student123",
      section1: {
        verificationStatus: "Verified",
        verifiedBy: "R. Kumar",
        verificationDateTime: "2026-01-12T10:30",
        leaveCalendar: "Pongal - 2026-01-14\nDiwali - 2026-11-08",
        mentorFeedback: "2026-01-22: Good progress in UI tasks.\n2026-02-02: Strong ownership on dashboard polish.",
        performanceMetrics: "Task Completion: 88%\nCode Quality: 4/5"
      },
      section2: {
        internName: "Arun Prakash",
        internId: "STU001",
        departmentYear: "CSE - 3rd Year",
        internshipRole: "Frontend Intern",
        college: "ABC Engineering College",
        referralPerson: "Mr. Suresh",
        email: "arun.prakash@college.edu",
        phone: "+91 98765 43210",
        whatsappGroup: "https://chat.whatsapp.com/example",
        resume: "https://example.com/resume/stu001.pdf",
        profileDetails: "Hobby: Chess\nLocation: Chennai\nLinkedIn: https://linkedin.com/in/stu001\nGitHub: https://github.com/stu001\nDOB: 2004-04-14\nCertifications: JS Basics\nSkill set: HTML, CSS, JS\nPast Internship: Web Intern at XYZ (2 months), Tech stack: React"
      },
      section3: {
        organizationName: "ProEduvate",
        internshipType: "Academic",
        internshipMode: "Hybrid",
        duration: "6 months",
        yearCompletion: "2026",
        joiningDate: "2025-12-01",
        completionDate: "2026-05-31",
        domain: "Frontend Development",
        mentorName: "Ms. Priya N.",
        statusStage: "Active"
      },
      section4: {
        responsibilities: "Build and maintain frontend modules.",
        tasks: "2026-01-02 - Landing page redesign - https://github.com/example/task1\n2026-01-15 - Component library update",
        projects: "Project: Internship Tracker\nStart: 2026-01-01\nEffective: 2026-01-03\nActual Completion: 2026-01-25\nRating: 4/5",
        toolsTechnologies: "HTML, CSS, JavaScript, Figma",
        tasksAssigned: "24",
        tasksCompleted: "19",
        tasksPending: "5",
        recentActivity: "2026-02-03: Submitted dashboard v2\n2026-02-06: Fixed responsive bugs\n2026-02-09: Added timeline animation"
      },
      section5: {
        leaveDays: "2",
        approvedHolidays: "2",
        presentDays: "20",
        attendancePercentage: "90",
        attendanceStatus: "Great",
        totalWorkingDays: "24",
        leavesTaken: "2",
        leavesToCompensate: "0"
      },
      section6: {
        lorStatus: "Received",
        issuedBy: "CTO - ProEduvate",
        issueDate: "2026-02-01",
        downloadButtonLink: "https://example.com/lor/stu001.pdf"
      },
      section7: {
        certificateId: "CERT-STU001-2026",
        issueDate: "2026-02-05",
        status: "Issued",
        downloadCertificate: "https://example.com/certificate/stu001.pdf",
        qrCode: "https://example.com/certificate/stu001-qr.png",
        documents: "AL: https://example.com/al.pdf\nTC: https://example.com/tc.pdf\nOL: https://example.com/ol.pdf\nOTHERS: https://example.com/other.pdf"
      },
      section8: {
        referenceId: "REF-STU001-7781",
        dataSource: "Internal Internship Portal",
        disclaimer: "This record is generated for verification purposes only."
      }
    }
  }
};

const state = {
  userRole: null,
  selectedStudentId: null,
  store: loadStore()
};

const els = {
  loginView: document.getElementById("loginView"),
  dashboardView: document.getElementById("dashboardView"),
  loginForm: document.getElementById("loginForm"),
  role: document.getElementById("role"),
  username: document.getElementById("username"),
  password: document.getElementById("password"),
  loginError: document.getElementById("loginError"),
  studentIdLabel: document.getElementById("studentIdLabel"),
  welcomeTitle: document.getElementById("welcomeTitle"),
  roleInfo: document.getElementById("roleInfo"),
  logoutBtn: document.getElementById("logoutBtn"),
  roleBadge: document.getElementById("roleBadge"),
  studentPicker: document.getElementById("studentPicker"),
  studentPickerWrap: document.getElementById("studentPickerWrap"),
  summaryCards: document.getElementById("summaryCards"),
  companyLogo: document.getElementById("companyLogo"),
  logoFallback: document.getElementById("logoFallback")
};

let revealObserver = null;

setupLogoFallback();
setupRevealAnimations();

els.role.addEventListener("change", () => {
  const role = els.role.value;
  const isAdminLike = role === "admin" || role === "hr";
  const labelText = els.studentIdLabel.querySelector("span");
  if (labelText) labelText.textContent = isAdminLike ? "EMAIL" : "STUDENT ID";
  els.username.type = isAdminLike ? "email" : "text";
  els.username.value = isAdminLike ? "admin@techspark.in" : "STU001";
  els.password.value = isAdminLike ? "password123" : "student123";
  document.querySelectorAll(".role-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.role === role);
  });
});

document.querySelectorAll(".role-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    els.role.value = btn.dataset.role;
    els.role.dispatchEvent(new Event("change"));
  });
});

els.loginForm.addEventListener("submit", handleLogin);
els.logoutBtn.addEventListener("click", logout);
els.studentPicker.addEventListener("change", (e) => {
  state.selectedStudentId = e.target.value;
  renderDashboard();
});

function loadStore() {
  const raw = localStorage.getItem("internPortalDataV2");
  if (!raw) {
    localStorage.setItem("internPortalDataV2", JSON.stringify(defaultStore));
    return structuredClone(defaultStore);
  }
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem("internPortalDataV2", JSON.stringify(defaultStore));
    return structuredClone(defaultStore);
  }
}

function persistStore() {
  localStorage.setItem("internPortalDataV2", JSON.stringify(state.store));
}

function handleLogin(e) {
  e.preventDefault();
  const role = els.role.value;
  const username = els.username.value.trim();
  const password = els.password.value;

  if (role === "admin") {
    if ((username === "admin" && password === "admin123") || (username === "admin@techspark.in" && password === "password123")) {
      enterDashboard("admin");
      return;
    }
    showError("Invalid admin credentials.");
    return;
  }

  if (role === "hr") {
    if (username === "hr" && password === "hr123") {
      enterDashboard("hr");
      return;
    }
    showError("Invalid HR credentials.");
    return;
  }

  const student = state.store.students[username];
  if (!student || student.password !== password) {
    showError("Invalid student credentials.");
    return;
  }

  enterDashboard("student", username);
}

function showError(msg) {
  els.loginError.textContent = msg;
}

function enterDashboard(role, studentId = null) {
  state.userRole = role;
  state.selectedStudentId = studentId || Object.keys(state.store.students)[0] || null;
  els.loginError.textContent = "";
  els.loginView.classList.add("hidden");
  els.dashboardView.classList.remove("hidden");
  renderDashboard();
}

function logout() {
  state.userRole = null;
  state.selectedStudentId = null;
  els.loginForm.reset();
  els.role.value = "admin";
  els.role.dispatchEvent(new Event("change"));
  els.dashboardView.classList.add("hidden");
  els.loginView.classList.remove("hidden");
  const address = document.querySelector(".browser-address");
  if (address) address.textContent = "app.interntrack.in/login";
}

const internDirectory = [
  {
    id: "INT001",
    initials: "AK",
    initialsClass: "ak",
    name: "Arunima Krishnan",
    year: "3rd Year",
    college: "SSN College",
    department: "UI/UX Design Intern",
    status: "Verified",
    statusClass: "verified",
    role: "UI/UX Design",
    duration: "6 months",
    mode: "Hybrid",
    mentor: "Meera Nair",
    attendance: 92,
    startDate: "2026-01-05",
    completionDate: "2026-06-30",
    responsibilities: "Design wireframes and prototypes, conduct user research, prepare design documentation.",
    tasks: [
      { title: "User flow diagram", date: "15 Jan" },
      { title: "Landing page mockup", date: "28 Jan" }
    ],
    lorStatus: "Ready for issue",
    certificateStatus: "In progress",
    email: "arunima.krishnan@college.edu"
  },
  {
    id: "INT002",
    initials: "DB",
    initialsClass: "db",
    name: "Dinesh Balaji",
    year: "4th Year",
    college: "Anna University",
    department: "Full Stack Dev Intern",
    status: "Pending",
    statusClass: "pending",
    role: "Full Stack Dev",
    duration: "4 months",
    mode: "Remote",
    mentor: "Karthik R.",
    attendance: 76,
    startDate: "2026-02-01",
    completionDate: "2026-05-31",
    responsibilities: "Build APIs, connect frontend screens, and support database cleanup.",
    tasks: [
      { title: "Auth API testing", date: "12 Feb" },
      { title: "Dashboard endpoint wiring", date: "21 Feb" }
    ],
    lorStatus: "Pending review",
    certificateStatus: "Not started",
    email: "dinesh.balaji@college.edu"
  },
  {
    id: "INT003",
    initials: "PS",
    initialsClass: "ps",
    name: "Priya Subramanian",
    year: "3rd Year",
    college: "IIT Madras",
    department: "Data Science Intern",
    status: "Completing",
    statusClass: "completing",
    role: "Data Science",
    duration: "3 months",
    mode: "On-site",
    mentor: "Ananya S.",
    attendance: 88,
    startDate: "2026-03-01",
    completionDate: "2026-06-28",
    responsibilities: "Prepare data notebooks, validate models, and summarize insights.",
    tasks: [
      { title: "Churn analysis notebook", date: "04 Apr" },
      { title: "Model accuracy report", date: "19 Apr" }
    ],
    lorStatus: "Drafted",
    certificateStatus: "Awaiting final attendance",
    email: "priya.subramanian@college.edu"
  },
  {
    id: "INT004",
    initials: "RK",
    initialsClass: "rk",
    name: "Ranjith Kumar",
    year: "3rd Year",
    college: "VIT Chennai",
    department: "Backend Dev Intern",
    status: "Not verified",
    statusClass: "not-verified",
    role: "Backend Dev",
    duration: "6 months",
    mode: "Hybrid",
    mentor: "Admin",
    attendance: 64,
    startDate: "2026-02-10",
    completionDate: "2026-08-10",
    responsibilities: "Maintain services, write integration tests, and document internal APIs.",
    tasks: [
      { title: "Leave service cleanup", date: "09 Mar" },
      { title: "Certificate API notes", date: "18 Mar" }
    ],
    lorStatus: "Blocked until verification",
    certificateStatus: "Not eligible",
    email: "ranjith.kumar@college.edu"
  }
];

let internFilter = "all";
let internSearch = "";
let adminActiveTab = "identity";
let calendarYear = 2025;
let calendarMonth = 3;

function renderInternTrackShell(activePage, pageTitle, contentHtml) {
  const address = document.querySelector(".browser-address");
  if (address) address.textContent = `app.interntrack.in/${activePage}`;

  els.dashboardView.innerHTML = `
    <aside class="interntrack-sidebar">
      <div class="dashboard-brand">
        <span class="dashboard-brand-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="6" fill="#4B8DF7"></rect>
            <path d="M12 6.5l5 2.8-5 2.8-5-2.8 5-2.8Z" stroke="white" stroke-width="1.4" stroke-linejoin="round"></path>
            <path d="M7 12.5l5 2.8 5-2.8M7 16l5 2.8 5-2.8" stroke="white" stroke-width="1.4" stroke-linecap="round"></path>
          </svg>
        </span>
        <strong>InternTrack</strong>
      </div>

      <nav class="dashboard-nav">
        <p>MAIN</p>
        <button class="${activePage === "dashboard" ? "active" : ""}" type="button" data-page="dashboard"><span></span>Dashboard</button>
        <button class="${activePage === "interns" ? "active" : ""}" type="button" data-page="interns"><span></span>Interns</button>
        <button class="${activePage === "calendar" ? "active" : ""}" type="button" data-page="calendar"><span></span>Calendar</button>
        <button class="${activePage === "reports" ? "active" : ""}" type="button" data-page="reports"><span></span>Reports</button>
      </nav>

      <nav class="dashboard-nav dashboard-admin-nav">
        <p>ADMIN</p>
        <button class="${activePage === "admin" ? "active" : ""}" type="button" data-page="admin"><span></span>Admin Form</button>
      </nav>

      <div class="dashboard-admin-profile">
        <div>A</div>
        <span><strong>Admin</strong>Administrator</span>
      </div>
    </aside>

    <section class="interntrack-main">
      <header class="interntrack-topbar">
        <h1>${pageTitle}</h1>
        <div class="interntrack-top-actions">
          <label class="interntrack-search">
            <span aria-hidden="true"></span>
            <input data-action="global-search" type="search" placeholder="Search interns..." value="${escapeAttr(internSearch)}" />
          </label>
          <button class="interntrack-bell" type="button" aria-label="Notifications"></button>
          <button class="interntrack-avatar" type="button" aria-label="Profile">A</button>
        </div>
      </header>

      ${contentHtml}
    </section>
  `;

  bindInternTrackNavigation();
  bindSharedActions();
}

function bindInternTrackNavigation() {
  document.querySelectorAll("[data-page='dashboard']").forEach((button) => {
    button.addEventListener("click", renderDashboard);
  });
  document.querySelectorAll("[data-page='interns']").forEach((button) => {
    button.addEventListener("click", renderInternsPage);
  });
  document.querySelectorAll("[data-page='calendar']").forEach((button) => {
    button.addEventListener("click", renderCalendarPage);
  });
  document.querySelectorAll("[data-page='reports']").forEach((button) => {
    button.addEventListener("click", renderReportsPage);
  });
  document.querySelectorAll("[data-page='admin']").forEach((button) => {
    button.addEventListener("click", renderAdminFormPage);
  });
}

function bindSharedActions() {
  document.querySelectorAll("[data-action='add-intern']").forEach((button) => {
    button.addEventListener("click", openAddInternModal);
  });

  document.querySelectorAll("[data-action='global-search']").forEach((input) => {
    input.addEventListener("input", (event) => {
      internSearch = event.target.value;
      renderInternsPage();
    });
  });

  const bell = document.querySelector(".interntrack-bell");
  if (bell) bell.addEventListener("click", toggleNotifications);
}

function renderDashboard() {
  const total = internDirectory.length;
  const active = internDirectory.filter((intern) => intern.statusClass === "verified").length;
  const completing = internDirectory.filter((intern) => intern.statusClass === "completing").length;
  const averageAttendance = Math.round(internDirectory.reduce((sum, intern) => sum + intern.attendance, 0) / total);
  const recentRows = internDirectory
    .slice(0, 3)
    .map(
      (intern) => `
        <button class="interntrack-row interntrack-dashboard-row" type="button" data-intern-id="${intern.id}">
          <div class="interntrack-initial ${intern.initialsClass}">${intern.initials}</div>
          <div>
            <strong>${intern.name}</strong>
            <p>${intern.role} &middot; ${intern.college}</p>
          </div>
          <span class="interntrack-status ${intern.statusClass}">${statusLabel(intern)}</span>
        </button>
      `
    )
    .join("");

  renderInternTrackShell(
    "dashboard",
    "Dashboard",
    `
      <main class="interntrack-content">
        <div class="interntrack-page-title">
          <div>
            <h2>Dashboard</h2>
            <p>Good morning, Admin</p>
          </div>
          <button class="interntrack-add" type="button" data-action="add-intern">+ Add intern</button>
        </div>

        <div class="interntrack-stats">
          <span class="interntrack-callout stats-callout">Stats titles x4</span>
          <article class="interntrack-stat blue">
            <strong>${total}</strong>
            <span>TOTAL INTERNS</span>
          </article>
          <article class="interntrack-stat green" data-dashboard-filter="verified">
            <strong>${active}</strong>
            <span>VERIFIED</span>
          </article>
          <article class="interntrack-stat amber" data-dashboard-filter="completing">
            <strong>${completing}</strong>
            <span>COMPLETING SOON</span>
          </article>
          <article class="interntrack-stat attendance" data-page="reports">
            <strong>${averageAttendance}%</strong>
            <span>AVG ATTENDANCE</span>
            <div><i style="width:${averageAttendance}%"></i></div>
          </article>
        </div>

        <div class="interntrack-lower-grid">
          <section class="interntrack-panel">
            <span class="interntrack-callout recent-callout">Recent intern list</span>
            <h3>RECENT INTERNS</h3>
            ${recentRows}
          </section>

          <section class="interntrack-panel">
            <span class="interntrack-callout actions-callout">Quick nav actions</span>
            <h3>QUICK ACTIONS</h3>
            <div class="interntrack-action-grid">
              <button type="button" data-page="calendar"><span></span>Calendar</button>
              <button type="button" data-page="reports"><span></span>Performance</button>
              <button type="button" data-page="interns"><span></span>All Interns</button>
              <button type="button" data-page="admin"><span></span>Admin Form</button>
            </div>
          </section>
        </div>
      </main>
    `
  );

  document.querySelectorAll(".interntrack-dashboard-row").forEach((row) => {
    row.addEventListener("click", () => renderInternProfilePage(row.dataset.internId));
  });
  document.querySelectorAll("[data-dashboard-filter]").forEach((card) => {
    card.addEventListener("click", () => {
      internFilter = card.dataset.dashboardFilter;
      internSearch = "";
      renderInternsPage();
    });
  });
}

function getFilteredInterns() {
  const searchTerm = internSearch.trim().toLowerCase();
  return internDirectory.filter((intern) => {
    const matchesFilter = internFilter === "all" || intern.statusClass === internFilter;
    const haystack = `${intern.name} ${intern.id} ${intern.role} ${intern.college} ${intern.status}`.toLowerCase();
    return matchesFilter && (!searchTerm || haystack.includes(searchTerm));
  });
}

function renderInternsPage() {
  const filteredInterns = getFilteredInterns();
  const filters = [
    ["all", `All (${internDirectory.length})`],
    ["verified", `Verified (${countByStatus("verified")})`],
    ["pending", `Pending (${countByStatus("pending")})`],
    ["completing", `Completing (${countByStatus("completing")})`]
  ];
  const internRows = filteredInterns
    .map(
      (intern) => `
        <button class="interntrack-row interntrack-directory-row" type="button" data-intern-id="${intern.id}">
          <div class="interntrack-initial ${intern.initialsClass}">${intern.initials}</div>
          <div>
            <strong>${intern.name}</strong>
            <p>${intern.id} &middot; ${intern.year} &middot; ${intern.college}</p>
          </div>
          <span class="interntrack-status ${intern.statusClass}">${statusLabel(intern)}</span>
          <span class="interntrack-role">${intern.role}</span>
        </button>
      `
    )
    .join("") || `<div class="interntrack-empty">No interns match your search.</div>`;

  renderInternTrackShell(
    "interns",
    "Interns",
    `
      <main class="interntrack-content">
        <div class="interntrack-page-title">
          <div>
            <h2>Interns</h2>
            <p>${internDirectory.length} interns enrolled</p>
          </div>
          <button class="interntrack-add" type="button" data-action="add-intern">+ Add intern</button>
        </div>

        <section class="interntrack-interns-page">
          <label class="interntrack-list-search">
            <span aria-hidden="true"></span>
            <input id="internListSearch" type="search" placeholder="Search by name or ID..." value="${escapeAttr(internSearch)}" />
          </label>

          <div class="interntrack-filter-row">
            ${filters.map(([key, label]) => `<button class="${internFilter === key ? "active" : ""}" type="button" data-filter="${key}">${label}</button>`).join("")}
          </div>

          <div class="interntrack-directory">
            <span class="interntrack-callout filter-callout">Filter pills</span>
            <span class="interntrack-callout row-callout">Intern rows — click to open profile</span>
            ${internRows}
          </div>
        </section>
      </main>
    `
  );

  document.querySelectorAll(".interntrack-directory-row").forEach((row) => {
    row.addEventListener("click", () => renderInternProfilePage(row.dataset.internId));
  });
  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      internFilter = button.dataset.filter;
      renderInternsPage();
    });
  });
  const searchInput = document.getElementById("internListSearch");
  if (searchInput) {
    searchInput.focus();
    searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length);
    searchInput.addEventListener("input", (event) => {
      internSearch = event.target.value;
      renderInternsPage();
    });
  }
}

function renderInternProfilePage(internId) {
  const intern = internDirectory.find((item) => item.id === internId);
  if (!intern) return;
  const address = document.querySelector(".browser-address");
  if (address) address.textContent = `app.interntrack.in/interns/${intern.id}`;
  const accordions = [
    ["Verification status", `<p><strong>${intern.status}</strong> by Admin team. Current workflow stage is ${intern.statusClass}.</p>`],
    ["Intern identity details", `<div class="interntrack-profile-grid">${infoBlock("Name", intern.name)}${infoBlock("Email", intern.email)}${infoBlock("College", intern.college)}${infoBlock("Department", intern.department)}</div>`],
    ["Internship information", `<div class="interntrack-profile-grid">${infoBlock("Mode", intern.mode)}${infoBlock("Duration", intern.duration)}${infoBlock("Domain", intern.role)}${infoBlock("Start date", intern.startDate)}${infoBlock("End date", intern.completionDate)}${infoBlock("Mentor", intern.mentor)}</div>`],
    ["Work & task summary", `<div class="interntrack-profile-grid">${infoBlock("Work year", intern.workYear || "2025-2026")}${infoBlock("Work start", intern.workStart || intern.startDate)}${infoBlock("Work end", intern.workEnd || intern.completionDate)}${infoBlock("Work domain", intern.workDomain || intern.role)}</div><p class="profile-muted">${intern.workInfo || intern.responsibilities}</p><table class="profile-task-table"><thead><tr><th>Task</th><th>Date</th></tr></thead><tbody>${intern.tasks.map((task) => `<tr><td>${task.title}</td><td>${task.date}</td></tr>`).join("")}</tbody></table>`],
    ["Attendance summary", `<div class="interntrack-profile-grid">${infoBlock("Present", presentDaysFor(intern))}${infoBlock("Absent", intern.absentDays || Math.max(0, workingDaysFor(intern) - presentDaysFor(intern)))}${infoBlock("Leave", intern.leaveDays || "2")}${infoBlock("Working days", workingDaysFor(intern))}${infoBlock("Holidays", intern.holidays || "3")}${infoBlock("Attendance", `${intern.attendance}%`)}</div><div class="profile-meter"><span style="width:${intern.attendance}%"></span></div>`],
    ["Documents", `<div class="profile-doc-grid"><a download="lor.txt" href="${downloadDataUrl(`${intern.name} LOR - ${intern.lorStatus}`)}">Download LOR</a><a download="offer-letter.txt" href="${downloadDataUrl(`${intern.name} offer letter`)}">Download Offer Letter</a><a download="completion-letter.txt" href="${downloadDataUrl(`${intern.name} completion letter`)}">Download Completion Letter</a></div>`],
    ["Certificate details", `<p>${intern.certificateStatus}</p>`],
    ["Verification metadata", `${intern.statusClass === "verified" ? `<div class="interntrack-profile-grid">${infoBlock("Verified by", intern.verifiedBy || "Admin")}${infoBlock("Verified when", intern.verifiedWhen || "2026-06-23")}${infoBlock("Certificate", "Verified")}</div>` : `<p><strong>Pending verification.</strong> Certificate cannot be issued until document and attendance checks are complete.</p>`}`]
  ];

  renderInternTrackShell(
    "interns",
    "Profile",
    `
      <main class="interntrack-content">
        <button class="interntrack-back" type="button" data-page="interns">&lt; Back to interns</button>
        <section class="interntrack-profile-hero">
          <span class="interntrack-callout profile-callout">Profile header card</span>
          <div class="interntrack-profile-head">
            <div class="interntrack-initial ${intern.initialsClass}">${intern.initials}</div>
            <div>
              <h2>${intern.name}</h2>
              <p>${intern.id} &middot; ${intern.department}</p>
              <div class="profile-chip-row">
                <span class="interntrack-status ${intern.statusClass}">${statusLabel(intern)}</span>
                <span>${intern.duration}</span>
                <span>${intern.mode}</span>
              </div>
            </div>
            <div class="profile-actions">
              <a href="#" class="profile-action">Resume</a>
              <button type="button">Edit</button>
            </div>
          </div>
        </section>

        <section class="profile-accordion-grid">
          <span class="interntrack-callout accordion-callout">8 accordion sections (2-col)</span>
          ${accordions.map(([title, body], index) => `
            <details class="profile-accordion" ${index === 3 ? "open" : ""}>
              <summary><span>${index + 1}</span>${title}</summary>
              <div class="profile-accordion-body">${body}</div>
            </details>
          `).join("")}
        </section>
      </main>
    `
  );
  const profileAddress = document.querySelector(".browser-address");
  if (profileAddress) profileAddress.textContent = `app.interntrack.in/interns/${intern.id}`;
}

function renderCalendarPage() {
  const calendarDate = new Date(calendarYear, calendarMonth, 1);
  const monthTitle = calendarDate.toLocaleString("en-US", { month: "long", year: "numeric" });
  const calendarCells = buildDynamicCalendarCells(calendarYear, calendarMonth);

  renderInternTrackShell(
    "calendar",
    "Calendar",
    `
      <main class="interntrack-content">
        <div class="interntrack-page-title">
          <div>
            <h2>Calendar</h2>
            <p>${monthTitle}</p>
          </div>
        </div>

        <section class="interntrack-calendar-layout">
          <span class="interntrack-callout calendar-grid-callout">Monthly calendar grid</span>
          <article class="calendar-month-card large">
            <div class="calendar-card-head">
              <h3>${monthTitle}</h3>
              <div>
                <button type="button" data-calendar-step="-1" aria-label="Previous month">&lsaquo;</button>
                <button type="button" data-calendar-step="1" aria-label="Next month">&rsaquo;</button>
              </div>
            </div>
            <div class="calendar-mini-grid april">
              ${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => `<b>${day}</b>`).join("")}
              ${calendarCells}
            </div>
            <div class="calendar-legend">
              <span><i class="today-dot"></i>Today</span>
              <span><i class="holiday-dot"></i>Holiday</span>
              <span><i class="feedback-dot"></i>Mentor feedback</span>
            </div>
          </article>

          <aside class="calendar-side-stack">
            <span class="interntrack-callout feedback-callout">Feedback timeline + Holidays</span>
            <article class="calendar-log-panel">
              <h3>MENTOR FEEDBACK LOG</h3>
              <div class="feedback-log-item active">
                <strong>17 Apr 2025 &middot; Mr. Karthik Sundaram</strong>
                <p>Arunima has shown great progress on the component library. Needs to improve time estimation.</p>
              </div>
              <div class="feedback-log-item">
                <strong>03 Mar 2025 &middot; Mr. Karthik Sundaram</strong>
                <p>Good understanding of user research. Presentation skills have improved significantly.</p>
              </div>
              <div class="feedback-log-item">
                <strong>10 Jan 2025 &middot; Mr. Karthik Sundaram</strong>
                <p>Strong onboarding. Initial designs need more polish on mobile layouts.</p>
              </div>
            </article>

            <article class="calendar-log-panel">
              <h3>HOLIDAYS &amp; LEAVES</h3>
              <div class="holiday-row"><span>Tamil New Year</span><b>15 Apr</b></div>
              <div class="holiday-row"><span>Diwali 2025</span><b>Oct 2025</b></div>
              <div class="holiday-row"><span>Pongal 2026</span><b>Jan 2026</b></div>
            </article>
          </aside>
        </section>
      </main>
    `
  );

  document.querySelectorAll("[data-calendar-step]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextDate = new Date(calendarYear, calendarMonth + Number(button.dataset.calendarStep), 1);
      calendarYear = nextDate.getFullYear();
      calendarMonth = nextDate.getMonth();
      renderCalendarPage();
    });
  });
}

function renderAdminFormPage() {
  const intern = internDirectory[0];
  const tabs = [
    ["identity", "Identity"],
    ["internship", "Internship"],
    ["work", "Work"],
    ["attendance", "Attendance"],
    ["docs", "Docs"],
    ["verify", "Verify"]
  ];

  renderInternTrackShell(
    "admin",
    "Admin Form",
    `
      <main class="interntrack-content">
        <div class="interntrack-page-title">
          <div>
            <h2>Admin Form</h2>
            <p>Intern record management</p>
          </div>
        </div>

        <section class="admin-form-page">
          <span class="interntrack-callout admin-tabs-callout">6 section tabs</span>
          <nav class="admin-form-tabs">
            ${tabs.map(([key, label]) => `<button class="${adminActiveTab === key ? "active" : ""}" type="button" data-admin-tab="${key}">${label}</button>`).join("")}
          </nav>
          <form id="adminRecordForm" class="admin-form-card">
            <span class="interntrack-callout admin-grid-callout">2-column form grid</span>
            ${renderAdminTabFields(adminActiveTab, intern)}
            <div class="admin-form-actions">
              <button type="submit">Save changes</button>
              <button class="secondary-modal" type="button" data-action="discard-admin">Discard</button>
            </div>
          </form>
          <span class="interntrack-callout admin-actions-callout">Save / Discard actions</span>
        </section>
      </main>
    `
  );

  document.querySelectorAll("[data-admin-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      adminActiveTab = button.dataset.adminTab;
      renderAdminFormPage();
    });
  });

  document.querySelector("[data-action='discard-admin']")?.addEventListener("click", renderAdminFormPage);
  document.getElementById("adminRecordForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    saveAdminForm(adminActiveTab, new FormData(event.currentTarget), intern);
    renderAdminFormPage();
  });
}

function renderAdminTabFields(tab, intern) {
  const absentDays = Math.max(0, workingDaysFor(intern) - presentDaysFor(intern));
  const field = (label, name, value, placeholder = "") => `
    <label>${label}<input name="${name}" value="${escapeAttr(value)}" placeholder="${placeholder}"></label>
  `;
  const select = (label, name, value, options) => `
    <label>${label}<select name="${name}">${options.map((option) => `<option value="${option}" ${option === value ? "selected" : ""}>${option}</option>`).join("")}</select></label>
  `;

  if (tab === "identity") {
    return `
      ${field("INTERN NAME", "name", intern.name, "Full legal name")}
      ${field("INTERN ID", "id", intern.id, "INT001")}
      ${field("DEPARTMENT", "department", intern.department, "e.g. Computer Science")}
      ${field("YEAR", "year", intern.year, "3rd Year")}
      ${field("INTERNSHIP ROLE", "role", intern.role, "e.g. UI/UX Design Intern")}
      ${field("COLLEGE", "college", intern.college, "College name")}
      ${field("REFERRAL PERSON", "referrer", intern.referrer || "Mr. Karthik Sundaram", "Name of referrer")}
      ${select("WHATSAPP GROUP", "whatsapp", intern.whatsapp || "Joined", ["Joined", "Pending", "Not added"])}
      ${field("DATE OF BIRTH", "dob", intern.dob || "", "dd/mm/yyyy")}
      ${field("LOCATION", "location", intern.location || "Chennai, Tamil Nadu", "City, State")}
      ${field("LINKEDIN", "linkedin", intern.linkedin || "", "https://linkedin.com/in/...")}
      ${field("GITHUB", "github", intern.github || "", "https://github.com/...")}
    `;
  }

  if (tab === "internship") {
    return `
      ${select("MODE", "mode", intern.mode, ["Hybrid", "Remote", "On-site"])}
      ${field("DURATION", "duration", intern.duration, "6 months")}
      ${field("DOMAIN", "domain", intern.role, "UI/UX Design")}
      ${field("MENTOR", "mentor", intern.mentor, "Assigned mentor")}
      ${field("START DATE", "startDate", intern.startDate, "yyyy-mm-dd")}
      ${field("END DATE", "completionDate", intern.completionDate, "yyyy-mm-dd")}
      ${field("ORGANIZATION", "organization", intern.organization || "ProEduvate", "Organization")}
      ${select("STATUS", "statusClass", intern.statusClass, ["verified", "pending", "completing", "not-verified"])}
    `;
  }

  if (tab === "work") {
    return `
      ${field("WORK YEAR", "workYear", intern.workYear || "2025-2026", "2025-2026")}
      ${field("WORK START", "workStart", intern.workStart || intern.startDate, "yyyy-mm-dd")}
      ${field("WORK END", "workEnd", intern.workEnd || intern.completionDate, "yyyy-mm-dd")}
      ${field("WORK DOMAIN", "workDomain", intern.workDomain || intern.role, "Design / Development / Data")}
      <label class="admin-form-wide">RESPONSIBILITIES<textarea name="responsibilities">${intern.responsibilities}</textarea></label>
      <label class="admin-form-wide">WORK INFORMATION<textarea name="workInfo">${intern.workInfo || "Completed assigned milestones, weekly mentor reviews, and project documentation."}</textarea></label>
    `;
  }

  if (tab === "attendance") {
    return `
      ${field("PRESENT DAYS", "presentDays", presentDaysFor(intern), "22")}
      ${field("ABSENT DAYS", "absentDays", absentDays, "2")}
      ${field("LEAVE DAYS", "leaveDays", intern.leaveDays || "2", "2")}
      ${field("WORKING DAYS", "workingDays", workingDaysFor(intern), "24")}
      ${field("HOLIDAYS", "holidays", intern.holidays || "3", "3")}
      ${field("ATTENDANCE %", "attendance", intern.attendance, "92")}
    `;
  }

  if (tab === "docs") {
    return `
      <div class="admin-doc-card"><strong>LOR</strong><a download="lor.txt" href="${downloadDataUrl(`${intern.name} LOR - ${intern.lorStatus}`)}">Download</a></div>
      <div class="admin-doc-card"><strong>Offer Letter</strong><a download="offer-letter.txt" href="${downloadDataUrl(`${intern.name} offer letter for ${intern.role}`)}">Download</a></div>
      <div class="admin-doc-card"><strong>Completion Letter</strong><a download="completion-letter.txt" href="${downloadDataUrl(`${intern.name} completion letter - ${intern.certificateStatus}`)}">Download</a></div>
      ${field("LOR STATUS", "lorStatus", intern.lorStatus, "Ready for issue")}
      ${field("CERTIFICATE STATUS", "certificateStatus", intern.certificateStatus, "Issued / Pending")}
    `;
  }

  return `
    ${select("VERIFICATION STATUS", "statusClass", intern.statusClass, ["verified", "pending", "completing", "not-verified"])}
    ${field("VERIFIED BY", "verifiedBy", intern.verifiedBy || (intern.statusClass === "verified" ? "Admin" : ""), "Verifier name")}
    ${field("VERIFIED WHEN", "verifiedWhen", intern.verifiedWhen || (intern.statusClass === "verified" ? "2026-06-23" : "Pending"), "yyyy-mm-dd")}
    <div class="admin-verify-summary admin-form-wide">
      ${intern.statusClass === "verified"
      ? `<strong>Certificate verified</strong><p>Verified by ${intern.verifiedBy || "Admin"} on ${intern.verifiedWhen || "2026-06-23"}.</p>`
      : `<strong>Verification pending</strong><p>This intern is currently marked as ${intern.status}. Complete document review before issuing certificate.</p>`}
    </div>
  `;
}

function renderReportsPage() {
  const visibleInterns = internDirectory.slice(0, 3);
  const avgRating = (visibleInterns.reduce((sum, intern) => sum + performanceRating(intern), 0) / visibleInterns.length).toFixed(1);
  const taskCompletion = Math.round(visibleInterns.reduce((sum, intern) => sum + taskCompletionPercent(intern), 0) / visibleInterns.length);
  const avgAttendance = Math.round(visibleInterns.reduce((sum, intern) => sum + intern.attendance, 0) / visibleInterns.length);
  const verifiedThisMonth = countByStatus("verified") + countByStatus("completing");
  const performanceRows = visibleInterns
    .map((intern) => {
      const rating = performanceRating(intern).toFixed(1);
      const tone = intern.attendance >= 80 ? "green" : "amber";
      return `
        <div class="report-performance-row">
          <div class="report-person-line">
            <div class="interntrack-initial ${intern.initialsClass}">${intern.initials}</div>
            <strong>${intern.name}</strong>
            <span class="report-rating ${tone}">★ ${rating}</span>
          </div>
          <div class="report-bar-label"><span>Attendance</span><b>${intern.attendance}%</b></div>
          <div class="report-progress ${tone}"><i style="width:${intern.attendance}%"></i></div>
        </div>
      `;
    })
    .join("");

  renderInternTrackShell(
    "reports",
    "Reports",
    `
      <main class="interntrack-content">
        <div class="interntrack-page-title">
          <div>
            <h2>Reports</h2>
            <p>Performance overview</p>
          </div>
        </div>

        <section class="reports-kpi-grid">
          <span class="interntrack-callout reports-kpi-callout">4 KPI metric tiles</span>
          <article class="report-kpi">
            <strong>${avgRating}</strong>
            <span>AVG RATING</span>
            <div class="report-progress blue"><i style="width:${Math.round((Number(avgRating) / 5) * 100)}%"></i></div>
          </article>
          <article class="report-kpi">
            <strong class="green">${taskCompletion}%</strong>
            <span>TASK COMPLETION</span>
            <div class="report-progress green"><i style="width:${taskCompletion}%"></i></div>
          </article>
          <article class="report-kpi">
            <strong class="amber">${avgAttendance}%</strong>
            <span>AVG ATTENDANCE</span>
            <div class="report-progress amber"><i style="width:${avgAttendance}%"></i></div>
          </article>
          <article class="report-kpi">
            <strong class="purple">${verifiedThisMonth}</strong>
            <span>VERIFIED THIS MONTH</span>
          </article>
        </section>

        <section class="reports-performance-panel">
          <span class="interntrack-callout reports-bars-callout">Per-intern performance bars</span>
          <h3>INDIVIDUAL PERFORMANCE</h3>
          ${performanceRows}
        </section>
      </main>
    `
  );
}

function openAddInternModal() {
  const existing = document.querySelector(".interntrack-modal-layer");
  if (existing) existing.remove();
  document.body.insertAdjacentHTML("beforeend", `
    <div class="interntrack-modal-layer">
      <form class="interntrack-modal" id="addInternFormInline">
        <div class="modal-head">
          <h3>Add intern</h3>
          <button type="button" data-action="close-modal">x</button>
        </div>
        <label>Name<input name="name" required placeholder="Intern name"></label>
        <label>Intern ID<input name="id" required placeholder="INT005"></label>
        <label>Role<input name="role" required placeholder="Frontend Dev"></label>
        <label>College<input name="college" required placeholder="College name"></label>
        <label>Status
          <select name="statusClass">
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="completing">Completing</option>
            <option value="not-verified">Not verified</option>
          </select>
        </label>
        <label>Mode<input name="mode" value="Hybrid"></label>
        <div class="modal-actions">
          <button type="button" class="secondary-modal" data-action="close-modal">Cancel</button>
          <button type="submit">Save intern</button>
        </div>
      </form>
    </div>
  `);

  document.querySelectorAll("[data-action='close-modal']").forEach((button) => {
    button.addEventListener("click", () => document.querySelector(".interntrack-modal-layer")?.remove());
  });

  document.getElementById("addInternFormInline").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name").toString().trim();
    const statusClass = formData.get("statusClass").toString();
    const id = formData.get("id").toString().trim().toUpperCase();
    const initials = name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "IN";
    internDirectory.push({
      id,
      initials,
      initialsClass: "new",
      name,
      year: "3rd Year",
      college: formData.get("college").toString().trim(),
      department: `${formData.get("role").toString().trim()} Intern`,
      status: statusFromClass(statusClass),
      statusClass,
      role: formData.get("role").toString().trim(),
      duration: "6 months",
      mode: formData.get("mode").toString().trim() || "Hybrid",
      mentor: "Admin",
      attendance: 80,
      startDate: "2026-06-23",
      completionDate: "2026-12-23",
      responsibilities: "New intern onboarding is in progress.",
      tasks: [{ title: "Onboarding checklist", date: "Today" }],
      lorStatus: "Not started",
      certificateStatus: "Not started",
      email: `${id.toLowerCase()}@college.edu`
    });
    document.querySelector(".interntrack-modal-layer")?.remove();
    internFilter = "all";
    internSearch = "";
    renderInternsPage();
  });
}

function toggleNotifications() {
  const existing = document.querySelector(".notification-popover");
  if (existing) {
    existing.remove();
    return;
  }
  document.querySelector(".interntrack-top-actions").insertAdjacentHTML("beforeend", `
    <section class="notification-popover">
      <div class="notification-head">
        <strong>Notifications</strong>
        <span>${internDirectory.length} updates</span>
      </div>
      <div class="notification-item">
        <b>Priya is completing soon</b>
        <p>Final attendance review is due this week.</p>
      </div>
      <div class="notification-item">
        <b>Dinesh verification pending</b>
        <p>Review documents before certificate generation.</p>
      </div>
      <div class="notification-item">
        <b>${internDirectory.length} interns enrolled</b>
        <p>Directory and calendar are up to date.</p>
      </div>
    </section>
  `);
}

function countByStatus(statusClass) {
  return internDirectory.filter((intern) => intern.statusClass === statusClass).length;
}

function saveAdminForm(tab, formData, intern) {
  const get = (key) => formData.get(key)?.toString().trim();
  if (tab === "identity") {
    ["name", "id", "department", "year", "role", "college", "referrer", "whatsapp", "dob", "location", "linkedin", "github"].forEach((key) => {
      const value = get(key);
      if (value !== undefined) intern[key] = value;
    });
    intern.initials = intern.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || intern.initials;
  }
  if (tab === "internship") {
    ["mode", "duration", "mentor", "startDate", "completionDate", "organization", "statusClass"].forEach((key) => {
      const value = get(key);
      if (value !== undefined) intern[key] = value;
    });
    intern.role = get("domain") || intern.role;
    intern.status = statusFromClass(intern.statusClass);
  }
  if (tab === "work") {
    ["workYear", "workStart", "workEnd", "workDomain", "responsibilities", "workInfo"].forEach((key) => {
      const value = get(key);
      if (value !== undefined) intern[key] = value;
    });
  }
  if (tab === "attendance") {
    intern.presentDays = get("presentDays");
    intern.absentDays = get("absentDays");
    intern.leaveDays = get("leaveDays");
    intern.workingDays = get("workingDays");
    intern.holidays = get("holidays");
    intern.attendance = Number(get("attendance")) || intern.attendance;
  }
  if (tab === "docs") {
    intern.lorStatus = get("lorStatus") || intern.lorStatus;
    intern.certificateStatus = get("certificateStatus") || intern.certificateStatus;
  }
  if (tab === "verify") {
    intern.statusClass = get("statusClass") || intern.statusClass;
    intern.status = statusFromClass(intern.statusClass);
    intern.verifiedBy = get("verifiedBy");
    intern.verifiedWhen = get("verifiedWhen");
  }
}

function buildDynamicCalendarCells(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((firstDay + totalDays) / 7) * 7;
  return Array.from({ length: totalCells }, (_, index) => {
    const day = index - firstDay + 1;
    const isValid = day > 0 && day <= totalDays;
    let className = "";
    if (isValid && day === 13) className = "today";
    if (isValid && day === 15) className = "holiday";
    if (isValid && day === 17) className = "feedback";
    return `<button class="${className}" type="button">${isValid ? day : ""}</button>`;
  }).join("");
}

function workingDaysFor(intern) {
  return Number(intern.workingDays) || 24;
}

function presentDaysFor(intern) {
  return Number(intern.presentDays) || Math.round((workingDaysFor(intern) * intern.attendance) / 100);
}

function downloadDataUrl(text) {
  return `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`;
}

function performanceRating(intern) {
  const completionScore = taskCompletionPercent(intern) / 100;
  const attendanceScore = intern.attendance / 100;
  return Math.min(5, Math.max(3.4, (completionScore * 2.4) + (attendanceScore * 2.6)));
}

function taskCompletionPercent(intern) {
  const completedTasks = intern.tasks.length;
  const plannedTasks = Math.max(2, completedTasks + (intern.statusClass === "pending" ? 1 : 0));
  return Math.round((completedTasks / plannedTasks) * 100);
}

function statusLabel(intern) {
  return `${intern.statusClass === "verified" ? "&bull; " : ""}${intern.status}`;
}

function statusFromClass(statusClass) {
  return {
    verified: "Verified",
    pending: "Pending",
    completing: "Completing",
    "not-verified": "Not verified"
  }[statusClass] || "Pending";
}

function escapeAttr(value) {
  return String(value || "").replace(/"/g, "&quot;");
}

function renderAdminDashboard() {
  const students = state.store.students || {};
  const studentList = Object.entries(students);

  // Hide HR sections
  document.getElementById("hrSections").classList.add("hidden");
  document.getElementById("adminSections").classList.remove("hidden");

  // Render metrics
  renderMetrics(studentList);

  // Render intern management
  renderInternManagement(studentList);

  // Render monitoring
  renderMonitoring(studentList);

  // Render verification section
  renderVerificationSection();

  // Render activity feed
  renderActivityFeed(studentList);
}

function renderHRDashboard() {
  const students = state.store.students || {};
  const studentList = Object.entries(students);

  // Hide Admin sections
  document.getElementById("adminSections").classList.add("hidden");
  document.getElementById("hrSections").classList.remove("hidden");

  // Render metrics
  renderMetricsHR(studentList);

  // Render onboarding
  renderOnboarding();

  // Render performance tracking
  renderPerformanceTracking(studentList);

  // Render attendance/leave
  renderAttendanceLeave(studentList);
}

function renderMetrics(studentList) {
  const total = studentList.length;
  const verified = studentList.filter(([_, s]) => s.section1?.verificationStatus === "Verified").length;
  const pending = total - verified;
  const active = studentList.filter(([_, s]) => s.section3?.statusStage === "Active").length;

  const attendanceAvg = Math.round(
    studentList.reduce((sum, [_, s]) => sum + (parseNumber(s.section5?.attendancePercentage, 0)), 0) / Math.max(total, 1)
  );

  const performanceAvg = Math.round(
    studentList.reduce((sum, [_, s]) => sum + extractPercent(s.section1?.performanceMetrics, 0), 0) / Math.max(total, 1)
  );

  const metricsData = [
    { label: "Total Interns", value: total, change: "+0" },
    { label: "Verified", value: verified, change: "+0", positive: true },
    { label: "Pending", value: pending, change: "-0", positive: false },
    { label: "Active", value: active, change: "+0", positive: true },
    { label: "Attendance Avg", value: `${attendanceAvg}%`, change: "+1%" },
    { label: "Performance Avg", value: `${performanceAvg}%`, change: "+2%" }
  ];

  const html = metricsData
    .map(m => `
      <div class="metric-card">
        <div class="metric-label">${m.label}</div>
        <div class="metric-value">${m.value}</div>
        <div class="metric-change ${m.positive === false ? 'negative' : ''}">${m.change}</div>
      </div>
    `)
    .join("");

  document.getElementById("metricsContainer").innerHTML = html;
}

function renderMetricsHR(studentList) {
  const assigned = studentList.length;
  const interviews = Math.round(assigned * 0.6);
  const offers = Math.round(assigned * 0.8);
  const pending = Math.round(assigned * 0.2);

  const metricsData = [
    { label: "Assigned Interns", value: assigned, change: "+1" },
    { label: "Interviews", value: interviews, change: "+2", positive: true },
    { label: "Offers Issued", value: offers, change: "+1", positive: true },
    { label: "Pending", value: pending, change: "-1", positive: false }
  ];

  const html = metricsData
    .map(m => `
      <div class="metric-card">
        <div class="metric-label">${m.label}</div>
        <div class="metric-value">${m.value}</div>
        <div class="metric-change ${m.positive === false ? 'negative' : ''}">${m.change}</div>
      </div>
    `)
    .join("");

  document.getElementById("metricsContainer").innerHTML = html;
}

function renderInternManagement(studentList) {
  const rows = studentList
    .map(([id, student]) => {
      const status = student.section3?.statusStage || "Pending";
      const verified = student.section1?.verificationStatus === "Verified" ? "Verified" : "Pending";
      return `
        <tr>
          <td>${id}</td>
          <td>${student.section2?.internName || "-"}</td>
          <td>${student.section2?.internshipRole || "-"}</td>
          <td><span class="status-badge ${status.toLowerCase()}">${status}</span></td>
          <td><span class="status-badge ${verified.toLowerCase()}">${verified}</span></td>
          <td>
            <button class="btn btn-primary" onclick="onViewStudentDetails('${id}')">View Details</button>
            <button class="btn btn-secondary" onclick="alert('Edit ${id}')">Edit</button>
          </td>
        </tr>
      `;
    })
    .join("");

  document.getElementById("internTableBody").innerHTML = rows;
}

function renderMonitoring(studentList) {
  const avgTaskCompletion = Math.round(
    studentList.reduce((sum, [_, s]) => {
      const assigned = parseNumber(s.section4?.tasksAssigned, 0);
      const completed = parseNumber(s.section4?.tasksCompleted, 0);
      return sum + (assigned ? (completed / assigned) * 100 : 0);
    }, 0) / Math.max(studentList.length, 1)
  );

  const avgAttendance = Math.round(
    studentList.reduce((sum, [_, s]) => sum + parseNumber(s.section5?.attendancePercentage, 0), 0) / Math.max(studentList.length, 1)
  );

  document.getElementById("attendanceOverview").innerHTML = `
    <div style="display: grid; gap: 10px;">
      <div><strong>${avgAttendance}%</strong> average attendance</div>
      <div class="bar"><span style="--value: ${avgAttendance}"></span></div>
    </div>
  `;

  document.getElementById("performanceChart").innerHTML = `
    <div style="display: grid; gap: 10px;">
      <div><strong>${avgTaskCompletion}%</strong> tasks completed</div>
      <div class="bar"><span style="--value: ${avgTaskCompletion}"></span></div>
    </div>
  `;
}

function renderVerificationSection() {
  document.getElementById("verificationAdminSection").innerHTML = `
    <div class="section-header">
      <h3>Verification & Certification</h3>
    </div>
    <div class="verification-grid">
      <div class="verification-item">
        <h4>Letter of Recommendation</h4>
        <p style="color: #4f6b8f; margin: 0 0 10px; font-size: 0.9rem;">Generate and send LOR to interns</p>
        <button class="btn btn-primary">Generate LOR</button>
      </div>
      <div class="verification-item">
        <h4>Certificate Management</h4>
        <p style="color: #4f6b8f; margin: 0 0 10px; font-size: 0.9rem;">Approve and issue completion certificates</p>
        <button class="btn btn-primary">Approve Certificates</button>
      </div>
      <div class="verification-item">
        <h4>Digital Verification</h4>
        <p style="color: #4f6b8f; margin: 0 0 10px; font-size: 0.9rem;">Create digital verification stamps</p>
        <button class="btn btn-primary">Generate Stamp</button>
      </div>
    </div>
  `;
}

function renderActivityFeed(studentList) {
  const activities = [
    { type: "Verification", text: "STU001 profile verified by admin", time: "2 hours ago", icon: "✓" },
    { type: "Task", text: "Dashboard component completed", time: "4 hours ago", icon: "✓" },
    { type: "Attendance", text: "All interns marked present today", time: "6 hours ago", icon: "✓" },
    { type: "Certificate", text: "LOR issued to STU001", time: "1 day ago", icon: "📄" },
    { type: "System", text: "Daily report generated", time: "1 day ago", icon: "⚙️" }
  ];

  const feedHtml = activities
    .map(a => `
      <div class="activity-item">
        <div class="activity-item-header">
          <span>${a.icon} ${a.type}</span>
          <span class="activity-time">${a.time}</span>
        </div>
        <div class="activity-text">${a.text}</div>
      </div>
    `)
    .join("");

  document.getElementById("activityFeedSection").innerHTML = `
    <div class="section-header">
      <h3>Recent Activity Feed</h3>
    </div>
    <div class="activity-feed">
      ${feedHtml}
    </div>
  `;
}

function renderOnboarding() {
  // This is already rendered in HTML, just ensure form handlers are set up
  const form = document.getElementById("addInternForm");
  if (form && !form.dataset.handlerAttached) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("New intern added successfully!");
      form.reset();
    });
    form.dataset.handlerAttached = "true";
  }
}

function renderPerformanceTracking(studentList) {
  const cardsHtml = studentList
    .slice(0, 3)
    .map(([id, student]) => {
      const taskCompletion = Math.round(
        (parseNumber(student.section4?.tasksCompleted, 0) / Math.max(parseNumber(student.section4?.tasksAssigned, 1), 1)) * 100
      );
      const perfScore = extractPercent(student.section1?.performanceMetrics, 85);

      return `
        <div class="performance-card reveal">
          <h5>${student.section2?.internName || id}</h5>
          <div class="performance-stat">
            <span>Task Completion</span>
            <strong>${taskCompletion}%</strong>
          </div>
          <div class="performance-stat">
            <span>Performance</span>
            <strong>${perfScore}%</strong>
          </div>
          <div class="performance-stat">
            <span>Status</span>
            <strong>${student.section3?.statusStage || "Active"}</strong>
          </div>
        </div>
      `;
    })
    .join("");

  document.getElementById("performanceCardsContainer").innerHTML = cardsHtml;

  const feedbackForm = document.getElementById("feedbackForm");
  if (feedbackForm && !feedbackForm.dataset.handlerAttached) {
    const studentSelect = feedbackForm.querySelector("#feedbackStudent");
    const options = studentList
      .map(([id, s]) => `<option value="${id}">${id} - ${s.section2?.internName || ""}</option>`)
      .join("");
    studentSelect.innerHTML = `<option>Select Intern</option>${options}`;

    feedbackForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Feedback submitted successfully!");
      feedbackForm.reset();
    });
    feedbackForm.dataset.handlerAttached = "true";
  }
}

function renderAttendanceLeave(studentList) {
  const summary = studentList
    .slice(0, 3)
    .map(([id, student]) => {
      const attendance = parseNumber(student.section5?.attendancePercentage, 85);
      return `
        <div style="padding: 10px 0; border-bottom: 1px solid #d6e5ff;">
          <strong>${student.section2?.internName || id}</strong>: ${attendance}%
        </div>
      `;
    })
    .join("");

  document.getElementById("attendanceSummary").innerHTML = summary;
  document.getElementById("leaveRequestsList").innerHTML = `
    <div style="padding: 10px; background: rgba(242, 161, 46, 0.1); border-radius: 8px; color: #b76d00; font-size: 0.9rem;">
      3 pending leave requests from interns
    </div>
  `;
}



function buildViewModel(student) {
  const s1 = student.section1 || {};
  const s2 = student.section2 || {};
  const s3 = student.section3 || {};
  const s4 = student.section4 || {};
  const s5 = student.section5 || {};
  const s6 = student.section6 || {};
  const s7 = student.section7 || {};
  const s8 = student.section8 || {};

  const attendancePercent = parseNumber(s5.attendancePercentage, 88);
  const performanceScore = extractPercent(s1.performanceMetrics, 84);
  const taskAssigned = parseNumber(s4.tasksAssigned, 24);
  const taskCompleted = parseNumber(s4.tasksCompleted, 19);
  const taskPending = parseNumber(s4.tasksPending, Math.max(taskAssigned - taskCompleted, 0));
  const taskCompletion = taskAssigned ? Math.round((taskCompleted / taskAssigned) * 100) : 0;

  return {
    verificationStatus: s1.verificationStatus || "Not Verified",
    verifiedBy: s1.verifiedBy || "-",
    verificationDateTime: s1.verificationDateTime || "-",
    leaveCalendar: s1.leaveCalendar || "",
    mentorFeedback: s1.mentorFeedback || "",
    performanceMetrics: s1.performanceMetrics || "",
    internName: s2.internName || "Intern",
    internId: s2.internId || "-",
    department: s2.departmentYear || "-",
    internshipRole: s2.internshipRole || "-",
    college: s2.college || "-",
    email: s2.email || "intern@proeduvate.com",
    phone: s2.phone || "+91 90000 00000",
    domain: s3.domain || s2.internshipRole || "-",
    mentorName: s3.mentorName || "Mentor Assigned",
    startDate: s3.joiningDate || "-",
    endDate: s3.completionDate || "-",
    internshipType: s3.internshipType || "-",
    duration: s3.duration || "-",
    statusStage: s3.statusStage || "Active",
    tasksAssigned: taskAssigned,
    tasksCompleted: taskCompleted,
    tasksPending: taskPending,
    taskCompletion,
    recentActivity: s4.recentActivity || s4.tasks || "",
    attendancePercent,
    attendanceStatus: s5.attendanceStatus || "-",
    lorStatus: s6.lorStatus || "Not Received",
    lorIssuedBy: s6.issuedBy || "-",
    lorIssueDate: s6.issueDate || "-",
    lorDownload: s6.downloadButtonLink || "#",
    certificateStatus: s7.status || "Not Generated",
    certificateDate: s7.issueDate || "-",
    certificateDownload: s7.downloadCertificate || "#",
    referenceId: s8.referenceId || "-",
    dataSource: s8.dataSource || "-",
    disclaimer: s8.disclaimer || "Verification data is confidential.",
    attendancePercentString: `${attendancePercent}%`,
    performanceScore
  };
}

function renderSummaryCards(model) {
  const badgeClass = model.verificationStatus.toLowerCase().includes("verified") ? "verified" : "not-verified";
  els.summaryCards.innerHTML = `
    <article class="summary-card reveal">
      <h4>Verification</h4>
      <div class="summary-value">
        <span class="badge ${badgeClass}">${model.verificationStatus}</span>
      </div>
    </article>
    <article class="summary-card reveal">
      <h4>Internship Duration</h4>
      <div class="summary-value">${model.duration}</div>
      <div class="small-note">${formatDate(model.startDate)} → ${formatDate(model.endDate)}</div>
    </article>
    <article class="summary-card reveal">
      <h4>Attendance</h4>
      <div class="summary-value" style="display:flex; align-items:center; gap:12px;">
        <div class="ring" style="--percent:${model.attendancePercent};">${model.attendancePercent}%</div>
        <div>
          <div>${model.attendanceStatus}</div>
          <div class="small-note">Overall Attendance</div>
        </div>
      </div>
    </article>
    <article class="summary-card reveal">
      <h4>Performance Score</h4>
      <div class="summary-value">${model.performanceScore}%</div>
      <div class="bar" style="--value:${model.performanceScore};"><span></span></div>
    </article>
  `;
}

function renderIdentity(model) {
  const initials = model.internName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  els.identitySection.innerHTML = `
    <h3>Intern Identity</h3>
    <div class="identity-layout">
      <div class="profile-avatar">${initials || "IN"}</div>
      <div class="section-grid">
        ${infoBlock("Name", model.internName)}
        ${infoBlock("Intern ID", model.internId)}
        ${infoBlock("Department", model.department)}
        ${infoBlock("College", model.college)}
        ${infoBlock("Email", model.email)}
        ${infoBlock("Phone", model.phone)}
      </div>
    </div>
  `;
}

function renderInternship(model) {
  const timeline = [
    { label: "Onboarding", active: model.statusStage === "Onboarding" },
    { label: "Active Internship", active: model.statusStage === "Active" },
    { label: "Completion", active: model.statusStage === "Completed" }
  ];

  els.internshipSection.innerHTML = `
    <h3>Internship Information</h3>
    <div class="section-grid">
      ${infoBlock("Domain", model.domain)}
      ${infoBlock("Mentor Name", model.mentorName)}
      ${infoBlock("Start Date", formatDate(model.startDate))}
      ${infoBlock("End Date", formatDate(model.endDate))}
      ${infoBlock("Internship Type", model.internshipType)}
      ${infoBlock("Role", model.internshipRole)}
    </div>
    <div class="section-grid" style="margin-top:12px;">
      <div class="info-block">
        <span>Status Timeline</span>
        <div class="timeline">
          ${timeline
      .map(
        (item) => `
            <div class="timeline-item ${item.active ? "active" : ""}">
              <div class="timeline-dot"></div>
              <div><span>${item.label}</span><div class="small-note">${item.active ? "Current stage" : "Upcoming"}</div></div>
            </div>`
      )
      .join("")}
        </div>
      </div>
    </div>
  `;
}

function renderWork(model) {
  const activity = splitLines(model.recentActivity);
  els.workSection.innerHTML = `
    <h3>Work & Task Summary</h3>
    <div class="section-grid">
      <div class="info-block">
        <span>Task Completion</span>
        <div class="summary-value">${model.taskCompletion}%</div>
        <div class="bar" style="--value:${model.taskCompletion};"><span></span></div>
      </div>
      <div class="task-grid">
        ${taskMetric("Total Tasks", model.tasksAssigned)}
        ${taskMetric("Completed", model.tasksCompleted)}
        ${taskMetric("Pending", model.tasksPending)}
      </div>
    </div>
    <div class="section-grid" style="margin-top:12px;">
      <div class="info-block">
        <span>Recent Task Activity</span>
        <div class="timeline-activity">
          ${activity
      .map(
        (line) => `
            <div class="activity-item">
              <div>${line}</div>
            </div>`
      )
      .join("")}
        </div>
      </div>
    </div>
  `;
}

function renderAttendance(model) {
  const leaveDates = parseLeaveCalendar(model.leaveCalendar);
  const calendar = buildCalendar(leaveDates);
  const feedbackItems = splitLines(model.mentorFeedback);

  els.attendanceSection.innerHTML = `
    <h3>Attendance & Leave</h3>
    <div class="section-grid">
      ${infoBlock("Attendance", model.attendancePercentString)}
      ${infoBlock("Status", model.attendanceStatus)}
      ${infoBlock("Leave Days", leaveDates.length.toString())}
    </div>
    <div class="section-grid" style="margin-top:12px;">
      <div class="info-block">
        <span>Leave Calendar</span>
        <div class="calendar">
          <div class="calendar-header">${calendar.title}</div>
          <div class="calendar-grid">
            ${calendar.labels.map((label) => `<div class="calendar-cell muted">${label}</div>`).join("")}
            ${calendar.cells
      .map((cell) => `<div class="calendar-cell ${cell.className}">${cell.label.replace(/\n/g, "<br>")}</div>`)
      .join("")}
          </div>
        </div>
      </div>
      <div class="info-block">
        <span>Mentor Feedback</span>
        <div class="feedback-grid">
          ${feedbackItems
      .map(
        (line) => `
            <div class="feedback-card">
              <div>${line}</div>
            </div>`
      )
      .join("")}
        </div>
      </div>
    </div>
  `;
}

function renderLor(model) {
  const lorBadge = model.lorStatus.toLowerCase().includes("received") ? "verified" : "not-verified";
  const certBadge = model.certificateStatus.toLowerCase().includes("issued") || model.certificateStatus.toLowerCase().includes("generated")
    ? "verified"
    : "not-verified";

  els.lorSection.innerHTML = `
    <h3>LOR & Certificate</h3>
    <div class="section-grid">
      <div class="info-block">
        <span>LOR Status</span>
        <div class="summary-value"><span class="badge ${lorBadge}">${model.lorStatus}</span></div>
        <div class="small-note">${model.lorIssuedBy} • ${formatDate(model.lorIssueDate)}</div>
      </div>
      <div class="info-block">
        <span>Certificate</span>
        <div class="summary-value"><span class="badge ${certBadge}">${model.certificateStatus}</span></div>
        <div class="small-note">${formatDate(model.certificateDate)}</div>
      </div>
      <div class="info-block">
        <span>Download</span>
        <div class="small-note">LOR & Certificate</div>
        <div style="margin-top:8px; display:flex; gap:8px; flex-wrap:wrap;">
          <a class="cta" href="${model.lorDownload}" target="_blank" rel="noreferrer">Download LOR</a>
          <a class="cta" href="${model.certificateDownload}" target="_blank" rel="noreferrer">Download Certificate</a>
        </div>
      </div>
    </div>
  `;
}

function renderVerification(model) {
  els.verificationSection.innerHTML = `
    <h3>Verification Footer</h3>
    <div class="footer-meta">
      ${infoBlock("Verified By", model.verifiedBy)}
      ${infoBlock("Verification Date", formatDateTime(model.verificationDateTime))}
      ${infoBlock("Digital Badge", model.verificationStatus)}
      ${infoBlock("Timestamp", new Date().toLocaleString())}
      ${infoBlock("Reference ID", model.referenceId)}
      ${infoBlock("Data Source", model.dataSource)}
    </div>
    <p class="small-note" style="margin-top:10px;">${model.disclaimer}</p>
  `;
}

function infoBlock(label, value) {
  return `
    <div class="info-block">
      <span>${label}</span>
      <div>${value || "-"}</div>
    </div>
  `;
}

function taskMetric(label, value) {
  return `
    <div class="task-metric">
      <div class="summary-value">${value}</div>
      <div class="small-note">${label}</div>
    </div>
  `;
}

function extractPercent(text, fallback) {
  const match = (text || "").match(/(\d{1,3})\s*%/);
  if (!match) return fallback;
  const num = Number(match[1]);
  return Number.isNaN(num) ? fallback : Math.min(Math.max(num, 0), 100);
}

function parseNumber(value, fallback) {
  const num = Number(value);
  return Number.isNaN(num) ? fallback : num;
}

function splitLines(text) {
  if (!text) return ["No activity yet."];
  return text.split("\n").map((line) => line.trim()).filter(Boolean);
}

function parseLeaveCalendar(text) {
  const entries = splitLines(text);
  return entries
    .map((line) => {
      const match = line.match(/(.+?)\s*-\s*(\d{4}-\d{2}-\d{2})/);
      if (!match) return null;
      return { label: match[1].trim(), date: match[2] };
    })
    .filter(Boolean);
}

function buildCalendar(leaves) {
  const fallbackDate = "2026-01-01";
  const baseDate = leaves[0]?.date || fallbackDate;
  const dateObj = new Date(`${baseDate}T00:00:00`);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  const monthLabel = dateObj.toLocaleString("default", { month: "long", year: "numeric" });
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();
  const totalDays = lastDay.getDate();
  const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const leaveSet = new Map();
  leaves.forEach((leave) => leaveSet.set(leave.date, leave.label));

  const cells = [];
  for (let i = 0; i < startDay; i += 1) {
    cells.push({ label: "", className: "muted" });
  }
  for (let day = 1; day <= totalDays; day += 1) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const leaveLabel = leaveSet.get(dateStr);
    cells.push({
      label: leaveLabel ? `${day}\n${leaveLabel}` : day.toString(),
      className: leaveLabel ? "leave" : ""
    });
  }
  return { title: monthLabel, labels, cells };
}

function formatDate(value) {
  if (!value || value === "-") return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

function formatDateTime(value) {
  if (!value || value === "-") return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function setupLogoFallback() {
  const logo = els.companyLogo;
  const fallback = els.logoFallback;
  if (!logo) return;

  const candidates = [
    "assets/company-logo.png",
    "assets/company-logo.jpg",
    "assets/company-logo.jpeg",
    "assets/company-logo.webp",
    "assets/logo.png",
    "assets/logo.jpg",
    "assets/logo.jpeg",
    "assets/logo.webp"
  ];

  let idx = 0;
  logo.src = candidates[idx];

  logo.addEventListener("error", () => {
    idx += 1;
    if (idx < candidates.length) {
      logo.src = candidates[idx];
      return;
    }
    logo.classList.add("hidden");
    if (fallback) fallback.classList.remove("hidden");
  });

  logo.addEventListener("load", () => {
    logo.classList.remove("hidden");
    if (fallback) fallback.classList.add("hidden");
  });
}

function setupRevealAnimations() {
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((el) => {
    if (!el.dataset.revealBound) {
      el.dataset.revealBound = "true";
      revealObserver.observe(el);
    }
  });
}

function refreshReveals() {
  document.querySelectorAll(".reveal").forEach((el) => {
    if (revealObserver && !el.dataset.revealBound) {
      el.dataset.revealBound = "true";
      revealObserver.observe(el);
    }
  });
}

// Student Detail View Functions
function onViewStudentDetails(studentId) {
  const student = state.store.students[studentId];
  if (!student) return;

  const detailSection = document.getElementById("studentDetailSection");
  const detailContent = document.getElementById("studentDetailContent");

  state.selectedStudentId = studentId;

  const s2 = student.section2 || {};
  const s3 = student.section3 || {};
  const s4 = student.section4 || {};
  const s5 = student.section5 || {};
  const s6 = student.section6 || {};
  const s7 = student.section7 || {};

  const html = `
    <div class="student-detail-grid">
      <!-- Personal Information -->
      <div class="detail-card">
        <h4>Personal Information</h4>
        <div class="detail-row">
          <span class="label">Name</span>
          <span class="value">${s2.internName || "-"}</span>
        </div>
        <div class="detail-row">
          <span class="label">Email</span>
          <span class="value">${s2.email || "-"}</span>
        </div>
        <div class="detail-row">
          <span class="label">Phone</span>
          <span class="value">${s2.phone || "-"}</span>
        </div>
        <div class="detail-row">
          <span class="label">College</span>
          <span class="value">${s2.college || "-"}</span>
        </div>
        <div class="detail-row">
          <span class="label">Department/Year</span>
          <span class="value">${s2.departmentYear || "-"}</span>
        </div>
        <div class="detail-row">
          <span class="label">Date of Birth</span>
          <span class="value">${extractProfileField(s2.profileDetails, "DOB") || "-"}</span>
        </div>
      </div>

      <!-- Internship Details -->
      <div class="detail-card">
        <h4>Internship Details</h4>
        <div class="detail-row">
          <span class="label">Joining Date</span>
          <span class="value">${s3.joiningDate || "-"}</span>
        </div>
        <div class="detail-row">
          <span class="label">Completion Date</span>
          <span class="value">${s3.completionDate || "-"}</span>
        </div>
        <div class="detail-row">
          <span class="label">Mode</span>
          <span class="value">${s3.internshipMode || "-"}</span>
        </div>
        <div class="detail-row">
          <span class="label">Duration</span>
          <span class="value">${s3.duration || "-"}</span>
        </div>
        <div class="detail-row">
          <span class="label">Role</span>
          <span class="value">${s2.internshipRole || "-"}</span>
        </div>
        <div class="detail-row">
          <span class="label">Domain</span>
          <span class="value">${s3.domain || "-"}</span>
        </div>
        <div class="detail-row">
          <span class="label">Status</span>
          <span class="value badge-status">${s3.statusStage || "-"}</span>
        </div>
      </div>

      <!-- Contact Links -->
      <div class="detail-card">
        <h4>Contact & Links</h4>
        <div class="detail-row">
          <span class="label">Referral Person</span>
          <span class="value">${s2.referralPerson || "-"}</span>
        </div>
        <div class="detail-row">
          <span class="label">WhatsApp Group</span>
          <span class="value">
            ${s2.whatsappGroup ? `<a href="${s2.whatsappGroup}" target="_blank" class="link">Join Group</a>` : "-"}
          </span>
        </div>
        <div class="detail-row">
          <span class="label">Resume</span>
          <span class="value">
            ${s2.resume ? `<a href="${s2.resume}" target="_blank" class="link">Download</a>` : "-"}
          </span>
        </div>
        <div class="detail-row">
          <span class="label">LinkedIn</span>
          <span class="value">
            ${extractProfileLink(s2.profileDetails, "LinkedIn") ? `<a href="${extractProfileLink(s2.profileDetails, "LinkedIn")}" target="_blank" class="link">Profile</a>` : "-"}
          </span>
        </div>
        <div class="detail-row">
          <span class="label">GitHub</span>
          <span class="value">
            ${extractProfileLink(s2.profileDetails, "GitHub") ? `<a href="${extractProfileLink(s2.profileDetails, "GitHub")}" target="_blank" class="link">Profile</a>` : "-"}
          </span>
        </div>
      </div>

      <!-- Profile Details -->
      <div class="detail-card">
        <h4>Personal Profile</h4>
        <div class="detail-row">
          <span class="label">Hobby</span>
          <span class="value">${extractProfileField(s2.profileDetails, "Hobby") || "-"}</span>
        </div>
        <div class="detail-row">
          <span class="label">Location</span>
          <span class="value">${extractProfileField(s2.profileDetails, "Location") || "-"}</span>
        </div>
        <div class="detail-row">
          <span class="label">Certifications</span>
          <span class="value">${extractProfileField(s2.profileDetails, "Certifications") || "-"}</span>
        </div>
        <div class="detail-row">
          <span class="label">Skill Set</span>
          <span class="value">${extractProfileField(s2.profileDetails, "Skill set") || "-"}</span>
        </div>
      </div>

      <!-- Past Internship -->
      <div class="detail-card">
        <h4>Past Internship</h4>
        <div class="detail-row">
          <span class="label">Details</span>
          <span class="value">${extractProfileField(s2.profileDetails, "Past Internship") || "-"}</span>
        </div>
      </div>

      <!-- Work & Projects -->
      <div class="detail-card">
        <h4>Projects & Work</h4>
        <div class="detail-row">
          <span class="label">Tools & Technologies</span>
          <span class="value">${s4.toolsTechnologies || "-"}</span>
        </div>
        <div class="detail-row">
          <span class="label">Projects</span>
          <span class="value" style="white-space: pre-wrap;">${s4.projects ? formatMultiline(s4.projects) : "-"}</span>
        </div>
      </div>

      <!-- Certificate -->
      <div class="detail-card">
        <h4>Certificate</h4>
        <div class="detail-row">
          <span class="label">Certificate ID</span>
          <span class="value">${s7.certificateId || "-"}</span>
        </div>
        <div class="detail-row">
          <span class="label">Issue Date</span>
          <span class="value">${s7.issueDate || "-"}</span>
        </div>
        <div class="detail-row">
          <span class="label">Status</span>
          <span class="value badge-status">${s7.status || "-"}</span>
        </div>
        <div class="detail-row">
          <span class="label">Download</span>
          <span class="value">
            ${s7.downloadCertificate ? `<a href="${s7.downloadCertificate}" target="_blank" class="link">Download Certificate</a>` : "-"}
          </span>
        </div>
      </div>

      <!-- Documents -->
      <div class="detail-card">
        <h4>Documents</h4>
        ${renderDocuments(s7.documents)}
      </div>

      <!-- LOR -->
      <div class="detail-card">
        <h4>Letter of Recommendation</h4>
        <div class="detail-row">
          <span class="label">Status</span>
          <span class="value badge-status">${s6.lorStatus || "-"}</span>
        </div>
        <div class="detail-row">
          <span class="label">Issued By</span>
          <span class="value">${s6.issuedBy || "-"}</span>
        </div>
        <div class="detail-row">
          <span class="label">Issue Date</span>
          <span class="value">${s6.issueDate || "-"}</span>
        </div>
        <div class="detail-row">
          <span class="label">Download</span>
          <span class="value">
            ${s6.downloadButtonLink ? `<a href="${s6.downloadButtonLink}" target="_blank" class="link">Download LOR</a>` : "-"}
          </span>
        </div>
      </div>
    </div>
  `;

  detailContent.innerHTML = html;
  detailSection.classList.remove("hidden");
  detailSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeStudentDetail() {
  document.getElementById("studentDetailSection").classList.add("hidden");
}

function extractProfileField(profileDetails, fieldName) {
  if (!profileDetails) return null;
  const lines = profileDetails.split("\n").map(l => l.trim());
  for (const line of lines) {
    if (line.startsWith(fieldName + ":")) {
      return line.substring(fieldName.length + 1).trim();
    }
  }
  return null;
}

function extractProfileLink(profileDetails, linkName) {
  if (!profileDetails) return null;
  const lines = profileDetails.split("\n").map(l => l.trim());
  for (const line of lines) {
    if (line.startsWith(linkName + ":")) {
      const url = line.substring(linkName.length + 1).trim();
      return url.startsWith("http") ? url : null;
    }
  }
  return null;
}

function formatMultiline(text) {
  if (!text) return "-";
  return text.split("\n").map(l => l.trim()).filter(Boolean).join("\n");
}

function renderDocuments(documentsStr) {
  if (!documentsStr) {
    return '<div class="detail-row"><span class="value">No documents available</span></div>';
  }

  const docs = documentsStr.split("\n").map(d => d.trim()).filter(Boolean);
  return docs.map(doc => {
    const [name, url] = doc.split(":").map(s => s.trim());
    return `
      <div class="detail-row">
        <span class="label">${name || "Document"}</span>
        <span class="value">
          ${url ? `<a href="${url}" target="_blank" class="link">Download</a>` : "-"}
        </span>
      </div>
    `;
  }).join("");
}
