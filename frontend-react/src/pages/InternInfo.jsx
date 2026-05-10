import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const DEFAULT_INTERN_DATA = {
  internName: "Arun Prakash",
  internId: "STU001",
  departmentYear: "CSE - 3rd Year",
  internshipRole: "Frontend Intern",
  college: "ABC Engineering College",
  email: "arun.prakash@college.edu",
  phone: "+91 98765 43210",
  organizationName: "ProEduvate",
  domain: "Frontend Development",
  mentorName: "Ms. Priya N.",
  internshipType: "Academic",
  internshipMode: "Hybrid",
  joiningDate: "2025-12-01",
  completionDate: "2026-05-31",
  internshipDuration: "6 months",
  projectTitle: "Internship Tracker",
  attendancePercentage: "90",
  attendanceStatus: "Great",
  leaveDays: "2",
  totalWorkingDays: "24",
  presentDays: "20",
  mentorRemarks: "Good progress in UI tasks. Strong ownership on dashboard polish.",
  lorStatus: "Received",
  lorIssuedBy: "CTO - ProEduvate",
  lorIssueDate: "2026-02-01",
  certificateStatus: "Issued",
  certificateId: "CERT-STU001-2026",
  certificateIssueDate: "2026-02-05",
  certificateDownload: "https://example.com/certificate/stu001.pdf",
  currentStage: "Active",
  performanceScore: "88%",
  pastInternship: "Web Intern at XYZ (2 months), Tech stack: React",
  skills: "HTML, CSS, JS",
  linkedin: "https://linkedin.com/in/stu001",
  github: "https://github.com/stu001",
  disclaimer: "This record is generated for verification purposes only.",
  referenceId: "REF-STU001-7781",
  dataSource: "Internal Internship Portal",
  responsibilities:
    "Developed responsive web interfaces, collaborated on team projects, participated in code reviews, and contributed to UI/UX improvements.",
  tasks: [
    { name: "UI Dashboard Development", date: "2026-01-15", link: "https://example.com/task1" },
    { name: "API Integration", date: "2026-02-10", link: "https://example.com/task2" },
    { name: "Bug Fixes and Testing", date: "2026-03-05", link: "https://example.com/task3" }
  ],
  projects: [
    {
      description: "Internship Tracker Application",
      startDate: "2025-12-01",
      effectiveDate: "2026-01-01",
      completionDate: "2026-05-31",
      rating: "Excellent"
    }
  ],
  toolsTechnologies: "React, Tailwind CSS, Vite, Git, HTML5, CSS3, JavaScript",
  resume: "https://example.com/resume/stu001.pdf",
  hobby: "Chess, Reading",
  location: "Chennai",
  otherLinks: "https://portfolio.com/stu001",
  dob: "2004-04-14",
  certifications: "AWS Cloud Practitioner, Google Analytics",
  pastInternshipDetails: {
    title: "Web Development Intern",
    company: "XYZ Technologies",
    duration: "2 months",
    techStack: "React, Node.js, MongoDB"
  },
  verificationStatus: "Verified",
  verifiedBy: "Admin User",
  verificationDateTime: "2026-01-15 10:30 AM",
  calendarEvents: [
    { type: "leave", name: "Pongal", date: "2026-01-14", status: "Approved" },
    { type: "leave", name: "Demo Review", date: "2026-01-17", status: "Pending" },
    { type: "leave", name: "Diwali", date: "2026-10-31", status: "Approved" }
  ],
  mentorFeedback: [
    { date: "2026-01-20", feedback: "Excellent work on the dashboard UI. Shows great attention to detail." },
    { date: "2026-02-05", feedback: "Good progress on API integration. Keep up the good work." }
  ],
  performanceMetrics: {
    codeQuality: "85%",
    communication: "90%",
    teamwork: "88%",
    problemSolving: "92%"
  },
  approvedHolidays: "2",
  leavesToCompensate: "0",
  leavesTaken: "2"
};

const ADMIN_TABS = [
  { id: "home", label: "Home", icon: "home" },
  { id: "interns", label: "Interns", icon: "users" },
  { id: "calendar", label: "Calendar", icon: "calendar" },
  { id: "reports", label: "Reports", icon: "chart" },
  { id: "admin", label: "Admin", icon: "settings" }
];

const STUDENT_TABS = [
  { id: "profile", label: "Profile", icon: "home" },
  { id: "attendance", label: "Docs", icon: "users" },
  { id: "calendar", label: "Calendar", icon: "calendar" },
  { id: "reports", label: "Reports", icon: "chart" }
];

const FORM_SECTIONS = [
  { id: "identity", label: "Identity" },
  { id: "internship", label: "Internship" },
  { id: "work", label: "Work" },
  { id: "attendance", label: "Attendance" },
  { id: "docs", label: "Docs" }
];

function loadAuth() {
  const raw = localStorage.getItem("internAuth");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getNewInternTemplate(index) {
  return {
    internName: "",
    internId: "",
    departmentYear: "",
    internshipRole: "",
    college: "",
    email: "",
    phone: "",
    organizationName: "",
    domain: "",
    mentorName: "",
    internshipType: "",
    internshipMode: "",
    joiningDate: "",
    completionDate: "",
    internshipDuration: "",
    projectTitle: "",
    attendancePercentage: "",
    attendanceStatus: "",
    leaveDays: "",
    totalWorkingDays: "",
    presentDays: "",
    lorStatus: "",
    lorIssuedBy: "",
    lorIssueDate: "",
    certificateId: "",
    certificateStatus: "",
    certificateIssueDate: "",
    certificateDownload: "",
    currentStage: "",
    performanceScore: "",
    pastInternship: "",
    skills: "",
    linkedin: "",
    github: "",
    disclaimer: "",
    referenceId: "",
    dataSource: "",
    mentorRemarks: "",
    responsibilities: "",
    tasks: [],
    projects: [],
    toolsTechnologies: "",
    resume: "",
    hobby: "",
    location: "",
    otherLinks: "",
    dob: "",
    certifications: "",
    pastInternshipDetails: {
      title: "",
      company: "",
      duration: "",
      techStack: ""
    },
    verificationStatus: "",
    verifiedBy: "",
    verificationDateTime: "",
    calendarEvents: [],
    mentorFeedback: [],
    performanceMetrics: {
      codeQuality: "",
      communication: "",
      teamwork: "",
      problemSolving: ""
    },
    approvedHolidays: "",
    leavesToCompensate: "",
    leavesTaken: "",
    isNewRecord: true
  };
}

function sanitizeInternPayload(record) {
  if (!record) return record;
  const payload = { ...record };
  delete payload.isNewRecord;
  return payload;
}

function asNumber(value) {
  const numeric = Number(String(value ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

function initials(name) {
  return String(name || "Intern")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase())
    .join("");
}

function statusTone(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized.includes("verified") || normalized.includes("issued") || normalized.includes("active")) {
    return "text-emerald-500";
  }
  if (normalized.includes("pending") || normalized.includes("soon") || normalized.includes("onboarding")) {
    return "text-amber-500";
  }
  return "text-rose-500";
}

function badgeClasses(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized.includes("verified") || normalized.includes("issued") || normalized.includes("active")) {
    return "bg-emerald-50 text-emerald-600";
  }
  if (normalized.includes("pending") || normalized.includes("soon") || normalized.includes("onboarding")) {
    return "bg-amber-50 text-amber-600";
  }
  return "bg-rose-50 text-rose-600";
}

function buildCalendarDays(source) {
  const dated = source.find((entry) => entry?.date);
  const base = dated ? new Date(dated.date) : new Date();
  const year = base.getFullYear();
  const month = base.getMonth();
  const monthLabel = base.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const cells = [];

  for (let i = 0; i < firstDay; i += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= totalDays; day += 1) {
    const isoDay = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const event = source.find((entry) => entry.date === isoDay) || null;
    cells.push({ day, event });
  }

  return { monthLabel, cells };
}

function Icon({ name, active = false }) {
  const stroke = active ? "currentColor" : "currentColor";
  const common = {
    fill: "none",
    stroke,
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };

  const icons = {
    home: (
      <path {...common} d="M3.5 9.5 12 3l8.5 6.5V20a1 1 0 0 1-1 1h-5.5v-6h-4v6H4.5a1 1 0 0 1-1-1Z" />
    ),
    users: (
      <>
        <circle {...common} cx="8" cy="8" r="3" />
        <circle {...common} cx="16.5" cy="9" r="2.5" />
        <path {...common} d="M3.5 20c.7-2.7 2.7-4 6-4s5.3 1.3 6 4" />
        <path {...common} d="M14.5 16.2c2.3.2 3.9 1.1 4.8 3" />
      </>
    ),
    calendar: (
      <>
        <rect {...common} x="3" y="5" width="18" height="16" rx="3" />
        <path {...common} d="M7 3v4M17 3v4M3 10h18" />
      </>
    ),
    chart: (
      <>
        <path {...common} d="M4 20h16" />
        <path {...common} d="M7 17V11" />
        <path {...common} d="M12 17V7" />
        <path {...common} d="M17 17v-4" />
      </>
    ),
    settings: (
      <>
        <path
          {...common}
          d="M12 8.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm8 3.5-.9-.5a7.9 7.9 0 0 0-.6-1.4l.3-1a1 1 0 0 0-.2-1l-1.4-1.4a1 1 0 0 0-1-.2l-1 .3c-.4-.2-.9-.4-1.4-.6L13 4a1 1 0 0 0-1-.8h-2a1 1 0 0 0-1 .8l-.5.9c-.5.1-.9.3-1.4.6l-1-.3a1 1 0 0 0-1 .2L3.7 6.8a1 1 0 0 0-.2 1l.3 1c-.2.5-.4.9-.6 1.4L2.3 12a1 1 0 0 0 0 1l.9.5c.1.5.3.9.6 1.4l-.3 1a1 1 0 0 0 .2 1l1.4 1.4a1 1 0 0 0 1 .2l1-.3c.5.2.9.4 1.4.6l.5.9a1 1 0 0 0 1 .8h2a1 1 0 0 0 1-.8l.5-.9c.5-.1.9-.3 1.4-.6l1 .3a1 1 0 0 0 1-.2l1.4-1.4a1 1 0 0 0 .2-1l-.3-1c.2-.5.4-.9.6-1.4l.9-.5a1 1 0 0 0 0-1Z"
        />
      </>
    )
  };

  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]">
      {icons[name]}
    </svg>
  );
}

function PhoneScaffold({ title, subtitle, tabs, activeTab, onTabChange, action, children }) {
  return (
    <div className="phone-stage">
      <div className="phone-wrap">
        <div className="phone-shell-soft">
          <div className="phone-screen">
            <div className="phone-header">
              <span>9:41</span>
              <div className="flex items-center gap-1 text-[9px] text-emerald-500">
                <span className="h-2 w-4 rounded-sm border border-emerald-500/60" />
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </div>
            </div>

            <div className="app-body">
              <div className="app-topbar">
                <div>
                  <h1 className="text-[1.9rem] font-bold tracking-tight text-slate-900">{title}</h1>
                  {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
                </div>
                {action ? <div>{action}</div> : null}
              </div>

              {children}
            </div>

            <div className="bottom-nav">
              <div className="bottom-nav-grid" style={{ "--nav-count": tabs.length }}>
                {tabs.map((tab) => {
                  const active = tab.id === activeTab;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => onTabChange(tab.id)}
                      className={`bottom-nav-item ${active ? "bottom-nav-item-active" : ""}`}
                    >
                      <Icon name={tab.icon} active={active} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <input className="field-input" value={value || ""} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </div>
  );
}

function InternInfo() {
  const navigate = useNavigate();
  const [auth] = useState(loadAuth());
  const [records, setRecords] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [draft, setDraft] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [formSection, setFormSection] = useState("identity");
  const [activeTab, setActiveTab] = useState("profile");

  const isAdmin = auth?.role === "admin";
  const tabs = isAdmin ? ADMIN_TABS : STUDENT_TABS;
  const internData = isCreatingNew
    ? draft || getNewInternTemplate(records.length)
    : records[selectedIndex] || DEFAULT_INTERN_DATA;

  useEffect(() => {
    if (!auth) {
      navigate("/login", { replace: true });
      return;
    }
    setActiveTab(isAdmin ? "home" : "profile");
  }, [auth, isAdmin, navigate]);

  useEffect(() => {
    if (!auth) return;

    const fetchInterns = async () => {
      try {
        setLoading(true);
        const response = await api.get("/interns");
        const fetched = response.data?.length ? response.data : [DEFAULT_INTERN_DATA];
        setRecords(fetched);
        setError("");
      } catch (err) {
        setRecords([DEFAULT_INTERN_DATA]);
        setError(err.response?.data?.message || "Failed to load intern data.");
      } finally {
        setLoading(false);
      }
    };

    fetchInterns();
  }, [auth]);

  useEffect(() => {
    if (!records.length) return;

    const authId = auth?.id?.toString().toUpperCase();
    const authCert = auth?.certificateId;
    const foundIndex = records.findIndex((record) => {
      const recordId = record?.internId?.toString().toUpperCase();
      return recordId === authId || record?.certificateId === authCert;
    });

    setSelectedIndex(foundIndex >= 0 ? foundIndex : 0);
  }, [auth, records]);

  useEffect(() => {
    if (!isCreatingNew && internData) {
      setDraft(internData);
    }
  }, [internData, isCreatingNew]);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const query = search.trim().toLowerCase();
      const haystack = [record.internName, record.internId, record.college, record.internshipRole]
        .join(" ")
        .toLowerCase();
      const matchesSearch = !query || haystack.includes(query);

      if (!matchesSearch) return false;
      if (filter === "verified") {
        return String(record.certificateStatus).toLowerCase().includes("issued");
      }
      if (filter === "pending") {
        return String(record.certificateStatus).toLowerCase().includes("pending");
      }
      if (filter === "completing") {
        return String(record.currentStage).toLowerCase().includes("complete");
      }
      return true;
    });
  }, [filter, records, search]);

  const dashboardMetrics = useMemo(() => {
    const total = records.length || 0;
    const active = records.filter((record) => String(record.currentStage).toLowerCase().includes("active")).length;
    const completing = records.filter((record) => String(record.currentStage).toLowerCase().includes("complete")).length;
    const avgAttendance = total
      ? Math.round(records.reduce((sum, record) => sum + asNumber(record.attendancePercentage), 0) / total)
      : 0;
    return { total, active, completing, avgAttendance };
  }, [records]);

  const performanceRows = useMemo(() => {
    return records.map((record) => ({
      name: record.internName,
      subtitle: record.internshipRole,
      score: asNumber(record.performanceScore),
      tasks: record.tasks?.length || 0
    }));
  }, [records]);

  const calendarSource = internData.calendarEvents?.length ? internData.calendarEvents : DEFAULT_INTERN_DATA.calendarEvents;
  const calendar = buildCalendarDays(calendarSource);

  const saveChanges = async () => {
    if (!draft) return;

    try {
      setLoading(true);
      const payload = sanitizeInternPayload(draft);
      const response = draft.isNewRecord
        ? await api.post("/interns", payload)
        : await api.put(`/interns/${draft.internId}`, payload);
      const savedRecord = response.data;

      if (draft.isNewRecord) {
        const updatedRecords = [...records, savedRecord];
        setRecords(updatedRecords);
        setSelectedIndex(updatedRecords.length - 1);
        setIsCreatingNew(false);
      } else {
        const updatedRecords = [...records];
        updatedRecords[selectedIndex] = savedRecord;
        setRecords(updatedRecords);
      }

      setDraft(savedRecord);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  const addIntern = () => {
    const newIntern = getNewInternTemplate(records.length);
    setIsCreatingNew(true);
    setDraft(newIntern);
    setActiveTab("admin");
    setFormSection("identity");
    setError("");
  };

  const logout = () => {
    localStorage.removeItem("internAuth");
    localStorage.removeItem("internVerifyToken");
    localStorage.removeItem("currentCertificateId");
    navigate("/login", { replace: true });
  };

  const changeDraft = (field, value) => {
    setDraft((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const roleAction = (
    <button type="button" onClick={logout} className="mini-avatar bg-slate-100 text-slate-600">
      {isAdmin ? "A" : initials(internData.internName)}
    </button>
  );

  const pageTitle = isAdmin
    ? activeTab === "home"
      ? "Dashboard"
      : activeTab === "interns"
        ? "Interns"
        : activeTab === "calendar"
          ? "Calendar"
          : activeTab === "reports"
            ? "Performance"
            : "Admin Form"
    : activeTab === "attendance"
      ? "Profile"
      : activeTab === "calendar"
        ? "Calendar"
        : activeTab === "reports"
          ? "Performance"
          : "Profile";

  const pageSubtitle = isAdmin
    ? "Good morning, Admin"
    : `${internData.internName}  •  ${internData.internshipRole}`;

  const renderAdminHome = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="metric-card">
          <div className="text-[2rem] font-bold text-brand-600">{dashboardMetrics.total}</div>
          <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Total interns</div>
        </div>
        <div className="metric-card">
          <div className="text-[2rem] font-bold text-emerald-500">{dashboardMetrics.active}</div>
          <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Active</div>
        </div>
        <div className="metric-card">
          <div className="text-[2rem] font-bold text-amber-500">{dashboardMetrics.completing}</div>
          <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Completing soon</div>
        </div>
        <div className="metric-card">
          <div className="text-[2rem] font-bold text-slate-900">{dashboardMetrics.avgAttendance}%</div>
          <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Avg attendance</div>
          <div className="progress-track mt-3">
            <div className="progress-fill" style={{ width: `${dashboardMetrics.avgAttendance}%` }} />
          </div>
        </div>
      </div>

      <div className="surface-card">
        <div className="section-label">Recent interns</div>
        <div className="space-y-3">
          {records.slice(0, 4).map((record, index) => (
            <button
              key={record.certificateId || record.internId || index}
              type="button"
              onClick={() => {
                setSelectedIndex(index);
                setActiveTab("interns");
              }}
              className="flex w-full items-center gap-3 text-left"
            >
              <div className="mini-avatar bg-brand-50 text-brand-600">{initials(record.internName)}</div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-slate-900">{record.internName}</div>
                <div className="truncate text-xs text-slate-400">
                  {record.internshipRole}  •  {record.college}
                </div>
              </div>
              <span className={`text-xs font-semibold ${statusTone(record.certificateStatus)}`}>
                {String(record.certificateStatus).includes("Issued") ? "Verified" : record.certificateStatus}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="surface-card">
        <div className="section-label">Quick actions</div>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => setActiveTab("calendar")} className="btn-secondary w-full">Calendar</button>
          <button type="button" onClick={() => setActiveTab("reports")} className="btn-secondary w-full">Performance</button>
          <button type="button" onClick={() => setActiveTab("interns")} className="btn-secondary w-full">All interns</button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("admin");
              setFormSection("identity");
            }}
            className="btn-secondary w-full"
          >
            Admin form
          </button>
        </div>
      </div>
    </div>
  );

  const renderAdminInterns = () => (
    <div className="space-y-4">
      <div className="surface-card">
        <input
          className="search-field"
          placeholder="Search by name or ID..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            ["all", `All (${records.length})`],
            ["verified", "Verified"],
            ["pending", "Pending"],
            ["completing", "Completing"]
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={`chip ${filter === id ? "chip-active" : ""}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="surface-card space-y-3">
        {filteredRecords.map((record) => {
          const originalIndex = records.findIndex((entry) => entry.internId === record.internId);
          return (
            <button
              key={record.certificateId || record.internId}
              type="button"
              onClick={() => {
                setSelectedIndex(originalIndex);
                setActiveTab("admin");
              }}
              className="flex w-full items-start gap-3 rounded-2xl border border-slate-100 px-1 py-1 text-left"
            >
              <div className="mini-avatar bg-slate-100 text-brand-600">{initials(record.internName)}</div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-slate-900">{record.internName}</div>
                <div className="text-xs text-slate-400">
                  {record.internId}  •  {record.departmentYear}  •  {record.college}
                </div>
              </div>
              <span className={`text-xs font-semibold ${statusTone(record.certificateStatus)}`}>
                {String(record.certificateStatus).includes("Issued") ? "Verified" : record.certificateStatus}
              </span>
            </button>
          );
        })}
      </div>

      <button type="button" onClick={addIntern} className="btn-primary w-full">
        Add intern
      </button>
    </div>
  );

  const renderCalendarBlock = () => (
    <div className="space-y-4">
      <div className="surface-card">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-base font-semibold text-slate-900">{calendar.monthLabel}</div>
          <div className="flex gap-2">
            <span className="chip px-2 py-1">{'<'}</span>
            <span className="chip px-2 py-1">{'>'}</span>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
          {["S", "M", "T", "W", "T", "F", "S"].map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-7 gap-2">
          {calendar.cells.map((cell, index) => {
            const tone = cell?.event?.status?.toLowerCase().includes("approved")
              ? "bg-brand-600 text-white"
              : cell?.event
                ? "bg-rose-100 text-rose-600"
                : "bg-transparent text-slate-500";

            return (
              <div
                key={`${cell?.day || "blank"}-${index}`}
                className={`flex h-9 items-center justify-center rounded-full text-xs font-semibold ${tone}`}
              >
                {cell?.day || ""}
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex gap-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-brand-600" />Holiday</div>
          <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-300" />Timeline</div>
        </div>
      </div>

      <div className="surface-card">
        <div className="section-label">Mentor feedback</div>
        <div className="space-y-3">
          {(internData.mentorFeedback?.length ? internData.mentorFeedback : DEFAULT_INTERN_DATA.mentorFeedback).map((entry, index) => (
            <div key={`${entry.date}-${index}`} className="border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
              <div className="text-xs font-semibold text-slate-900">{entry.date}  •  {internData.mentorName || "Mentor"}</div>
              <p className="mt-1 text-xs leading-5 text-slate-500">{entry.feedback}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="surface-card">
        <div className="section-label">Holidays</div>
        <div className="space-y-2 text-sm text-slate-600">
          {calendarSource.map((entry) => (
            <div key={`${entry.date}-${entry.name}`} className="flex items-center justify-between">
              <span>{entry.name}</span>
              <span className="text-xs font-semibold text-rose-400">{entry.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="metric-card">
          <div className="text-2xl font-bold text-slate-900">{(asNumber(internData.performanceScore) / 20).toFixed(1)}</div>
          <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Avg rating</div>
          <div className="progress-track mt-3"><div className="progress-fill" style={{ width: `${asNumber(internData.performanceScore)}%` }} /></div>
        </div>
        <div className="metric-card">
          <div className="text-2xl font-bold text-emerald-500">{internData.attendancePercentage}%</div>
          <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Task completion</div>
          <div className="progress-track mt-3"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${internData.attendancePercentage}%` }} /></div>
        </div>
      </div>

      <div className="surface-card">
        <div className="section-label">{isAdmin ? "Individual performance" : "Performance metrics"}</div>
        <div className="space-y-4">
          {(isAdmin ? performanceRows : Object.entries(internData.performanceMetrics || DEFAULT_INTERN_DATA.performanceMetrics).map(([name, score]) => ({
            name,
            subtitle: "metric",
            score: asNumber(score),
            tasks: 0
          }))).map((row) => (
            <div key={row.name}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-semibold capitalize text-slate-900">{row.name}</span>
                <span className="text-xs font-semibold text-emerald-500">+ {row.score}</span>
              </div>
              <div className="progress-track">
                <div
                  className={`h-full rounded-full ${row.score > 85 ? "bg-emerald-500" : row.score > 70 ? "bg-amber-500" : "bg-rose-400"}`}
                  style={{ width: `${Math.min(row.score, 100)}%` }}
                />
              </div>
              {isAdmin ? <div className="mt-1 text-xs text-slate-400">{row.subtitle}  •  {row.tasks} tasks</div> : null}
            </div>
          ))}
        </div>
      </div>

      <div className="surface-card">
        <div className="section-label">Work summary</div>
        <div className="space-y-3">
          {(internData.tasks?.length ? internData.tasks : DEFAULT_INTERN_DATA.tasks).map((task, index) => (
            <div key={`${task.name}-${index}`} className="rounded-2xl border border-slate-100 p-3">
              <div className="text-sm font-semibold text-slate-900">{task.name}</div>
              <div className="mt-1 text-xs text-slate-400">{task.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStudentProfile = () => (
    <div className="space-y-4">
      <div className="surface-card text-center">
        <div className="mx-auto mini-avatar h-16 w-16 bg-brand-50 text-brand-600">{initials(internData.internName)}</div>
        <h2 className="mt-4 text-lg font-bold text-slate-900">{internData.internName}</h2>
        <p className="mt-1 text-xs text-slate-400">
          {internData.internId}  •  {internData.internshipRole}
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClasses(internData.certificateStatus)}`}>
            {String(internData.certificateStatus).includes("Issued") ? "Verified" : internData.certificateStatus}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">{internData.location}</span>
        </div>
      </div>

      <div className="surface-card">
        <div className="section-label">Verification status</div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-slate-400">Status</div>
            <div className="mt-1 font-semibold text-emerald-500">{internData.verificationStatus}</div>
          </div>
          <div>
            <div className="text-slate-400">Verified by</div>
            <div className="mt-1 font-semibold text-slate-900">{internData.verifiedBy}</div>
          </div>
          <div className="col-span-2">
            <div className="text-slate-400">Date & time</div>
            <div className="mt-1 font-semibold text-slate-900">{internData.verificationDateTime}</div>
          </div>
        </div>
      </div>

      <div className="surface-card">
        <div className="section-label">Intern identity details</div>
        <div className="space-y-3 text-sm">
          {[
            ["Full name", internData.internName],
            ["Intern ID", internData.internId],
            ["Dept & year", internData.departmentYear],
            ["College", internData.college],
            ["Referral", internData.mentorName],
            ["Location", internData.location]
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2 last:border-b-0 last:pb-0">
              <span className="text-slate-400">{label}</span>
              <span className="text-right font-semibold text-slate-900">{value}</span>
            </div>
          ))}
          <div className="pt-2">
            <div className="text-slate-400">Skills</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {String(internData.skills).split(",").map((skill) => (
                <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="surface-card">
        <div className="section-label">Internship information</div>
        <div className="space-y-3 text-sm">
          {[
            ["Organization", internData.organizationName],
            ["Type", internData.internshipType],
            ["Mode", internData.internshipMode],
            ["Duration", internData.internshipDuration],
            ["Project", internData.projectTitle]
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2 last:border-b-0 last:pb-0">
              <span className="text-slate-400">{label}</span>
              <span className="text-right font-semibold text-slate-900">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStudentAttendance = () => (
    <div className="space-y-4">
      <div className="surface-card">
        <div className="section-label">Attendance summary</div>
        <div className="grid grid-cols-3 gap-3">
          {[
            ["Present", internData.presentDays],
            ["Leaves", internData.leaveDays],
            ["Holidays", internData.approvedHolidays]
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-slate-50 p-3 text-center">
              <div className="text-2xl font-bold text-brand-600">{value}</div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{label}</div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-900">Attendance</span>
            <span className="font-semibold text-emerald-500">{internData.attendancePercentage}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${internData.attendancePercentage}%` }} />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Total working days</span>
            <span>{internData.totalWorkingDays}</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
            <span>Leaves to compensate</span>
            <span>{internData.leavesToCompensate} days</span>
          </div>
        </div>
      </div>

      <div className="surface-card">
        <div className="section-label">Letter of recommendation</div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between"><span className="text-slate-400">LOR status</span><span className={`font-semibold ${statusTone(internData.lorStatus)}`}>{internData.lorStatus}</span></div>
          <div className="flex items-center justify-between"><span className="text-slate-400">Issued by</span><span className="font-semibold text-slate-900">{internData.lorIssuedBy}</span></div>
          <div className="flex items-center justify-between"><span className="text-slate-400">Issue date</span><span className="font-semibold text-slate-900">{internData.lorIssueDate}</span></div>
        </div>
        <button type="button" className="btn-primary mt-4 w-full">Download LOR</button>
      </div>

      <div className="surface-card">
        <div className="section-label">Certificate details</div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between"><span className="text-slate-400">Certificate ID</span><span className="font-semibold text-slate-900">{internData.certificateId}</span></div>
          <div className="flex items-center justify-between"><span className="text-slate-400">Issue date</span><span className="font-semibold text-slate-900">{internData.certificateIssueDate}</span></div>
          <div className="flex items-center justify-between"><span className="text-slate-400">Status</span><span className={`font-semibold ${statusTone(internData.certificateStatus)}`}>{internData.certificateStatus}</span></div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button type="button" className="btn-primary w-full">Certificate</button>
          <button type="button" className="btn-secondary w-full">Preview</button>
        </div>
      </div>

      <div className="surface-card">
        <div className="section-label">Verification metadata</div>
        <div className="space-y-2 text-sm text-slate-500">
          <div className="flex items-center justify-between"><span>Reference ID</span><span className="font-semibold text-slate-900">{internData.referenceId}</span></div>
          <div className="flex items-center justify-between"><span>Data source</span><span className="font-semibold text-slate-900">{internData.dataSource}</span></div>
          <p className="rounded-2xl bg-slate-50 p-3 text-xs leading-5">{internData.disclaimer}</p>
        </div>
      </div>
    </div>
  );

  const renderAdminForm = () => {
    const source = draft || internData;
    if (!source) return null;

    return (
      <div className="space-y-4">
        <div className="surface-card">
          <div className="mb-4 flex items-center justify-between gap-3">
            <select
              className="field-input"
              value={isCreatingNew ? "new" : String(selectedIndex)}
              onChange={(event) => {
                const value = event.target.value;
                if (value === "new") return;
                setIsCreatingNew(false);
                setSelectedIndex(Number(value));
                setError("");
              }}
            >
              {records.map((record, index) => (
                <option key={`${record.internId || "intern"}-${index}`} value={String(index)}>
                  {record.internName || `Intern ${index + 1}`}
                </option>
              ))}
              {isCreatingNew ? <option value="new">New intern</option> : null}
            </select>
            <button type="button" onClick={addIntern} className="btn-secondary whitespace-nowrap">New</button>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {FORM_SECTIONS.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setFormSection(section.id)}
                className={`chip ${formSection === section.id ? "chip-active" : ""}`}
              >
                {section.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {formSection === "identity" ? (
              <>
                <Field label="Intern name" value={source.internName} onChange={(value) => changeDraft("internName", value)} />
                <Field label="Intern ID" value={source.internId} onChange={(value) => changeDraft("internId", value)} />
                <Field label="Department" value={source.departmentYear} onChange={(value) => changeDraft("departmentYear", value)} />
                <Field label="Internship role" value={source.internshipRole} onChange={(value) => changeDraft("internshipRole", value)} />
                <Field label="College" value={source.college} onChange={(value) => changeDraft("college", value)} />
                <Field label="Referral person" value={source.mentorName} onChange={(value) => changeDraft("mentorName", value)} />
                <Field label="WhatsApp group" value={source.otherLinks} onChange={(value) => changeDraft("otherLinks", value)} />
                <Field label="Skills" value={source.skills} onChange={(value) => changeDraft("skills", value)} />
                <Field label="LinkedIn" value={source.linkedin} onChange={(value) => changeDraft("linkedin", value)} />
              </>
            ) : null}

            {formSection === "internship" ? (
              <>
                <Field label="Organization" value={source.organizationName} onChange={(value) => changeDraft("organizationName", value)} />
                <Field label="Type" value={source.internshipType} onChange={(value) => changeDraft("internshipType", value)} />
                <Field label="Mode" value={source.internshipMode} onChange={(value) => changeDraft("internshipMode", value)} />
                <Field label="Joining date" value={source.joiningDate} onChange={(value) => changeDraft("joiningDate", value)} />
                <Field label="Completion date" value={source.completionDate} onChange={(value) => changeDraft("completionDate", value)} />
                <Field label="Duration" value={source.internshipDuration} onChange={(value) => changeDraft("internshipDuration", value)} />
                <Field label="Project title" value={source.projectTitle} onChange={(value) => changeDraft("projectTitle", value)} />
              </>
            ) : null}

            {formSection === "work" ? (
              <>
                <Field label="Responsibilities" value={source.responsibilities} onChange={(value) => changeDraft("responsibilities", value)} />
                <Field label="Tools / technologies" value={source.toolsTechnologies} onChange={(value) => changeDraft("toolsTechnologies", value)} />
                <Field label="Mentor remarks" value={source.mentorRemarks} onChange={(value) => changeDraft("mentorRemarks", value)} />
                <Field label="Current stage" value={source.currentStage} onChange={(value) => changeDraft("currentStage", value)} />
              </>
            ) : null}

            {formSection === "attendance" ? (
              <>
                <Field label="Attendance percentage" value={source.attendancePercentage} onChange={(value) => changeDraft("attendancePercentage", value)} />
                <Field label="Attendance status" value={source.attendanceStatus} onChange={(value) => changeDraft("attendanceStatus", value)} />
                <Field label="Present days" value={source.presentDays} onChange={(value) => changeDraft("presentDays", value)} />
                <Field label="Leave days" value={source.leaveDays} onChange={(value) => changeDraft("leaveDays", value)} />
                <Field label="Approved holidays" value={source.approvedHolidays} onChange={(value) => changeDraft("approvedHolidays", value)} />
                <Field label="Total working days" value={source.totalWorkingDays} onChange={(value) => changeDraft("totalWorkingDays", value)} />
              </>
            ) : null}

            {formSection === "docs" ? (
              <>
                <Field label="Certificate ID" value={source.certificateId} onChange={(value) => changeDraft("certificateId", value)} />
                <Field label="Certificate status" value={source.certificateStatus} onChange={(value) => changeDraft("certificateStatus", value)} />
                <Field label="Certificate issue date" value={source.certificateIssueDate} onChange={(value) => changeDraft("certificateIssueDate", value)} />
                <Field label="LOR status" value={source.lorStatus} onChange={(value) => changeDraft("lorStatus", value)} />
                <Field label="LOR issued by" value={source.lorIssuedBy} onChange={(value) => changeDraft("lorIssuedBy", value)} />
                <Field label="Resume URL" value={source.resume} onChange={(value) => changeDraft("resume", value)} />
              </>
            ) : null}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button type="button" onClick={saveChanges} className="btn-primary w-full">Save changes</button>
            <button
              type="button"
              onClick={() => {
                setIsCreatingNew(false);
                setDraft(records[selectedIndex] || DEFAULT_INTERN_DATA);
                setError("");
              }}
              className="btn-secondary w-full"
            >
              Discard
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <div className="surface-card text-sm text-slate-500">Loading intern data...</div>;
    }

    if (error && !records.length) {
      return <div className="surface-card text-sm text-rose-500">{error}</div>;
    }

    if (isAdmin) {
      if (activeTab === "home") return renderAdminHome();
      if (activeTab === "interns") return renderAdminInterns();
      if (activeTab === "calendar") return renderCalendarBlock();
      if (activeTab === "reports") return renderPerformance();
      return renderAdminForm();
    }

    if (activeTab === "attendance") return renderStudentAttendance();
    if (activeTab === "calendar") return renderCalendarBlock();
    if (activeTab === "reports") return renderPerformance();
    return renderStudentProfile();
  };

  return (
    <PhoneScaffold
      title={pageTitle}
      subtitle={pageSubtitle}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      action={roleAction}
    >
      {error && records.length ? (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-700">
          {error}
        </div>
      ) : null}
      {renderContent()}
    </PhoneScaffold>
  );
}

export default InternInfo;
