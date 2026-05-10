const defaultStore = {
  students: {
    STU001: {
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
        department: "CSE",
        passingOutYear: "2027",
        internshipExperience: "Web Intern at XYZ (2 months)",
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
        candidateInternshipType: "Online",
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
      },
      projects: [
        {
          id: "PRJ-001",
          title: "Internship Tracker",
          description: "Build a lightweight tracker for intern tasks and progress.",
          status: "Active",
          startDate: "2026-01-01",
          endDate: "2026-05-31"
        }
      ],
      tasks: [
        {
          id: "TASK-001",
          title: "Landing page redesign",
          description: "Revamp the hero section and optimize CTA flow.",
          assignedAt: "2026-01-02",
          dueDate: "2026-01-10",
          priority: "High",
          status: "Submitted",
          submissions: [
            {
              id: "SUB-001",
              submittedAt: "2026-01-09",
              submissionUrl: "https://example.com/submissions/task-001",
              notes: "Updated hero layout and CTA buttons.",
              status: "Reviewed"
            }
          ]
        }
      ],
      attendance: [
        { id: "ATT-001", date: "2026-02-01", status: "Present", remarks: "On time" },
        { id: "ATT-002", date: "2026-02-02", status: "Present", remarks: "Worked on UI polish" },
        { id: "ATT-003", date: "2026-02-03", status: "Leave", remarks: "Medical leave" }
      ],
      performanceReviews: [
        {
          id: "PRF-001",
          reviewDate: "2026-02-05",
          rating: 4,
          summary: "Strong ownership of dashboard UI.",
          strengths: "Proactive communication, quality UI polish.",
          improvements: "Improve task estimation accuracy."
        }
      ],
      notifications: [
        {
          id: "NTF-001",
          title: "Project kickoff",
          message: "Internship Tracker project kickoff scheduled for Feb 6.",
          type: "Info",
          isRead: false,
          createdAt: "2026-02-04T10:00"
        }
      ]
    }
  }
};

const state = {
  userRole: null,
  selectedStudentId: null,
  store: loadLocalStore() || cloneStore(defaultStore),
  token: localStorage.getItem("internPortalToken") || "",
  session: loadSession(),
  api: {
    baseUrl: resolveApiBaseUrl()
  }
};

const els = {
  loginView: document.getElementById("loginView"),
  dashboardView: document.getElementById("dashboardView"),
  loginForm: document.getElementById("loginForm"),
  username: document.getElementById("username"),
  password: document.getElementById("password"),
  loginError: document.getElementById("loginError"),
  welcomeTitle: document.getElementById("welcomeTitle"),
  roleInfo: document.getElementById("roleInfo"),
  logoutBtn: document.getElementById("logoutBtn"),
  roleBadge: document.getElementById("roleBadge"),
  studentPicker: document.getElementById("studentPicker"),
  studentPickerWrap: document.getElementById("studentPickerWrap"),
  metricsContainer: document.getElementById("metricsContainer"),
  internDetailEmpty: document.getElementById("internDetailEmpty"),
  studentSections: document.getElementById("studentSections"),
  summaryCards: document.getElementById("summaryCards"),
  identitySection: document.getElementById("identitySection"),
  internshipSection: document.getElementById("internshipSection"),
  workSection: document.getElementById("workSection"),
  attendanceSection: document.getElementById("attendanceSection"),
  lorSection: document.getElementById("lorSection"),
  verificationSection: document.getElementById("verificationSection"),
  projectsSection: document.getElementById("projectsSection"),
  tasksSection: document.getElementById("tasksSection"),
  performanceSection: document.getElementById("performanceSection"),
  notificationsSection: document.getElementById("notificationsSection"),
  companyLogo: document.getElementById("companyLogo"),
  logoFallback: document.getElementById("logoFallback")
};

let revealObserver = null;

function showRuntimeNotice(message) {
  if (!message) return;
  let el = document.getElementById("runtimeNotice");
  if (!el) {
    el = document.createElement("div");
    el.id = "runtimeNotice";
    el.style.position = "fixed";
    el.style.right = "14px";
    el.style.bottom = "14px";
    el.style.zIndex = "9999";
    el.style.padding = "10px 12px";
    el.style.borderRadius = "10px";
    el.style.background = "rgba(255, 240, 240, 0.96)";
    el.style.border = "1px solid rgba(191, 43, 43, 0.35)";
    el.style.color = "#8a1d1d";
    el.style.fontSize = "12px";
    document.body.appendChild(el);
  }
  el.textContent = message;
  clearTimeout(showRuntimeNotice._timer);
  showRuntimeNotice._timer = setTimeout(() => {
    if (el) el.textContent = "";
  }, 4500);
}

const STORE_KEY = "internPortalStoreV1";

function cloneStore(value) {
  if (!value) return value;
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function loadLocalStore() {
  const raw = localStorage.getItem(STORE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveLocalStore(store) {
  if (!store) return;
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

function persistStore() {
  saveLocalStore(state.store);
}

function safeGetById(id) {
  return document.getElementById(id);
}

function withRenderGuard(run, fallbackMessage) {
  try {
    run();
  } catch (err) {
    console.error(err);
    showRuntimeNotice(fallbackMessage || "A dashboard error occurred.");
  }
}

window.addEventListener("error", (event) => {
  console.error(event.error || event.message);
  showRuntimeNotice("Unexpected UI error. Please refresh.");
});

window.addEventListener("unhandledrejection", (event) => {
  console.error(event.reason);
  showRuntimeNotice("Request failed. Check backend/server.");
});

setupLogoFallback();
setupRevealAnimations();

els.loginForm.addEventListener("submit", (e) => {
  handleLogin(e).catch((err) => showError(err.message || "Unable to login. Check backend connection."));
});
els.logoutBtn.addEventListener("click", logout);
els.studentPicker.addEventListener("change", async (e) => {
  state.selectedStudentId = e.target.value;
  await refreshStudentInStore(state.selectedStudentId);
  renderDashboard();
});
initApp();

function resolveApiBaseUrl() {
  const configured = window.__APP_CONFIG__?.apiBaseUrl || localStorage.getItem("internPortalApiBaseUrl");
  return (configured || "http://localhost:5000/api").replace(/\/+$/, "");
}

function loadSession() {
  const raw = localStorage.getItem("internPortalSessionV1");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveSession() {
  localStorage.setItem(
    "internPortalSessionV1",
    JSON.stringify({
      role: "admin",
      studentId: state.selectedStudentId
    })
  );
}

function clearSession() {
  localStorage.removeItem("internPortalSessionV1");
  localStorage.removeItem("internPortalToken");
}

function tryLocalLogin(username, password) {
  state.store = loadLocalStore() || cloneStore(defaultStore);
  if (username === "admin" && password === "admin123") {
    enterDashboard("admin");
    return true;
  }
  return false;
}

async function initApp() {
  if (!state.token || !state.session?.role) return;
  state.userRole = "admin";
  state.selectedStudentId = state.session.studentId || null;
  try {
    await hydrateStoreFromBackend();
    enterDashboard("admin", state.selectedStudentId);
  } catch {
    clearSession();
  }
}

async function apiRequest(path, options = {}) {
  const { method = "GET", body, auth = true, timeoutMs = 15000 } = options;
  const headers = {};
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (auth && state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let response;
  try {
    response = await fetch(`${state.api.baseUrl}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal
    });
  } catch (err) {
    if (err?.name === "AbortError") {
      throw new Error("Request timed out. Please check backend response time.");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }

  const rawText = await response.text();
  let payload = null;
  if (rawText) {
    try {
      payload = JSON.parse(rawText);
    } catch {
      payload = { message: rawText };
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      clearSession();
    }
    throw new Error(payload?.message || `Request failed with status ${response.status}`);
  }
  return payload;
}

async function createIntern(payload) {
  try {
    return await apiRequest("/interns", {
      method: "POST",
      body: payload
    });
  } catch {
    return apiRequest("/students", {
      method: "POST",
      body: payload
    });
  }
}

async function updateIntern(studentId, payload) {
  try {
    return await apiRequest(`/interns/${encodeURIComponent(studentId)}`, {
      method: "PATCH",
      body: payload
    });
  } catch {
    return apiRequest(`/students/${encodeURIComponent(studentId)}`, {
      method: "PATCH",
      body: payload
    });
  }
}

async function deleteIntern(studentId) {
  try {
    return await apiRequest(`/interns/${encodeURIComponent(studentId)}`, {
      method: "DELETE"
    });
  } catch {
    return apiRequest(`/students/${encodeURIComponent(studentId)}`, {
      method: "DELETE"
    });
  }
}

async function tryApi(action, message) {
  try {
    return await action();
  } catch (err) {
    if (message) showRuntimeNotice(message);
    return null;
  }
}

function unwrapStudentList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.students)) return payload.students;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

function unwrapStudent(payload) {
  return payload?.student || payload?.data || payload || {};
}

function serializeLines(input) {
  if (typeof input === "string") return input;
  if (Array.isArray(input)) {
    return input
      .map((item) => {
        if (typeof item === "string") return item;
        if (item?.date && item?.feedback) return `${item.date}: ${item.feedback}`;
        if (item?.date && item?.name) return `${item.name} - ${item.date}`;
        if (item?.date && item?.label) return `${item.label} - ${item.date}`;
        return "";
      })
      .filter(Boolean)
      .join("\n");
  }
  if (input && typeof input === "object") {
    return Object.entries(input)
      .map(([key, value]) => {
        if (value === undefined || value === null || value === "") return "";
        const label = key
          .replace(/([a-z])([A-Z])/g, "$1 $2")
          .replace(/^./, (char) => char.toUpperCase());
        return `${label}: ${value}`;
      })
      .filter(Boolean)
      .join("\n");
  }
  return "";
}

function buildPastInternshipSummary(details) {
  if (!details || typeof details !== "object") return "";
  const parts = [];
  if (details.title) parts.push(details.title);
  if (details.company) parts.push(`at ${details.company}`);
  if (details.duration) parts.push(`(${details.duration})`);
  if (details.techStack) parts.push(`Tech stack: ${details.techStack}`);
  return parts.join(" ").trim();
}

function buildProfileDetails(raw = {}) {
  const lines = [];
  const pastInternship = raw.pastInternship || buildPastInternshipSummary(raw.pastInternshipDetails);
  if (raw.hobby) lines.push(`Hobby: ${raw.hobby}`);
  if (raw.location) lines.push(`Location: ${raw.location}`);
  if (raw.linkedin) lines.push(`LinkedIn: ${raw.linkedin}`);
  if (raw.github) lines.push(`GitHub: ${raw.github}`);
  if (raw.otherLinks) lines.push(`Other Links: ${raw.otherLinks}`);
  if (raw.dob) lines.push(`DOB: ${raw.dob}`);
  if (raw.certifications) lines.push(`Certifications: ${raw.certifications}`);
  if (raw.skills) lines.push(`Skill set: ${raw.skills}`);
  if (pastInternship) lines.push(`Past Internship: ${pastInternship}`);
  return lines.join("\n");
}

function normalizeProjectEntries(items, fallbackTitle = "", fallbackStatus = "Active") {
  if (!Array.isArray(items)) return [];
  return items.map((project, index) => ({
    id: project.id || `PRJ-${String(index + 1).padStart(3, "0")}`,
    title: project.title || project.name || fallbackTitle || `Project ${index + 1}`,
    description: project.description || project.summary || "",
    startDate: project.effectiveDate || project.startDate || "",
    endDate: project.completionDate || project.endDate || "",
    status: project.status || fallbackStatus || "Active"
  }));
}

function normalizeTaskEntries(items) {
  if (!Array.isArray(items)) return [];
  return items.map((task, index) => {
    const submissions = Array.isArray(task.submissions)
      ? task.submissions
      : task.link
        ? [
            {
              id: `SUB-${String(index + 1).padStart(3, "0")}`,
              submittedAt: task.date || "",
              submissionUrl: task.link,
              notes: task.notes || task.name || "",
              status: "Reviewed"
            }
          ]
        : [];

    return {
      id: task.id || `TASK-${String(index + 1).padStart(3, "0")}`,
      title: task.title || task.name || `Task ${index + 1}`,
      description: task.description || task.notes || "",
      assignedAt: task.assignedAt || task.date || "",
      dueDate: task.dueDate || task.date || "",
      priority: task.priority || "Medium",
      status: task.status || (submissions.length ? "Submitted" : "Assigned"),
      submissions
    };
  });
}

function normalizePerformanceReviews(raw = {}) {
  if (Array.isArray(raw.performanceReviews)) return raw.performanceReviews;
  const summary = raw.mentorRemarks || "";
  const metricsText = serializeLines(raw.performanceMetrics);
  const rating = Math.max(1, Math.min(5, Math.round(extractPercent(raw.performanceScore || metricsText, 80) / 20)));
  if (!summary && !metricsText) return [];
  return [
    {
      id: "PRF-001",
      reviewDate: raw.verificationDateTime || raw.certificateIssueDate || raw.lorIssueDate || "",
      rating,
      summary: summary || "Performance review available.",
      strengths: metricsText || "-",
      improvements: "-"
    }
  ];
}

function normalizeStudentRecord(rawStudent, fallbackId) {
  const template = cloneStore(defaultStore.students.STU001);
  const raw = rawStudent || {};
  const hasSectionShape =
    raw.section1 || raw.section2 || raw.section3 || raw.section4 || raw.section5 || raw.section6 || raw.section7 || raw.section8;

  if (hasSectionShape) {
    template.section1 = { ...template.section1, ...(raw.section1 || {}) };
    template.section2 = { ...template.section2, ...(raw.section2 || {}) };
    template.section3 = { ...template.section3, ...(raw.section3 || {}) };
    template.section4 = { ...template.section4, ...(raw.section4 || {}) };
    template.section5 = { ...template.section5, ...(raw.section5 || {}) };
    template.section6 = { ...template.section6, ...(raw.section6 || {}) };
    template.section7 = { ...template.section7, ...(raw.section7 || {}) };
    template.section8 = { ...template.section8, ...(raw.section8 || {}) };
  } else {
    const normalizedTasks = normalizeTaskEntries(raw.tasks);
    const normalizedProjects = normalizeProjectEntries(raw.projects, raw.projectTitle, raw.currentStage || raw.status || "Active");
    const normalizedLeaveCalendar = serializeLines(
      Array.isArray(raw.calendarEvents)
        ? raw.calendarEvents
            .filter((event) => String(event?.type || "").toLowerCase() === "leave")
            .map((event) => ({ label: event.name || "Leave", date: event.date }))
        : raw.leaveCalendar
    );
    const performanceMetricsText = [
      raw.performanceScore ? `Performance Score: ${raw.performanceScore}` : "",
      serializeLines(raw.performanceMetrics)
    ]
      .filter(Boolean)
      .join("\n");
    const tasksAssigned = raw.tasksAssigned ?? normalizedTasks.length;
    const tasksCompleted =
      raw.tasksCompleted
      ?? normalizedTasks.filter((task) => ["Submitted", "Approved", "Reviewed"].includes(task.status)).length;
    const tasksPending = raw.tasksPending ?? Math.max(Number(tasksAssigned) - Number(tasksCompleted), 0);

    template.section1.verificationStatus = raw.verificationStatus || template.section1.verificationStatus;
    template.section1.verifiedBy = raw.verifiedBy || template.section1.verifiedBy;
    template.section1.verificationDateTime = raw.verificationDateTime || template.section1.verificationDateTime;
    template.section1.leaveCalendar = normalizedLeaveCalendar || "";
    template.section1.mentorFeedback = serializeLines(raw.mentorFeedback) || raw.mentorRemarks || template.section1.mentorFeedback;
    template.section1.performanceMetrics = performanceMetricsText || template.section1.performanceMetrics;

    template.section2.internName = raw.internName || raw.name || template.section2.internName;
    template.section2.internId = raw.internId || raw.studentId || raw.id || fallbackId || template.section2.internId;
    template.section2.department = raw.department || template.section2.department;
    template.section2.passingOutYear = raw.passingOutYear || template.section2.passingOutYear;
    template.section2.internshipExperience =
      raw.internshipExperience
      || raw.pastInternship
      || buildPastInternshipSummary(raw.pastInternshipDetails)
      || template.section2.internshipExperience;
    template.section2.departmentYear = raw.departmentYear || template.section2.departmentYear;
    template.section2.internshipRole = raw.internshipRole || raw.role || template.section2.internshipRole;
    template.section2.college = raw.college || template.section2.college;
    template.section2.referralPerson = raw.referralPerson || template.section2.referralPerson;
    template.section2.email = raw.email || template.section2.email;
    template.section2.phone = raw.phone || template.section2.phone;
    template.section2.resume = raw.resume || template.section2.resume;
    template.section2.profileDetails = buildProfileDetails(raw) || template.section2.profileDetails;

    template.section3.internshipType = raw.programType || raw.internshipType || template.section3.internshipType;
    template.section3.candidateInternshipType = raw.candidateInternshipType || template.section3.candidateInternshipType;
    template.section3.internshipMode = raw.internshipMode || template.section3.internshipMode;
    template.section3.organizationName = raw.organizationName || template.section3.organizationName;
    template.section3.duration = raw.duration || raw.internshipDuration || template.section3.duration;
    template.section3.joiningDate = raw.joiningDate || raw.startDate || template.section3.joiningDate;
    template.section3.completionDate = raw.completionDate || raw.endDate || template.section3.completionDate;
    template.section3.domain = raw.domain || template.section3.domain;
    template.section3.mentorName = raw.mentorName || template.section3.mentorName;
    template.section3.statusStage = raw.statusStage || raw.status || raw.currentStage || template.section3.statusStage;

    template.section4.responsibilities = raw.responsibilities || template.section4.responsibilities;
    template.section4.tasks = serializeLines(raw.tasks) || template.section4.tasks;
    template.section4.projects = serializeLines(raw.projects) || template.section4.projects;
    template.section4.toolsTechnologies = raw.toolsTechnologies || template.section4.toolsTechnologies;
    template.section4.tasksAssigned = String(tasksAssigned);
    template.section4.tasksCompleted = String(tasksCompleted);
    template.section4.tasksPending = String(tasksPending);
    template.section4.recentActivity = serializeLines(raw.recentActivity) || serializeLines(raw.tasks) || template.section4.recentActivity;

    template.section5.attendancePercentage = String(raw.attendancePercentage ?? template.section5.attendancePercentage);
    template.section5.attendanceStatus = raw.attendanceStatus || template.section5.attendanceStatus;
    template.section5.presentDays = String(raw.presentDays ?? template.section5.presentDays);
    template.section5.leaveDays = String(raw.leaveDays ?? template.section5.leaveDays);
    template.section5.approvedHolidays = String(raw.approvedHolidays ?? template.section5.approvedHolidays);
    template.section5.totalWorkingDays = String(raw.totalWorkingDays ?? template.section5.totalWorkingDays);
    template.section5.leavesTaken = String(raw.leavesTaken ?? template.section5.leavesTaken);
    template.section5.leavesToCompensate = String(raw.leavesToCompensate ?? template.section5.leavesToCompensate);

    template.section6.lorStatus = raw.lorStatus || template.section6.lorStatus;
    template.section6.issuedBy = raw.lorIssuedBy || raw.issuedBy || template.section6.issuedBy;
    template.section6.issueDate = raw.lorIssueDate || raw.issueDate || template.section6.issueDate;
    template.section6.downloadButtonLink = raw.downloadButtonLink || raw.lorDownload || template.section6.downloadButtonLink;

    template.section7.certificateId = raw.certificateId || template.section7.certificateId;
    template.section7.issueDate = raw.certificateIssueDate || raw.issueDate || template.section7.issueDate;
    template.section7.status = raw.certificateStatus || raw.status || template.section7.status;
    template.section7.downloadCertificate = raw.certificateDownload || raw.downloadCertificate || template.section7.downloadCertificate;
    template.section7.qrCode = raw.qrCode || template.section7.qrCode;
    template.section7.documents = serializeLines(raw.documents) || template.section7.documents;

    template.section8.referenceId = raw.referenceId || template.section8.referenceId;
    template.section8.dataSource = raw.dataSource || template.section8.dataSource;
    template.section8.disclaimer = raw.disclaimer || template.section8.disclaimer;

    template.projects = normalizedProjects;
    template.tasks = normalizedTasks;
    template.attendance = Array.isArray(raw.attendance) ? raw.attendance : [];
    template.performanceReviews = normalizePerformanceReviews(raw);
    template.notifications = Array.isArray(raw.notifications) ? raw.notifications : [];
  }

  if (hasSectionShape) {
    template.projects = Array.isArray(raw.projects) ? raw.projects : template.projects || [];
    template.tasks = Array.isArray(raw.tasks) ? raw.tasks : template.tasks || [];
    template.attendance = Array.isArray(raw.attendance) ? raw.attendance : template.attendance || [];
    template.performanceReviews = Array.isArray(raw.performanceReviews) ? raw.performanceReviews : template.performanceReviews || [];
    template.notifications = Array.isArray(raw.notifications) ? raw.notifications : template.notifications || [];
  }

  const finalId = raw.studentId || raw.id || raw.internId || template.section2.internId || fallbackId || "STU001";
  template.section2.internId = finalId;
  return template;
}

function makeId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function ensureCollections(student) {
  if (!student) return;
  if (!Array.isArray(student.projects)) student.projects = [];
  if (!Array.isArray(student.tasks)) student.tasks = [];
  if (!Array.isArray(student.attendance)) student.attendance = [];
  if (!Array.isArray(student.performanceReviews)) student.performanceReviews = [];
  if (!Array.isArray(student.notifications)) student.notifications = [];
}

function getStudentRecord(studentId = state.selectedStudentId) {
  if (!studentId) return null;
  const student = state.store.students?.[studentId];
  if (!student) return null;
  ensureCollections(student);
  return student;
}

function updateStudentRecord(studentId, updater) {
  const student = getStudentRecord(studentId);
  if (!student) return null;
  updater(student);
  persistStore();
  return student;
}

function generateInternId() {
  const ids = Object.keys(state.store.students || {});
  const numbers = ids
    .map((id) => Number((id.match(/\d+/) || [0])[0]))
    .filter((n) => Number.isFinite(n));
  const next = (Math.max(0, ...numbers) || 0) + 1;
  return `STU${String(next).padStart(3, "0")}`;
}

function addInternLocal(payload) {
  const internId = payload.internId || generateInternId();
  const template = cloneStore(defaultStore.students.STU001);
  template.section2 = {
    ...template.section2,
    internName: payload.internName,
    internId,
    email: payload.email,
    phone: payload.phone,
    college: payload.college || "",
    department: payload.department || "",
    departmentYear: payload.departmentYear || "",
    internshipRole: payload.internshipRole || "",
    passingOutYear: payload.passingOutYear || ""
  };
  template.section3 = {
    ...template.section3,
    joiningDate: payload.joiningDate || "",
    completionDate: payload.completionDate || "",
    statusStage: payload.statusStage || "Onboarding"
  };
  template.section1 = {
    ...template.section1,
    verificationStatus: "Pending",
    verifiedBy: "-",
    verificationDateTime: "-"
  };
  state.store.students[internId] = template;
  persistStore();
  return internId;
}

function addProjectLocal(studentId, payload) {
  return updateStudentRecord(studentId, (student) => {
    const project = {
      id: makeId("PRJ"),
      title: payload.title,
      description: payload.description || "",
      status: payload.status || "Planned",
      startDate: payload.startDate || "",
      endDate: payload.endDate || ""
    };
    student.projects.push(project);
  });
}

function updateProjectLocal(studentId, projectId, updates) {
  return updateStudentRecord(studentId, (student) => {
    const project = student.projects.find((p) => p.id === projectId);
    if (project) Object.assign(project, updates);
  });
}

function deleteProjectLocal(studentId, projectId) {
  return updateStudentRecord(studentId, (student) => {
    student.projects = student.projects.filter((p) => p.id !== projectId);
  });
}

function addTaskLocal(studentId, payload) {
  return updateStudentRecord(studentId, (student) => {
    const task = {
      id: makeId("TSK"),
      title: payload.title,
      description: payload.description || "",
      assignedAt: payload.assignedAt || new Date().toISOString().slice(0, 10),
      dueDate: payload.dueDate || "",
      priority: payload.priority || "Medium",
      status: payload.status || "Assigned",
      submissions: []
    };
    student.tasks.push(task);
  });
}

function updateTaskLocal(studentId, taskId, updates) {
  return updateStudentRecord(studentId, (student) => {
    const task = student.tasks.find((t) => t.id === taskId);
    if (task) Object.assign(task, updates);
  });
}

function deleteTaskLocal(studentId, taskId) {
  return updateStudentRecord(studentId, (student) => {
    student.tasks = student.tasks.filter((t) => t.id !== taskId);
  });
}

function addSubmissionLocal(studentId, taskId, payload) {
  return updateStudentRecord(studentId, (student) => {
    const task = student.tasks.find((t) => t.id === taskId);
    if (!task) return;
    if (!Array.isArray(task.submissions)) task.submissions = [];
    task.submissions.push({
      id: makeId("SUB"),
      submittedAt: payload.submittedAt || new Date().toISOString(),
      submissionUrl: payload.submissionUrl || "",
      notes: payload.notes || "",
      status: payload.status || "Pending"
    });
  });
}

function updateSubmissionLocal(studentId, taskId, submissionId, updates) {
  return updateStudentRecord(studentId, (student) => {
    const task = student.tasks.find((t) => t.id === taskId);
    const submission = task?.submissions?.find((s) => s.id === submissionId);
    if (submission) Object.assign(submission, updates);
  });
}

function addAttendanceLocal(studentId, payload) {
  return updateStudentRecord(studentId, (student) => {
    student.attendance.push({
      id: makeId("ATT"),
      date: payload.date,
      status: payload.status,
      remarks: payload.remarks || ""
    });
  });
}

function updateAttendanceLocal(studentId, attendanceId, updates) {
  return updateStudentRecord(studentId, (student) => {
    const record = student.attendance.find((a) => a.id === attendanceId);
    if (record) Object.assign(record, updates);
  });
}

function deleteAttendanceLocal(studentId, attendanceId) {
  return updateStudentRecord(studentId, (student) => {
    student.attendance = student.attendance.filter((a) => a.id !== attendanceId);
  });
}

function addPerformanceLocal(studentId, payload) {
  return updateStudentRecord(studentId, (student) => {
    student.performanceReviews.push({
      id: makeId("PRF"),
      reviewDate: payload.reviewDate,
      rating: payload.rating,
      summary: payload.summary || "",
      strengths: payload.strengths || "",
      improvements: payload.improvements || ""
    });
  });
}

function deletePerformanceLocal(studentId, reviewId) {
  return updateStudentRecord(studentId, (student) => {
    student.performanceReviews = student.performanceReviews.filter((r) => r.id !== reviewId);
  });
}

function addNotificationLocal(studentId, payload) {
  return updateStudentRecord(studentId, (student) => {
    student.notifications.push({
      id: makeId("NTF"),
      title: payload.title,
      message: payload.message,
      type: payload.type || "Info",
      isRead: false,
      createdAt: new Date().toISOString()
    });
  });
}

function toggleNotificationLocal(studentId, notificationId) {
  return updateStudentRecord(studentId, (student) => {
    const note = student.notifications.find((n) => n.id === notificationId);
    if (note) note.isRead = !note.isRead;
  });
}

function deleteNotificationLocal(studentId, notificationId) {
  return updateStudentRecord(studentId, (student) => {
    student.notifications = student.notifications.filter((n) => n.id !== notificationId);
  });
}

async function hydrateStoreFromBackend() {
  if (!state.userRole) return;

  let raw;
  try {
    raw = await apiRequest("/interns");
  } catch {
    raw = await apiRequest("/students");
  }
  const studentList = unwrapStudentList(raw);
  const students = {};
  studentList.forEach((item, idx) => {
    const normalized = normalizeStudentRecord(item, item?.studentId || item?.id || `STU${String(idx + 1).padStart(3, "0")}`);
    students[normalized.section2.internId] = normalized;
  });

  state.store = { students };
  if (!state.selectedStudentId || !students[state.selectedStudentId]) {
    state.selectedStudentId = Object.keys(students)[0] || null;
  }
  persistStore();
}

async function refreshStudentInStore(studentId) {
  if (!studentId) return;
  try {
    let raw;
    try {
      raw = await apiRequest(`/interns/${encodeURIComponent(studentId)}`);
    } catch {
      raw = await apiRequest(`/students/${encodeURIComponent(studentId)}`);
    }
    state.store.students[studentId] = normalizeStudentRecord(unwrapStudent(raw), studentId);
    persistStore();
  } catch {
    // If detail endpoint is not available, keep list data.
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const role = "admin";
  const username = els.username.value.trim();
  const password = els.password.value;
  try {
    const loginResponse = await apiRequest("/auth/login", {
      method: "POST",
      auth: false,
      body: {
        role,
        username,
        password
      }
    });

    const token = loginResponse?.token || loginResponse?.accessToken || loginResponse?.jwt;
    if (!token) {
      throw new Error("Login succeeded but token not returned by backend.");
    }

    state.token = token;
    localStorage.setItem("internPortalToken", token);
    state.userRole = "admin";
    state.selectedStudentId = loginResponse?.studentId || loginResponse?.user?.studentId || null;

    await hydrateStoreFromBackend();
    enterDashboard("admin", state.selectedStudentId);
  } catch (err) {
    const didLoginLocally = tryLocalLogin(username, password);
    if (didLoginLocally) {
      showError("Backend unavailable. Logged in using local demo data.");
      return;
    }
    throw err;
  }
}

function tryLocalLogin(username, password) {
  // Demo credentials for local login
  if (username === "admin" && password === "admin123") {
    state.userRole = "admin";
    state.selectedStudentId = Object.keys(state.store.students)[0] || null;
    enterDashboard("admin", state.selectedStudentId);
    return true;
  }
  return false;
}

function showError(msg) {
  els.loginError.textContent = msg;
}

function enterDashboard(role, studentId = null) {
  state.userRole = "admin";
  state.selectedStudentId = studentId || Object.keys(state.store.students)[0] || null;
  saveSession();
  els.loginError.textContent = "";
  els.loginView.classList.add("hidden");
  els.dashboardView.classList.remove("hidden");
  renderDashboard();
}

function logout() {
  state.userRole = null;
  state.selectedStudentId = null;
  state.store = loadLocalStore() || cloneStore(defaultStore);
  state.token = "";
  clearSession();
  els.loginForm.reset();
  els.username.placeholder = "e.g. admin";
  els.dashboardView.classList.add("hidden");
  els.loginView.classList.remove("hidden");
}

function renderDashboard() {
  const students = state.store.students || {};
  if (!state.selectedStudentId || !students[state.selectedStudentId]) {
    state.selectedStudentId = Object.keys(students)[0] || null;
  }
  const studentId = state.selectedStudentId;
  const student = studentId ? students[studentId] : null;

  const roleLabel = "Admin";
  els.welcomeTitle.textContent = "Admin Control Center";
  const activeLabel = student?.section2?.internName || studentId || "No intern selected";
  els.roleInfo.textContent = `${roleLabel} • ${activeLabel}`;
  els.roleBadge.textContent = roleLabel.toUpperCase();

  els.studentPickerWrap.classList.remove("hidden");
  const options = Object.keys(state.store.students)
    .map((id) => `<option value="${id}" ${id === studentId ? "selected" : ""}>${id}</option>`)
    .join("");
  els.studentPicker.innerHTML = options;

  if (!student && els.metricsContainer) {
    els.metricsContainer.classList.remove("hidden");
    els.metricsContainer.innerHTML = "<p class='error'>No interns available yet. Add your first intern below.</p>";
  }
  withRenderGuard(() => renderAdminDashboard(student), "Admin dashboard failed to render.");

  refreshReveals();
}

function renderInternDetail(student) {
  const model = buildViewModel(student);

  if (els.metricsContainer) els.metricsContainer.classList.remove("hidden");
  if (els.studentSections) els.studentSections.classList.remove("hidden");
  if (els.internDetailEmpty) els.internDetailEmpty.classList.add("hidden");

  renderSummaryCards(model);
  renderIdentity(model);
  renderInternship(model);
  renderWork(model);
  renderAttendance(model, student);
  renderLor(model);
  renderVerification(model);
  renderProjects(student);
  renderTasks(student);
  renderPerformance(student);
  renderNotifications(student);
}

function renderAdminDashboard(student) {
  const students = state.store.students || {};
  const studentList = Object.entries(students);

  if (els.metricsContainer) els.metricsContainer.classList.remove("hidden");
  const adminSections = safeGetById("adminSections");
  if (adminSections) adminSections.classList.remove("hidden");

  // Render metrics
  renderMetrics(studentList);

  // Render intern management
  renderInternManagement(studentList);
  setupAddInternForm();

  // Render monitoring
  renderMonitoring(studentList);

  // Render verification section
  renderVerificationSection();

  // Render activity feed
  renderActivityFeed(studentList);

  if (student) {
    renderInternDetail(student);
  } else if (els.studentSections) {
    els.studentSections.classList.add("hidden");
    if (els.internDetailEmpty) els.internDetailEmpty.classList.remove("hidden");
  }
}

function setupAddInternForm() {
  const form = document.getElementById("addInternForm");
  if (!form || form.dataset.handlerAttached) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      internName: document.getElementById("internName")?.value?.trim() || "",
      email: document.getElementById("internEmail")?.value?.trim() || "",
      phone: document.getElementById("internPhone")?.value?.trim() || "",
      college: document.getElementById("internCollege")?.value?.trim() || "",
      department: document.getElementById("internDepartment")?.value?.trim() || "",
      internshipRole: document.getElementById("internRole")?.value?.trim() || "",
      passingOutYear: document.getElementById("internPassingYear")?.value?.trim() || "",
      joiningDate: document.getElementById("internStartDate")?.value || "",
      completionDate: document.getElementById("internEndDate")?.value || "",
      statusStage: document.getElementById("internStatus")?.value || "Onboarding"
    };

    if (!payload.internName || !payload.email) {
      alert("Intern name and email are required.");
      return;
    }

    const localId = addInternLocal(payload);
    state.selectedStudentId = localId;
    tryApi(async () => {
      await createIntern(payload);
      await hydrateStoreFromBackend();
    }, "Backend unavailable. Intern added locally.");

    form.reset();
    renderDashboard();
  });
  form.dataset.handlerAttached = "true";
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

function renderInternManagement(studentList) {
  const searchInput = document.getElementById("internSearch");
  const statusFilter = document.getElementById("statusFilter");
  const query = (searchInput?.value || "").trim().toLowerCase();
  const statusQuery = (statusFilter?.value || "").trim().toLowerCase();

  const filtered = studentList.filter(([id, student]) => {
    const name = (student.section2?.internName || "").toLowerCase();
    const role = (student.section2?.internshipRole || "").toLowerCase();
    const status = (student.section3?.statusStage || "Pending").toLowerCase();
    const matchesQuery = !query || id.toLowerCase().includes(query) || name.includes(query) || role.includes(query);
    const matchesStatus = !statusQuery || status === statusQuery;
    return matchesQuery && matchesStatus;
  });

  const rows = filtered
    .map(([id, student]) => {
      const status = student.section3?.statusStage || "Pending";
      const verified = student.section1?.verificationStatus === "Verified" ? "Verified" : "Pending";
      return `
        <tr>
          <td><input type="checkbox" class="intern-checkbox" value="${id}" /></td>
          <td>${id}</td>
          <td>${student.section2?.internName || "-"}</td>
          <td>${student.section2?.internshipRole || "-"}</td>
          <td><span class="status-badge ${status.toLowerCase()}">${status}</span></td>
          <td><span class="status-badge ${verified.toLowerCase()}">${verified}</span></td>
          <td>
            <button class="btn btn-primary" onclick="onViewStudentDetails('${id}')">View Details</button>
            <button class="btn btn-secondary" onclick="renderEditInternForm('${id}')">Edit</button>
            <button class="btn btn-secondary" onclick="onDeleteIntern('${id}')">Delete</button>
          </td>
        </tr>
      `;
    })
    .join("");

  const tableBody = document.getElementById("internTableBody");
  if (tableBody) {
    tableBody.innerHTML =
      rows || `<tr><td colspan="7" style="text-align:center; color:#6b7f9f;">No interns match this filter.</td></tr>`;
  }

  if (searchInput && !searchInput.dataset.handlerAttached) {
    const handler = () => renderInternManagement(Object.entries(state.store.students || {}));
    searchInput.addEventListener("input", handler);
    searchInput.dataset.handlerAttached = "true";
  }
  if (statusFilter && !statusFilter.dataset.handlerAttached) {
    const handler = () => renderInternManagement(Object.entries(state.store.students || {}));
    statusFilter.addEventListener("change", handler);
    statusFilter.dataset.handlerAttached = "true";
  }
}

function renderMonitoring(studentList) {
  const avgTaskCompletion = Math.round(
    studentList.reduce((sum, [_, s]) => {
      const taskList = Array.isArray(s.tasks) ? s.tasks : [];
      const assigned = taskList.length || parseNumber(s.section4?.tasksAssigned, 0);
      const completed = taskList.length
        ? taskList.filter((t) => ["Submitted", "Approved"].includes(t.status)).length
        : parseNumber(s.section4?.tasksCompleted, 0);
      return sum + (assigned ? (completed / assigned) * 100 : 0);
    }, 0) / Math.max(studentList.length, 1)
  );

  const avgAttendance = Math.round(
    studentList.reduce((sum, [_, s]) => {
      const attendanceRecords = Array.isArray(s.attendance) ? s.attendance : [];
      if (attendanceRecords.length) {
        const presentCount = attendanceRecords.filter((record) => record.status === "Present").length;
        const percent = Math.round((presentCount / attendanceRecords.length) * 100);
        return sum + percent;
      }
      return sum + parseNumber(s.section5?.attendancePercentage, 0);
    }, 0) / Math.max(studentList.length, 1)
  );

  const attendanceOverview = document.getElementById("attendanceOverview");
  if (attendanceOverview) {
    attendanceOverview.innerHTML = `
      <div style="display: grid; gap: 10px;">
        <div><strong>${avgAttendance}%</strong> average attendance</div>
        <div class="bar"><span style="--value: ${avgAttendance}"></span></div>
      </div>
    `;
  }

  const taskProgress = document.getElementById("taskProgressChart");
  if (taskProgress) {
    taskProgress.innerHTML = `
      <div style="display: grid; gap: 10px;">
        <div><strong>${avgTaskCompletion}%</strong> average task completion</div>
        <div class="bar"><span style="--value: ${avgTaskCompletion}"></span></div>
      </div>
    `;
  }

  const performanceChart = document.getElementById("performanceChart");
  if (performanceChart) {
    performanceChart.innerHTML = `
      <div style="display: grid; gap: 10px;">
        <div><strong>${avgTaskCompletion}%</strong> tasks completed</div>
        <div class="bar"><span style="--value: ${avgTaskCompletion}"></span></div>
      </div>
    `;
  }
}

function renderVerificationSection() {
  const verificationSection = document.getElementById("verificationAdminSection");
  if (!verificationSection) return;

  verificationSection.innerHTML = `
    <div class="section-header">
      <h3>Verification & Certification</h3>
    </div>
    <div class="verification-grid">
      <div class="verification-item">
        <h4>Letter of Recommendation</h4>
        <p style="color: #4f6b8f; margin: 0 0 10px; font-size: 0.9rem;">Generate and send LOR to interns</p>
        <button class="btn btn-primary" onclick="generateLOR()">Generate LOR</button>
      </div>
      <div class="verification-item">
        <h4>Certificate Management</h4>
        <p style="color: #4f6b8f; margin: 0 0 10px; font-size: 0.9rem;">Approve and issue completion certificates</p>
        <button class="btn btn-primary" onclick="approveCertificates()">Approve Certificates</button>
      </div>
      <div class="verification-item">
        <h4>Digital Verification</h4>
        <p style="color: #4f6b8f; margin: 0 0 10px; font-size: 0.9rem;">Create digital verification stamps</p>
        <button class="btn btn-primary" onclick="generateVerificationStamp()">Generate Stamp</button>
      </div>
    </div>
  `;
}

function renderActivityFeed(studentList) {
  const activities = [];

  // Generate activities from real intern data
  studentList.forEach(([id, student]) => {
    const name = student.section2?.internName || id;

    // Verification activities
    if (student.section1?.verificationStatus === "Verified") {
      activities.push({
        type: "Verification",
        text: `${name} profile verified`,
        time: student.section1?.verificationDateTime ? formatTimeAgo(student.section1.verificationDateTime) : "Recently",
        icon: "✓"
      });
    }

    // Task completion activities
    const tasksCompleted = parseNumber(student.section4?.tasksCompleted, 0);
    if (tasksCompleted > 0) {
      activities.push({
        type: "Task",
        text: `${name} completed ${tasksCompleted} tasks`,
        time: "Recently",
        icon: "📋"
      });
    }

    // Certificate activities
    if (student.section7?.status === "Issued") {
      activities.push({
        type: "Certificate",
        text: `Certificate issued to ${name}`,
        time: student.section7?.issueDate ? formatTimeAgo(student.section7.issueDate) : "Recently",
        icon: "🏆"
      });
    }

    // LOR activities
    if (student.section6?.lorStatus === "Received") {
      activities.push({
        type: "LOR",
        text: `LOR issued to ${name}`,
        time: student.section6?.issueDate ? formatTimeAgo(student.section6.issueDate) : "Recently",
        icon: "📄"
      });
    }

    // Status change activities
    const status = student.section3?.statusStage;
    if (status) {
      activities.push({
        type: "Status",
        text: `${name} status changed to ${status}`,
        time: "Recently",
        icon: "🔄"
      });
    }
  });

  // Add some system activities
  activities.push(
    { type: "System", text: "Daily attendance report generated", time: "1 day ago", icon: "📊" },
    { type: "System", text: "Weekly progress report sent", time: "3 days ago", icon: "📧" },
    { type: "System", text: "Backup completed successfully", time: "1 week ago", icon: "💾" }
  );

  // Sort by time (most recent first) - simplified sorting
  activities.sort((a, b) => {
    if (a.time.includes("ago") && b.time.includes("ago")) return 0;
    if (a.time === "Recently") return -1;
    if (b.time === "Recently") return 1;
    return 0;
  });

  // Limit to 10 most recent activities
  const recentActivities = activities.slice(0, 10);

  const feedHtml = recentActivities
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

  const activityFeedSection = document.getElementById("activityFeedSection");
  if (activityFeedSection) {
    activityFeedSection.innerHTML = `
      <div class="section-header">
        <h3>Recent Activity Feed</h3>
      </div>
      <div class="activity-feed">
        ${feedHtml || '<div class="empty-state">No recent activities.</div>'}
      </div>
    `;
  }
}

function formatTimeAgo(dateString) {
  if (!dateString) return "Recently";

  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  } catch {
    return "Recently";
  }
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

  const attendanceRecords = Array.isArray(student.attendance) ? student.attendance : [];
  let attendancePercent = parseNumber(s5.attendancePercentage, 88);
  if (attendanceRecords.length) {
    const presentCount = attendanceRecords.filter((record) => record.status === "Present").length;
    attendancePercent = Math.round((presentCount / attendanceRecords.length) * 100);
  }
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
    department: s2.department || splitDepartmentYear(s2.departmentYear).department || s2.departmentYear || "-",
    passingOutYear: s2.passingOutYear || splitDepartmentYear(s2.departmentYear).year || "-",
    internshipExperience: s2.internshipExperience || extractProfileField(s2.profileDetails, "Past Internship") || "-",
    internshipRole: s2.internshipRole || "-",
    college: s2.college || "-",
    email: s2.email || "intern@proeduvate.com",
    phone: s2.phone || "+91 90000 00000",
    domain: s3.domain || s2.internshipRole || "-",
    mentorName: s3.mentorName || "Mentor Assigned",
    startDate: s3.joiningDate || "-",
    endDate: s3.completionDate || "-",
    internshipType: s3.internshipType || "-",
    candidateInternshipType: normalizeCandidateInternshipType(s3.candidateInternshipType || s3.internshipMode || "-"),
    duration: s3.duration || "-",
    statusStage: s3.statusStage || "Active",
    tasksAssigned: taskAssigned,
    tasksCompleted: taskCompleted,
    tasksPending: taskPending,
    taskCompletion,
    recentActivity: s4.recentActivity || s4.tasks || "",
    responsibilities: s4.responsibilities || "-",
    toolsTechnologies: s4.toolsTechnologies || "-",
    attendancePercent,
    attendanceStatus: s5.attendanceStatus || "-",
    leaveDays: parseNumber(s5.leaveDays, 0),
    presentDays: parseNumber(s5.presentDays, 0),
    approvedHolidays: parseNumber(s5.approvedHolidays, 0),
    leavesTaken: parseNumber(s5.leavesTaken, 0),
    leavesToCompensate: parseNumber(s5.leavesToCompensate, 0),
    totalWorkingDays: parseNumber(s5.totalWorkingDays, 0),
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
        ${infoBlock("Passing Out Year", model.passingOutYear)}
        ${infoBlock("Internship Experience", model.internshipExperience)}
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
      ${infoBlock("Internship Type (Online/Offline)", model.candidateInternshipType)}
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
  const feedbackItems = splitLines(model.mentorFeedback);
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
        ${taskMetric("Total Working Days", model.totalWorkingDays)}
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
    <div class="section-grid" style="margin-top:12px;">
      ${infoBlock("Responsibilities", model.responsibilities)}
      ${infoBlock("Tools & Technologies", model.toolsTechnologies)}
    </div>
    <div class="section-grid" style="margin-top:12px;">
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

function renderAttendance(model, student) {
  const leaveDates = parseLeaveCalendar(model.leaveCalendar);
  const now = new Date();
  const initialYear = now.getFullYear();
  const initialMonth = now.getMonth();
  const attendance = student?.attendance || [];

  const attendanceRows = attendance.length
    ? attendance
      .slice()
      .sort((a, b) => (a.date || "").localeCompare(b.date || ""))
      .map(
        (record) => `
          <div class="attendance-row">
            <div><strong>${record.date || "-"}</strong></div>
            <div>
              <select class="status-select" onchange="onAttendanceStatusChange('${record.id}', this.value)">
                ${["Present", "Absent", "Leave"]
            .map((status) => `<option value="${status}" ${record.status === status ? "selected" : ""}>${status}</option>`)
            .join("")}
              </select>
            </div>
            <div class="muted">${record.remarks || "-"}</div>
            <button class="btn btn-secondary" onclick="onDeleteAttendance('${record.id}')">Delete</button>
          </div>
        `
      )
      .join("")
    : `<div class="empty-state">No attendance records yet.</div>`;

  els.attendanceSection.innerHTML = `
    <h3>Attendance & Leave</h3>
    <div class="section-grid">
      ${infoBlock("Attendance", model.attendancePercentString)}
      ${infoBlock("Status", model.attendanceStatus)}
      ${infoBlock("Leave Days", String(model.leaveDays || leaveDates.length))}
      ${infoBlock("Total Working Days", model.totalWorkingDays)}
      ${infoBlock("Present Days", model.presentDays)}
      ${infoBlock("Approved Holidays", model.approvedHolidays)}
      ${infoBlock("Leaves Taken", model.leavesTaken)}
      ${infoBlock("To Compensate", model.leavesToCompensate)}
    </div>
    <div class="section-grid" style="margin-top:12px;">
      <div class="info-block">
        <span>Attendance Records</span>
        <div class="attendance-list">
          ${attendanceRows}
        </div>
      </div>
      <div class="info-block">
        <span>Add Attendance</span>
        <form id="attendanceForm" class="form-grid">
          <input type="date" id="attendanceDate" required />
          <select id="attendanceStatus" required>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Leave">Leave</option>
          </select>
          <input type="text" id="attendanceRemarks" placeholder="Remarks" />
          <button type="submit" class="btn btn-primary">Add Record</button>
        </form>
      </div>
    </div>
    <div class="section-grid" style="margin-top:12px;">
      <div class="info-block">
        <span>Leave Calendar</span>
        <div class="calendar">
          <div class="leave-calendar-toolbar">
            <button type="button" class="calendar-nav-btn" data-leave-nav="prev">Previous</button>
            <div class="calendar-header" data-leave-title></div>
            <button type="button" class="calendar-nav-btn" data-leave-nav="next">Next</button>
          </div>
          <div class="calendar-grid" data-leave-grid>
            <div class="month-empty">Loading calendar...</div>
          </div>
        </div>
      </div>
    </div>
  `;

  const attendanceForm = document.getElementById("attendanceForm");
  if (attendanceForm && !attendanceForm.dataset.handlerAttached) {
    attendanceForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const date = document.getElementById("attendanceDate").value;
      const status = document.getElementById("attendanceStatus").value;
      const remarks = document.getElementById("attendanceRemarks").value.trim();
      if (!date || !status) {
        alert("Please choose date and status.");
        return;
      }
      addAttendanceLocal(state.selectedStudentId, { date, status, remarks });
      tryApi(() => apiRequest(`/interns/${encodeURIComponent(state.selectedStudentId)}/attendance`, {
        method: "POST",
        body: { date, status, remarks }
      }), "Backend unavailable. Attendance saved locally.");
      renderDashboard();
    });
    attendanceForm.dataset.handlerAttached = "true";
  }

  mountLeaveCalendarNavigator(leaveDates, initialYear, initialMonth);
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

function renderProjects(student) {
  if (!els.projectsSection) return;
  ensureCollections(student);
  const projects = student.projects || [];

  const projectCards = projects.length
    ? projects
      .map(
        (project) => `
        <div class="item-card">
          <div class="item-header">
            <div>
              <strong>${project.title || "Untitled Project"}</strong>
              <div class="small-note">${project.description || ""}</div>
            </div>
            <select class="status-select" onchange="onProjectStatusChange('${project.id}', this.value)">
              ${["Planned", "Active", "Completed"]
            .map((status) => `<option value="${status}" ${project.status === status ? "selected" : ""}>${status}</option>`)
            .join("")}
            </select>
          </div>
          <div class="item-meta">
            <span>Start: ${project.startDate || "-"}</span>
            <span>End: ${project.endDate || "-"}</span>
          </div>
          <div class="item-actions">
            <button class="btn btn-secondary" onclick="onEditProject('${project.id}')">Edit</button>
            <button class="btn btn-secondary" onclick="onDeleteProject('${project.id}')">Delete</button>
          </div>
        </div>
      `
      )
      .join("")
    : `<div class="empty-state">No projects yet.</div>`;

  els.projectsSection.innerHTML = `
    <h3>Projects</h3>
    <div class="item-grid">
      ${projectCards}
    </div>
    <form id="projectForm" class="form-grid" style="margin-top:12px;">
      <input type="text" id="projectTitle" placeholder="Project title" required />
      <textarea id="projectDescription" rows="2" placeholder="Project description"></textarea>
      <div class="form-row">
        <input type="date" id="projectStart" />
        <input type="date" id="projectEnd" />
      </div>
      <select id="projectStatus">
        <option value="Planned">Planned</option>
        <option value="Active" selected>Active</option>
        <option value="Completed">Completed</option>
      </select>
      <button type="submit" class="btn btn-primary">Add Project</button>
    </form>
  `;

  const form = document.getElementById("projectForm");
  if (form && !form.dataset.handlerAttached) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const payload = {
        title: document.getElementById("projectTitle").value.trim(),
        description: document.getElementById("projectDescription").value.trim(),
        startDate: document.getElementById("projectStart").value,
        endDate: document.getElementById("projectEnd").value,
        status: document.getElementById("projectStatus").value
      };
      if (!payload.title) {
        alert("Project title is required.");
        return;
      }
      addProjectLocal(state.selectedStudentId, payload);
      tryApi(
        () =>
          apiRequest(`/interns/${encodeURIComponent(state.selectedStudentId)}/projects`, {
            method: "POST",
            body: payload
          }),
        "Backend unavailable. Project saved locally."
      );
      renderDashboard();
    });
    form.dataset.handlerAttached = "true";
  }
}

function renderTasks(student) {
  if (!els.tasksSection) return;
  ensureCollections(student);
  const tasks = student.tasks || [];

  const taskCards = tasks.length
    ? tasks
      .map((task) => {
        const submissions = task.submissions || [];
        const submissionsHtml = submissions.length
          ? submissions
            .map(
              (sub) => `
              <div class="submission-row">
                <div class="muted">${formatDateTime(sub.submittedAt) || "-"}</div>
                <a class="link" href="${sub.submissionUrl || "#"}" target="_blank" rel="noreferrer">${sub.submissionUrl ? "Open Submission" : "No link"}</a>
                <select class="status-select" onchange="onSubmissionStatusChange('${task.id}','${sub.id}', this.value)">
                  ${["Pending", "Reviewed", "Approved", "Rejected"]
                  .map((status) => `<option value="${status}" ${sub.status === status ? "selected" : ""}>${status}</option>`)
                  .join("")}
                </select>
              </div>
            `
            )
            .join("")
          : `<div class="empty-state">No submissions yet.</div>`;

        return `
          <div class="item-card">
            <div class="item-header">
              <div>
                <strong>${task.title || "Untitled Task"}</strong>
                <div class="small-note">${task.description || ""}</div>
              </div>
              <select class="status-select" onchange="onTaskStatusChange('${task.id}', this.value)">
                ${["Assigned", "In Progress", "Submitted", "Approved", "Rejected"]
            .map((status) => `<option value="${status}" ${task.status === status ? "selected" : ""}>${status}</option>`)
            .join("")}
              </select>
            </div>
            <div class="item-meta">
              <span>Priority: ${task.priority || "Medium"}</span>
              <span>Due: ${task.dueDate || "-"}</span>
            </div>
            <div class="item-actions">
              <button class="btn btn-secondary" onclick="onAddSubmission('${task.id}')">Add Submission</button>
              <button class="btn btn-secondary" onclick="onEditTask('${task.id}')">Edit</button>
              <button class="btn btn-secondary" onclick="onDeleteTask('${task.id}')">Delete</button>
            </div>
            <div class="submission-list">
              <strong>Submissions</strong>
              ${submissionsHtml}
            </div>
          </div>
        `;
      })
      .join("")
    : `<div class="empty-state">No tasks assigned yet.</div>`;

  els.tasksSection.innerHTML = `
    <h3>Tasks & Submissions</h3>
    <div class="item-grid">
      ${taskCards}
    </div>
    <form id="taskForm" class="form-grid" style="margin-top:12px;">
      <input type="text" id="taskTitle" placeholder="Task title" required />
      <textarea id="taskDescription" rows="2" placeholder="Task description"></textarea>
      <div class="form-row">
        <input type="date" id="taskDueDate" />
        <select id="taskPriority">
          <option value="Low">Low</option>
          <option value="Medium" selected>Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary">Assign Task</button>
    </form>
  `;

  const form = document.getElementById("taskForm");
  if (form && !form.dataset.handlerAttached) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const payload = {
        title: document.getElementById("taskTitle").value.trim(),
        description: document.getElementById("taskDescription").value.trim(),
        dueDate: document.getElementById("taskDueDate").value,
        priority: document.getElementById("taskPriority").value,
        status: "Assigned"
      };
      if (!payload.title) {
        alert("Task title is required.");
        return;
      }
      addTaskLocal(state.selectedStudentId, payload);
      tryApi(
        () =>
          apiRequest(`/interns/${encodeURIComponent(state.selectedStudentId)}/tasks`, {
            method: "POST",
            body: payload
          }),
        "Backend unavailable. Task saved locally."
      );
      renderDashboard();
    });
    form.dataset.handlerAttached = "true";
  }
}

function renderPerformance(student) {
  if (!els.performanceSection) return;
  ensureCollections(student);
  const reviews = student.performanceReviews || [];

  const reviewCards = reviews.length
    ? reviews
      .map(
        (review) => `
        <div class="item-card">
          <div class="item-header">
            <div>
              <strong>${review.reviewDate || "-"}</strong>
              <div class="small-note">Rating: ${review.rating || "-"}/5</div>
            </div>
            <button class="btn btn-secondary" onclick="onDeletePerformance('${review.id}')">Delete</button>
          </div>
          <div class="item-meta">${review.summary || "No summary provided."}</div>
          <div class="item-meta"><strong>Strengths:</strong> ${review.strengths || "-"}</div>
          <div class="item-meta"><strong>Improvements:</strong> ${review.improvements || "-"}</div>
        </div>
      `
      )
      .join("")
    : `<div class="empty-state">No performance reviews yet.</div>`;

  els.performanceSection.innerHTML = `
    <h3>Performance Evaluation</h3>
    <div class="item-grid">
      ${reviewCards}
    </div>
    <form id="performanceForm" class="form-grid" style="margin-top:12px;">
      <input type="date" id="performanceDate" required />
      <input type="number" id="performanceRating" min="1" max="5" placeholder="Rating (1-5)" required />
      <textarea id="performanceSummary" rows="2" placeholder="Summary"></textarea>
      <textarea id="performanceStrengths" rows="2" placeholder="Strengths"></textarea>
      <textarea id="performanceImprovements" rows="2" placeholder="Areas for improvement"></textarea>
      <button type="submit" class="btn btn-primary">Add Review</button>
    </form>
  `;

  const form = document.getElementById("performanceForm");
  if (form && !form.dataset.handlerAttached) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const payload = {
        reviewDate: document.getElementById("performanceDate").value,
        rating: Number(document.getElementById("performanceRating").value),
        summary: document.getElementById("performanceSummary").value.trim(),
        strengths: document.getElementById("performanceStrengths").value.trim(),
        improvements: document.getElementById("performanceImprovements").value.trim()
      };
      if (!payload.reviewDate || Number.isNaN(payload.rating)) {
        alert("Review date and rating are required.");
        return;
      }
      addPerformanceLocal(state.selectedStudentId, payload);
      tryApi(
        () =>
          apiRequest(`/interns/${encodeURIComponent(state.selectedStudentId)}/performance`, {
            method: "POST",
            body: payload
          }),
        "Backend unavailable. Performance review saved locally."
      );
      renderDashboard();
    });
    form.dataset.handlerAttached = "true";
  }
}

function renderNotifications(student) {
  if (!els.notificationsSection) return;
  ensureCollections(student);
  const notes = student.notifications || [];

  const noteCards = notes.length
    ? notes
      .map(
        (note) => `
        <div class="item-card ${note.isRead ? "read" : ""}">
          <div class="item-header">
            <div>
              <strong>${note.title || "Notification"}</strong>
              <div class="small-note">${note.type || "Info"} • ${formatDateTime(note.createdAt)}</div>
            </div>
            <button class="btn btn-secondary" onclick="onToggleNotification('${note.id}')">${note.isRead ? "Mark Unread" : "Mark Read"}</button>
          </div>
          <div class="item-meta">${note.message || "-"}</div>
          <div class="item-actions">
            <button class="btn btn-secondary" onclick="onDeleteNotification('${note.id}')">Delete</button>
          </div>
        </div>
      `
      )
      .join("")
    : `<div class="empty-state">No notifications yet.</div>`;

  els.notificationsSection.innerHTML = `
    <h3>Notifications & Messages</h3>
    <div class="item-grid">
      ${noteCards}
    </div>
    <form id="notificationForm" class="form-grid" style="margin-top:12px;">
      <input type="text" id="notificationTitle" placeholder="Title" required />
      <textarea id="notificationMessage" rows="2" placeholder="Message" required></textarea>
      <select id="notificationType">
        <option value="Info">Info</option>
        <option value="Warning">Warning</option>
        <option value="Success">Success</option>
      </select>
      <button type="submit" class="btn btn-primary">Send Notification</button>
    </form>
  `;

  const form = document.getElementById("notificationForm");
  if (form && !form.dataset.handlerAttached) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const payload = {
        title: document.getElementById("notificationTitle").value.trim(),
        message: document.getElementById("notificationMessage").value.trim(),
        type: document.getElementById("notificationType").value
      };
      if (!payload.title || !payload.message) {
        alert("Title and message are required.");
        return;
      }
      addNotificationLocal(state.selectedStudentId, payload);
      tryApi(
        () =>
          apiRequest(`/interns/${encodeURIComponent(state.selectedStudentId)}/notifications`, {
            method: "POST",
            body: payload
          }),
        "Backend unavailable. Notification saved locally."
      );
      renderDashboard();
    });
    form.dataset.handlerAttached = "true";
  }
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

function mountLeaveCalendarNavigator(leaves, year, month) {
  if (!els.attendanceSection) return;
  const titleEl = els.attendanceSection.querySelector("[data-leave-title]");
  const gridEl = els.attendanceSection.querySelector("[data-leave-grid]");
  const prevBtn = els.attendanceSection.querySelector("[data-leave-nav='prev']");
  const nextBtn = els.attendanceSection.querySelector("[data-leave-nav='next']");
  if (!titleEl || !gridEl || !prevBtn || !nextBtn) return;

  const viewDate = new Date(year, month, 1);
  const render = () => {
    const cal = buildMonthCalendarData(leaves, viewDate.getFullYear(), viewDate.getMonth());
    titleEl.textContent = cal.title;
    gridEl.innerHTML = `
      ${cal.labels.map((label) => `<div class="calendar-cell muted">${label}</div>`).join("")}
      ${cal.cells
        .map(
          (cell) => `
          <div class="calendar-cell ${cell.className}">
            ${cell.day ? `<div class="calendar-day">${cell.day}</div>` : ""}
            ${cell.items.map((item) => `<div class="leave-tag">${item}</div>`).join("")}
          </div>`
        )
        .join("")}
    `;
  };

  prevBtn.addEventListener("click", () => {
    viewDate.setMonth(viewDate.getMonth() - 1);
    render();
  });
  nextBtn.addEventListener("click", () => {
    viewDate.setMonth(viewDate.getMonth() + 1);
    render();
  });

  render();
}

function buildMonthCalendarData(leaves, year, month) {
  const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthTitle = new Date(year, month, 1).toLocaleString("default", { month: "long", year: "numeric" });
  const firstDay = new Date(year, month, 1);
  const totalDays = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay.getDay();
  const leaveMap = new Map();

  leaves.forEach((leave) => {
    const dt = new Date(`${leave.date}T00:00:00`);
    if (Number.isNaN(dt.getTime())) return;
    if (dt.getFullYear() !== year || dt.getMonth() !== month) return;
    const key = dt.getDate();
    if (!leaveMap.has(key)) leaveMap.set(key, []);
    leaveMap.get(key).push(leave.label);
  });

  const cells = [];
  for (let i = 0; i < startOffset; i += 1) {
    cells.push({ day: "", className: "muted", items: [] });
  }
  for (let day = 1; day <= totalDays; day += 1) {
    const items = leaveMap.get(day) || [];
    cells.push({
      day,
      className: items.length ? "leave" : "",
      items
    });
  }

  return { title: monthTitle, labels, cells };
}

function splitDepartmentYear(value) {
  const text = value || "";
  const [department, year] = text.split("-").map((part) => part?.trim());
  return {
    department: department || "",
    year: year || ""
  };
}

function normalizeCandidateInternshipType(value) {
  const normalized = (value || "").trim();
  if (!normalized) return "-";
  const lower = normalized.toLowerCase();
  if (lower.includes("online")) return "Online";
  if (lower.includes("offline")) return "Offline";
  if (lower.includes("hybrid")) return "Hybrid";
  return normalized;
}

function buildLeaveCalendarGrid(leaves) {
  if (!leaves.length) return [];
  const grouped = new Map();

  leaves.forEach((leave) => {
    const dt = new Date(`${leave.date}T00:00:00`);
    if (Number.isNaN(dt.getTime())) return;
    const year = dt.getFullYear();
    const month = dt.getMonth();

    if (!grouped.has(year)) {
      grouped.set(year, new Map());
    }
    const yearBucket = grouped.get(year);
    if (!yearBucket.has(month)) {
      yearBucket.set(month, []);
    }
    yearBucket.get(month).push({
      day: dt.getDate(),
      label: leave.label
    });
  });

  return Array.from(grouped.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([year, monthMap]) => ({
      year,
      months: Array.from({ length: 12 }, (_, monthIndex) => {
        const entries = monthMap.get(monthIndex) || [];
        return {
          name: new Date(year, monthIndex, 1).toLocaleString("default", { month: "long" }),
          entries: entries.sort((a, b) => a.day - b.day)
        };
      })
    }));
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
async function onViewStudentDetails(studentId) {
  await refreshStudentInStore(studentId);
  state.selectedStudentId = studentId;
  renderDashboard();
  const detailSection = document.getElementById("internDetailSection");
  if (detailSection) {
    detailSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function renderEditInternForm(studentId) {
  const student = getStudentRecord(studentId);
  if (!student) return;

  const s1 = student.section1 || {};
  const s2 = student.section2 || {};
  const s3 = student.section3 || {};
  const s4 = student.section4 || {};
  const s5 = student.section5 || {};
  const s6 = student.section6 || {};
  const s7 = student.section7 || {};
  const s8 = student.section8 || {};

  const formHtml = `
    <div class="modal-overlay" id="editModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center;">
      <div class="modal-content" style="background: white; border-radius: 8px; padding: 24px; max-width: 800px; width: 90%; max-height: 80vh; overflow-y: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #1f2937;">Edit Intern Details - ${studentId}</h2>
          <button onclick="closeEditModal()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280;">&times;</button>
        </div>

        <form id="editInternForm" style="display: grid; gap: 16px;">
          <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px;">
            <h3 style="margin: 0 0 12px 0; color: #374151;">SECTION 1: Verification & Overview</h3>
            <div style="display: grid; gap: 12px; grid-template-columns: 1fr 1fr;">
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Verification Status</label>
                <select name="verificationStatus" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
                  <option value="Verified" ${s1.verificationStatus === 'Verified' ? 'selected' : ''}>Verified</option>
                  <option value="Pending" ${s1.verificationStatus === 'Pending' ? 'selected' : ''}>Pending</option>
                  <option value="Not Verified" ${s1.verificationStatus === 'Not Verified' ? 'selected' : ''}>Not Verified</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Verified By</label>
                <input type="text" name="verifiedBy" value="${s1.verifiedBy || ''}" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
              </div>
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Verification Date</label>
                <input type="datetime-local" name="verificationDateTime" value="${s1.verificationDateTime || ''}" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
              </div>
            </div>
            <div style="margin-top: 12px;">
              <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Performance Metrics</label>
              <textarea name="performanceMetrics" rows="2" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">${s1.performanceMetrics || ''}</textarea>
            </div>
          </div>

          <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px;">
            <h3 style="margin: 0 0 12px 0; color: #374151;">SECTION 2: Intern Identity Details</h3>
            <div style="display: grid; gap: 12px; grid-template-columns: 1fr 1fr;">
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Intern Name</label>
                <input type="text" name="internName" value="${s2.internName || ''}" required style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
              </div>
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Intern ID</label>
                <input type="text" name="internId" value="${s2.internId || ''}" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
              </div>
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Department</label>
                <input type="text" name="department" value="${s2.department || ''}" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
              </div>
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Internship Role</label>
                <input type="text" name="internshipRole" value="${s2.internshipRole || ''}" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
              </div>
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">College</label>
                <input type="text" name="college" value="${s2.college || ''}" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
              </div>
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Email</label>
                <input type="email" name="email" value="${s2.email || ''}" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
              </div>
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Phone</label>
                <input type="tel" name="phone" value="${s2.phone || ''}" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
              </div>
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Passing Out Year</label>
                <input type="text" name="passingOutYear" value="${s2.passingOutYear || ''}" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
              </div>
            </div>
            <div style="margin-top: 12px;">
              <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Profile Details</label>
              <textarea name="profileDetails" rows="3" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">${s2.profileDetails || ''}</textarea>
            </div>
          </div>

          <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px;">
            <h3 style="margin: 0 0 12px 0; color: #374151;">SECTION 3: Internship Information</h3>
            <div style="display: grid; gap: 12px; grid-template-columns: 1fr 1fr;">
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Organization Name</label>
                <input type="text" name="organizationName" value="${s3.organizationName || ''}" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
              </div>
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Internship Type</label>
                <input type="text" name="internshipType" value="${s3.internshipType || ''}" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
              </div>
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Internship Mode</label>
                <select name="internshipMode" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
                  <option value="Online" ${s3.internshipMode === 'Online' ? 'selected' : ''}>Online</option>
                  <option value="Offline" ${s3.internshipMode === 'Offline' ? 'selected' : ''}>Offline</option>
                  <option value="Hybrid" ${s3.internshipMode === 'Hybrid' ? 'selected' : ''}>Hybrid</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Duration</label>
                <input type="text" name="duration" value="${s3.duration || ''}" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
              </div>
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Joining Date</label>
                <input type="date" name="joiningDate" value="${s3.joiningDate || ''}" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
              </div>
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Completion Date</label>
                <input type="date" name="completionDate" value="${s3.completionDate || ''}" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
              </div>
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Status</label>
                <select name="statusStage" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
                  <option value="Active" ${s3.statusStage === 'Active' ? 'selected' : ''}>Active</option>
                  <option value="Completed" ${s3.statusStage === 'Completed' ? 'selected' : ''}>Completed</option>
                  <option value="Onboarding" ${s3.statusStage === 'Onboarding' ? 'selected' : ''}>Onboarding</option>
                  <option value="Inactive" ${s3.statusStage === 'Inactive' ? 'selected' : ''}>Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px;">
            <h3 style="margin: 0 0 12px 0; color: #374151;">SECTION 4: Work & Task Summary</h3>
            <div style="display: grid; gap: 12px;">
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Responsibilities</label>
                <textarea name="responsibilities" rows="2" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">${s4.responsibilities || ''}</textarea>
              </div>
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Tools & Technologies</label>
                <input type="text" name="toolsTechnologies" value="${s4.toolsTechnologies || ''}" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
              </div>
              <div style="display: grid; gap: 12px; grid-template-columns: 1fr 1fr 1fr;">
                <div>
                  <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Tasks Assigned</label>
                  <input type="number" name="tasksAssigned" value="${s4.tasksAssigned || ''}" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
                </div>
                <div>
                  <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Tasks Completed</label>
                  <input type="number" name="tasksCompleted" value="${s4.tasksCompleted || ''}" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
                </div>
                <div>
                  <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Tasks Pending</label>
                  <input type="number" name="tasksPending" value="${s4.tasksPending || ''}" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
                </div>
              </div>
            </div>
          </div>

          <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px;">
            <h3 style="margin: 0 0 12px 0; color: #374151;">SECTION 5: Attendance Summary</h3>
            <div style="display: grid; gap: 12px; grid-template-columns: 1fr 1fr;">
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Present Days</label>
                <input type="number" name="presentDays" value="${s5.presentDays || ''}" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
              </div>
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Total Working Days</label>
                <input type="number" name="totalWorkingDays" value="${s5.totalWorkingDays || ''}" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
              </div>
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Leave Days</label>
                <input type="number" name="leaveDays" value="${s5.leaveDays || ''}" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
              </div>
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Attendance Percentage</label>
                <input type="number" name="attendancePercentage" value="${s5.attendancePercentage || ''}" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
              </div>
            </div>
          </div>

          <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px;">
            <h3 style="margin: 0 0 12px 0; color: #374151;">SECTION 6: Letter of Recommendation</h3>
            <div style="display: grid; gap: 12px; grid-template-columns: 1fr 1fr;">
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">LOR Status</label>
                <select name="lorStatus" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
                  <option value="Received" ${s6.lorStatus === 'Received' ? 'selected' : ''}>Received</option>
                  <option value="Pending" ${s6.lorStatus === 'Pending' ? 'selected' : ''}>Pending</option>
                  <option value="Not Issued" ${s6.lorStatus === 'Not Issued' ? 'selected' : ''}>Not Issued</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Issued By</label>
                <input type="text" name="issuedBy" value="${s6.issuedBy || ''}" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
              </div>
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Issue Date</label>
                <input type="date" name="issueDate" value="${s6.issueDate || ''}" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
              </div>
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Download Link</label>
                <input type="url" name="downloadButtonLink" value="${s6.downloadButtonLink || ''}" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
              </div>
            </div>
          </div>

          <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px;">
            <h3 style="margin: 0 0 12px 0; color: #374151;">SECTION 7: Certificate Details</h3>
            <div style="display: grid; gap: 12px; grid-template-columns: 1fr 1fr;">
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Certificate ID</label>
                <input type="text" name="certificateId" value="${s7.certificateId || ''}" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
              </div>
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Issue Date</label>
                <input type="date" name="certificateIssueDate" value="${s7.issueDate || ''}" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
              </div>
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Status</label>
                <select name="certificateStatus" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
                  <option value="Issued" ${s7.status === 'Issued' ? 'selected' : ''}>Issued</option>
                  <option value="Pending" ${s7.status === 'Pending' ? 'selected' : ''}>Pending</option>
                  <option value="Not Issued" ${s7.status === 'Not Issued' ? 'selected' : ''}>Not Issued</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Download Certificate</label>
                <input type="url" name="downloadCertificate" value="${s7.downloadCertificate || ''}" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
              </div>
            </div>
          </div>

          <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px;">
            <h3 style="margin: 0 0 12px 0; color: #374151;">SECTION 8: Verification Metadata</h3>
            <div style="display: grid; gap: 12px;">
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Reference ID</label>
                <input type="text" name="referenceId" value="${s8.referenceId || ''}" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
              </div>
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Data Source</label>
                <input type="text" name="dataSource" value="${s8.dataSource || ''}" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
              </div>
              <div>
                <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Disclaimer</label>
                <textarea name="disclaimer" rows="2" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">${s8.disclaimer || ''}</textarea>
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 20px;">
            <button type="button" onclick="closeEditModal()" style="padding: 8px 16px; border: 1px solid #d1d5db; border-radius: 4px; background: white; cursor: pointer;">Cancel</button>
            <button type="submit" style="padding: 8px 16px; border: none; border-radius: 4px; background: #3b82f6; color: white; cursor: pointer;">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', formHtml);

  const form = document.getElementById('editInternForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    updateStudentRecord(studentId, (record) => {
      record.section1 = {
        ...record.section1,
        verificationStatus: data.verificationStatus,
        verifiedBy: data.verifiedBy,
        verificationDateTime: data.verificationDateTime,
        performanceMetrics: data.performanceMetrics
      };
      record.section2 = {
        ...record.section2,
        internName: data.internName,
        internId: data.internId,
        department: data.department,
        internshipRole: data.internshipRole,
        college: data.college,
        email: data.email,
        phone: data.phone,
        passingOutYear: data.passingOutYear,
        profileDetails: data.profileDetails
      };
      record.section3 = {
        ...record.section3,
        organizationName: data.organizationName,
        internshipType: data.internshipType,
        internshipMode: data.internshipMode,
        duration: data.duration,
        joiningDate: data.joiningDate,
        completionDate: data.completionDate,
        statusStage: data.statusStage
      };
      record.section4 = {
        ...record.section4,
        responsibilities: data.responsibilities,
        toolsTechnologies: data.toolsTechnologies,
        tasksAssigned: data.tasksAssigned,
        tasksCompleted: data.tasksCompleted,
        tasksPending: data.tasksPending
      };
      record.section5 = {
        ...record.section5,
        presentDays: data.presentDays,
        totalWorkingDays: data.totalWorkingDays,
        leaveDays: data.leaveDays,
        attendancePercentage: data.attendancePercentage
      };
      record.section6 = {
        ...record.section6,
        lorStatus: data.lorStatus,
        issuedBy: data.issuedBy,
        issueDate: data.issueDate,
        downloadButtonLink: data.downloadButtonLink
      };
      record.section7 = {
        ...record.section7,
        certificateId: data.certificateId,
        issueDate: data.certificateIssueDate,
        status: data.certificateStatus,
        downloadCertificate: data.downloadCertificate
      };
      record.section8 = {
        ...record.section8,
        referenceId: data.referenceId,
        dataSource: data.dataSource,
        disclaimer: data.disclaimer
      };
    });

    tryApi(
      () => updateIntern(studentId, data),
      "Backend unavailable. Intern updated locally."
    );

    closeEditModal();
    renderDashboard();
  });
}

function closeEditModal() {
  const modal = document.getElementById('editModal');
  if (modal) {
    modal.remove();
  }
}

function onEditIntern(studentId) {
  const student = getStudentRecord(studentId);
  if (!student) return;
  const s2 = student.section2 || {};
  const s3 = student.section3 || {};

  const name = prompt("Intern name", s2.internName || "");
  if (name === null) return;
  const email = prompt("Email", s2.email || "");
  if (email === null) return;
  const phone = prompt("Phone", s2.phone || "");
  if (phone === null) return;
  const department = prompt("Department", s2.department || "");
  if (department === null) return;
  const role = prompt("Internship role", s2.internshipRole || "");
  if (role === null) return;
  const passingOutYear = prompt("Passing out year", s2.passingOutYear || "");
  if (passingOutYear === null) return;
  const status = prompt("Status (Active/Completed/Onboarding)", s3.statusStage || "Active");
  if (status === null) return;

  updateStudentRecord(studentId, (record) => {
    record.section2 = { ...record.section2, internName: name, email, phone, department, internshipRole: role, passingOutYear };
    record.section3 = { ...record.section3, statusStage: status };
  });

  tryApi(
    () =>
      updateIntern(studentId, {
        internName: name,
        email,
        phone,
        department,
        internshipRole: role,
        passingOutYear,
        statusStage: status
      }),
    "Backend unavailable. Intern updated locally."
  );
  renderDashboard();
}

function onDeleteIntern(studentId) {
  if (!confirm(`Delete intern ${studentId}? This cannot be undone.`)) return;
  delete state.store.students[studentId];
  if (state.selectedStudentId === studentId) {
    state.selectedStudentId = Object.keys(state.store.students)[0] || null;
  }
  persistStore();
  tryApi(() => deleteIntern(studentId), "Backend unavailable. Intern removed locally.");
  renderDashboard();
}

function onProjectStatusChange(projectId, status) {
  updateProjectLocal(state.selectedStudentId, projectId, { status });
  tryApi(
    () =>
      apiRequest(`/projects/${encodeURIComponent(projectId)}`, {
        method: "PATCH",
        body: { status }
      }),
    "Backend unavailable. Project updated locally."
  );
  renderDashboard();
}

function onEditProject(projectId) {
  const student = getStudentRecord();
  const project = student?.projects?.find((p) => p.id === projectId);
  if (!project) return;
  const title = prompt("Project title", project.title || "");
  if (title === null) return;
  const description = prompt("Project description", project.description || "");
  if (description === null) return;
  const startDate = prompt("Start date (YYYY-MM-DD)", project.startDate || "");
  if (startDate === null) return;
  const endDate = prompt("End date (YYYY-MM-DD)", project.endDate || "");
  if (endDate === null) return;
  updateProjectLocal(state.selectedStudentId, projectId, { title, description, startDate, endDate });
  tryApi(
    () =>
      apiRequest(`/projects/${encodeURIComponent(projectId)}`, {
        method: "PATCH",
        body: { title, description, startDate, endDate }
      }),
    "Backend unavailable. Project updated locally."
  );
  renderDashboard();
}

function onDeleteProject(projectId) {
  if (!confirm("Delete this project?")) return;
  deleteProjectLocal(state.selectedStudentId, projectId);
  tryApi(
    () =>
      apiRequest(`/projects/${encodeURIComponent(projectId)}`, {
        method: "DELETE"
      }),
    "Backend unavailable. Project removed locally."
  );
  renderDashboard();
}

function onTaskStatusChange(taskId, status) {
  updateTaskLocal(state.selectedStudentId, taskId, { status });
  tryApi(
    () =>
      apiRequest(`/tasks/${encodeURIComponent(taskId)}`, {
        method: "PATCH",
        body: { status }
      }),
    "Backend unavailable. Task updated locally."
  );
  renderDashboard();
}

function onEditTask(taskId) {
  const student = getStudentRecord();
  const task = student?.tasks?.find((t) => t.id === taskId);
  if (!task) return;
  const title = prompt("Task title", task.title || "");
  if (title === null) return;
  const description = prompt("Task description", task.description || "");
  if (description === null) return;
  const dueDate = prompt("Due date (YYYY-MM-DD)", task.dueDate || "");
  if (dueDate === null) return;
  const priority = prompt("Priority (Low/Medium/High)", task.priority || "Medium");
  if (priority === null) return;
  updateTaskLocal(state.selectedStudentId, taskId, { title, description, dueDate, priority });
  tryApi(
    () =>
      apiRequest(`/tasks/${encodeURIComponent(taskId)}`, {
        method: "PATCH",
        body: { title, description, dueDate, priority }
      }),
    "Backend unavailable. Task updated locally."
  );
  renderDashboard();
}

function onDeleteTask(taskId) {
  if (!confirm("Delete this task?")) return;
  deleteTaskLocal(state.selectedStudentId, taskId);
  tryApi(
    () =>
      apiRequest(`/tasks/${encodeURIComponent(taskId)}`, {
        method: "DELETE"
      }),
    "Backend unavailable. Task removed locally."
  );
  renderDashboard();
}

function onAddSubmission(taskId) {
  const submissionUrl = prompt("Submission URL");
  if (submissionUrl === null) return;
  const notes = prompt("Submission notes (optional)") || "";
  const payload = { submissionUrl, notes };
  addSubmissionLocal(state.selectedStudentId, taskId, payload);
  tryApi(
    () =>
      apiRequest(`/tasks/${encodeURIComponent(taskId)}/submissions`, {
        method: "POST",
        body: payload
      }),
    "Backend unavailable. Submission saved locally."
  );
  renderDashboard();
}

function onSubmissionStatusChange(taskId, submissionId, status) {
  updateSubmissionLocal(state.selectedStudentId, taskId, submissionId, { status });
  tryApi(
    () =>
      apiRequest(`/submissions/${encodeURIComponent(submissionId)}`, {
        method: "PATCH",
        body: { status }
      }),
    "Backend unavailable. Submission updated locally."
  );
  renderDashboard();
}

function onAttendanceStatusChange(attendanceId, status) {
  updateAttendanceLocal(state.selectedStudentId, attendanceId, { status });
  tryApi(
    () =>
      apiRequest(`/attendance/${encodeURIComponent(attendanceId)}`, {
        method: "PATCH",
        body: { status }
      }),
    "Backend unavailable. Attendance updated locally."
  );
  renderDashboard();
}

function onDeleteAttendance(attendanceId) {
  if (!confirm("Delete this attendance record?")) return;
  deleteAttendanceLocal(state.selectedStudentId, attendanceId);
  tryApi(
    () =>
      apiRequest(`/attendance/${encodeURIComponent(attendanceId)}`, {
        method: "DELETE"
      }),
    "Backend unavailable. Attendance removed locally."
  );
  renderDashboard();
}

function onDeletePerformance(reviewId) {
  if (!confirm("Delete this performance review?")) return;
  deletePerformanceLocal(state.selectedStudentId, reviewId);
  tryApi(
    () =>
      apiRequest(`/performance/${encodeURIComponent(reviewId)}`, {
        method: "DELETE"
      }),
    "Backend unavailable. Review removed locally."
  );
  renderDashboard();
}

function onToggleNotification(notificationId) {
  toggleNotificationLocal(state.selectedStudentId, notificationId);
  tryApi(
    () =>
      apiRequest(`/notifications/${encodeURIComponent(notificationId)}`, {
        method: "PATCH",
        body: { toggleRead: true }
      }),
    "Backend unavailable. Notification updated locally."
  );
  renderDashboard();
}

function onDeleteNotification(notificationId) {
  if (!confirm("Delete this notification?")) return;
  deleteNotificationLocal(state.selectedStudentId, notificationId);
  tryApi(
    () =>
      apiRequest(`/notifications/${encodeURIComponent(notificationId)}`, {
        method: "DELETE"
      }),
    "Backend unavailable. Notification removed locally."
  );
  renderDashboard();
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
    const colonIndex = doc.indexOf(":");
    const name = colonIndex === -1 ? doc.trim() : doc.slice(0, colonIndex).trim();
    const url = colonIndex === -1 ? "" : doc.slice(colonIndex + 1).trim();
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

// Verification and Certification Functions
function generateLOR() {
  const studentId = prompt("Enter Intern ID to generate LOR for:");
  if (!studentId) return;

  const student = getStudentRecord(studentId);
  if (!student) {
    alert("Intern not found!");
    return;
  }

  // Update LOR status
  updateStudentRecord(studentId, (record) => {
    record.section6 = {
      ...record.section6,
      lorStatus: "Received",
      issuedBy: "CTO - ProEduvate",
      issueDate: new Date().toISOString().split('T')[0],
      downloadButtonLink: `https://example.com/lor/${studentId}.pdf`
    };
  });

  tryApi(
    () => apiRequest(`/interns/${encodeURIComponent(studentId)}/lor`, {
      method: "POST",
      body: { generateLOR: true }
    }),
    "Backend unavailable. LOR generated locally."
  );

  alert(`LOR generated for ${student.section2?.internName || studentId}`);
  renderDashboard();
}

function approveCertificates() {
  const studentId = prompt("Enter Intern ID to approve certificate for:");
  if (!studentId) return;

  const student = getStudentRecord(studentId);
  if (!student) {
    alert("Intern not found!");
    return;
  }

  // Update certificate status
  updateStudentRecord(studentId, (record) => {
    record.section7 = {
      ...record.section7,
      status: "Issued",
      issueDate: new Date().toISOString().split('T')[0],
      downloadCertificate: `https://example.com/certificate/${studentId}.pdf`,
      qrCode: `https://example.com/certificate/${studentId}-qr.png`
    };
  });

  tryApi(
    () => apiRequest(`/interns/${encodeURIComponent(studentId)}/certificate`, {
      method: "POST",
      body: { approveCertificate: true }
    }),
    "Backend unavailable. Certificate approved locally."
  );

  alert(`Certificate approved for ${student.section2?.internName || studentId}`);
  renderDashboard();
}

function generateVerificationStamp() {
  const studentId = prompt("Enter Intern ID to generate verification stamp for:");
  if (!studentId) return;

  const student = getStudentRecord(studentId);
  if (!student) {
    alert("Intern not found!");
    return;
  }

  // Generate a verification stamp (QR code or digital signature)
  const verificationStamp = {
    studentId,
    timestamp: new Date().toISOString(),
    verifiedBy: "ProEduvate Admin",
    stampUrl: `https://example.com/stamp/${studentId}.png`
  };

  // Store verification stamp
  updateStudentRecord(studentId, (record) => {
    record.verificationStamp = verificationStamp;
  });

  tryApi(
    () => apiRequest(`/interns/${encodeURIComponent(studentId)}/stamp`, {
      method: "POST",
      body: verificationStamp
    }),
    "Backend unavailable. Verification stamp generated locally."
  );

  alert(`Verification stamp generated for ${student.section2?.internName || studentId}\nStamp URL: ${verificationStamp.stampUrl}`);
  renderDashboard();
}

// Bulk Operations and Export Functions
function toggleSelectAll() {
  const selectAllCheckbox = document.getElementById("selectAllInterns");
  const checkboxes = document.querySelectorAll(".intern-checkbox");
  checkboxes.forEach(checkbox => {
    checkbox.checked = selectAllCheckbox.checked;
  });
}

function getSelectedInterns() {
  const checkboxes = document.querySelectorAll(".intern-checkbox:checked");
  return Array.from(checkboxes).map(checkbox => checkbox.value);
}

function bulkOperations() {
  const selectedInterns = getSelectedInterns();
  if (selectedInterns.length === 0) {
    alert("Please select interns first.");
    return;
  }

  const action = prompt(`Selected ${selectedInterns.length} interns. Choose action:\n1. Mark as Active\n2. Mark as Completed\n3. Verify All\n4. Send Bulk Email\n\nEnter number:`);

  switch (action) {
    case "1":
      bulkUpdateStatus(selectedInterns, "Active");
      break;
    case "2":
      bulkUpdateStatus(selectedInterns, "Completed");
      break;
    case "3":
      bulkVerifyInterns(selectedInterns);
      break;
    case "4":
      bulkSendEmail(selectedInterns);
      break;
    default:
      alert("Invalid action.");
  }
}

function bulkUpdateStatus(internIds, status) {
  internIds.forEach(id => {
    updateStudentRecord(id, (record) => {
      record.section3 = { ...record.section3, statusStage: status };
    });
  });

  persistStore();
  alert(`${internIds.length} interns updated to ${status} status.`);
  renderDashboard();
}

function bulkVerifyInterns(internIds) {
  internIds.forEach(id => {
    updateStudentRecord(id, (record) => {
      record.section1 = {
        ...record.section1,
        verificationStatus: "Verified",
        verifiedBy: "Admin",
        verificationDateTime: new Date().toISOString()
      };
    });
  });

  persistStore();
  alert(`${internIds.length} interns verified.`);
  renderDashboard();
}

function bulkSendEmail(internIds) {
  const subject = prompt("Email subject:");
  const message = prompt("Email message:");

  if (!subject || !message) return;

  // In a real application, this would send emails via backend
  alert(`Bulk email would be sent to ${internIds.length} interns:\n\nSubject: ${subject}\nMessage: ${message}`);
}

function exportInternData() {
  const students = Object.entries(state.store.students || {});
  const csvData = [];

  // CSV Header
  csvData.push([
    "Intern ID",
    "Name",
    "Email",
    "Phone",
    "College",
    "Department",
    "Role",
    "Status",
    "Joining Date",
    "Completion Date",
    "Tasks Completed",
    "Tasks Assigned",
    "Attendance %",
    "LOR Status",
    "Certificate Status"
  ].join(","));

  // CSV Rows
  students.forEach(([id, student]) => {
    const row = [
      id,
      student.section2?.internName || "",
      student.section2?.email || "",
      student.section2?.phone || "",
      student.section2?.college || "",
      student.section2?.department || "",
      student.section2?.internshipRole || "",
      student.section3?.statusStage || "",
      student.section3?.joiningDate || "",
      student.section3?.completionDate || "",
      student.section4?.tasksCompleted || "",
      student.section4?.tasksAssigned || "",
      student.section5?.attendancePercentage || "",
      student.section6?.lorStatus || "",
      student.section7?.status || ""
    ];
    csvData.push(row.map(field => `"${field}"`).join(","));
  });

  // Download CSV
  const csvContent = csvData.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `interns-data-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  alert("Intern data exported successfully!");
}
