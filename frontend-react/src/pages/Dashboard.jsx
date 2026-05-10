import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  useEffect(() => {
    const token = localStorage.getItem("internVerifyToken");
    if (!token) {
      navigate("/verify", { replace: true });
      return;
    }

    const loadDashboard = async () => {
      try {
        const response = await api.get("/dashboard");
        setData(response.data || {});
        setLoading(false);
      } catch (err) {
        if (err?.response?.status === 401) {
          localStorage.removeItem("internVerifyToken");
          navigate("/verify", { replace: true });
          return;
        }
        setError("Unable to load dashboard data.");
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  const onLogout = () => {
    localStorage.removeItem("internVerifyToken");
    navigate("/verify", { replace: true });
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4 py-10">
      <section className="panel-card w-full max-w-3xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Verified Access</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Intern Dashboard</h1>
          </div>
          <button onClick={onLogout} className="btn-secondary">
            Logout
          </button>
        </div>

        {loading && <p className="text-sm text-slate-600">Loading dashboard...</p>}
        {!loading && error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Intern Name</p>
                <p className="mt-1 text-base font-semibold text-slate-900">{data?.internName || "-"}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Internship Status</p>
                <p className="mt-1 text-base font-semibold text-slate-900">{data?.projectStatus || "Active"}</p>
              </div>
            </div>

            {/* SECTION 2: Intern Identity Details */}
            <div className="rounded-xl border border-slate-200 bg-white">
              <button
                onClick={() => toggleSection('section2')}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <h2 className="text-lg font-semibold text-slate-900">SECTION 2: Intern Identity Details</h2>
                <span className={`transform transition-transform ${expandedSections.section2 ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {expandedSections.section2 && (
                <div className="p-4 border-t border-slate-200 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div><strong>Intern Name:</strong> {data?.section2?.internName || "-"}</div>
                    <div><strong>Intern ID:</strong> {data?.section2?.internId || "-"}</div>
                    <div><strong>Department, Year:</strong> {data?.section2?.departmentYear || "-"}</div>
                    <div><strong>Internship Role:</strong> {data?.section2?.internshipRole || "-"}</div>
                    <div><strong>College:</strong> {data?.section2?.college || "-"}</div>
                    <div><strong>Referral Person:</strong> {data?.section2?.referralPerson || "-"}</div>
                    <div><strong>WhatsApp Group:</strong> <a href={data?.section2?.whatsappGroup} className="text-blue-600 hover:underline">Join Group</a></div>
                    <div><strong>Resume:</strong> <a href={data?.section2?.resume} className="text-blue-600 hover:underline">Download</a></div>
                  </div>
                  <div className="mt-4">
                    <strong>Additional Details:</strong>
                    <div className="mt-2 space-y-1 text-sm">
                      <div><strong>Hobby:</strong> {data?.section2?.hobby || "-"}</div>
                      <div><strong>Location:</strong> {data?.section2?.location || "-"}</div>
                      <div><strong>LinkedIn:</strong> <a href={data?.section2?.linkedin} className="text-blue-600 hover:underline">{data?.section2?.linkedin || "-"}</a></div>
                      <div><strong>GitHub:</strong> <a href={data?.section2?.github} className="text-blue-600 hover:underline">{data?.section2?.github || "-"}</a></div>
                      <div><strong>DOB:</strong> {data?.section2?.dob || "-"}</div>
                      <div><strong>Certifications:</strong> {data?.section2?.certifications || "-"}</div>
                      <div><strong>Skill Set:</strong> {data?.section2?.skillSet || "-"}</div>
                      <div><strong>Past Internship:</strong> {data?.section2?.pastInternship || "-"}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 3: Internship Information */}
            <div className="rounded-xl border border-slate-200 bg-white">
              <button
                onClick={() => toggleSection('section3')}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <h2 className="text-lg font-semibold text-slate-900">SECTION 3: Internship Information</h2>
                <span className={`transform transition-transform ${expandedSections.section3 ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {expandedSections.section3 && (
                <div className="p-4 border-t border-slate-200 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div><strong>Organization Name:</strong> {data?.section3?.organizationName || "-"}</div>
                    <div><strong>Internship Type:</strong> {data?.section3?.internshipType || "-"}</div>
                    <div><strong>Internship Mode:</strong> {data?.section3?.internshipMode || "-"}</div>
                    <div><strong>Duration:</strong> {data?.section3?.duration || "-"}</div>
                    <div><strong>Year of Completion:</strong> {data?.section3?.yearCompletion || "-"}</div>
                    <div><strong>Date of Joining:</strong> {data?.section3?.joiningDate || "-"}</div>
                    <div><strong>Completion Date:</strong> {data?.section3?.completionDate || "-"}</div>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 4: Work & Task Summary */}
            <div className="rounded-xl border border-slate-200 bg-white">
              <button
                onClick={() => toggleSection('section4')}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <h2 className="text-lg font-semibold text-slate-900">SECTION 4: Work & Task Summary</h2>
                <span className={`transform transition-transform ${expandedSections.section4 ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {expandedSections.section4 && (
                <div className="p-4 border-t border-slate-200 space-y-4">
                  <div><strong>Responsibilities:</strong> {data?.section4?.responsibilities || "-"}</div>

                  <div>
                    <strong>Tasks:</strong>
                    <div className="mt-2 space-y-2">
                      {data?.section4?.tasks?.map((task, index) => (
                        <div key={index} className="p-2 bg-slate-50 rounded">
                          <div>{task.date} - {task.task}</div>
                          <a href={task.link} className="text-blue-600 hover:underline text-sm">View Task</a>
                        </div>
                      )) || "-"}
                    </div>
                  </div>

                  <div>
                    <strong>Projects:</strong>
                    <div className="mt-2 space-y-2">
                      {data?.section4?.projects?.map((project, index) => (
                        <div key={index} className="p-2 bg-slate-50 rounded">
                          <div><strong>Description:</strong> {project.description}</div>
                          <div><strong>Start Date:</strong> {project.startDate}</div>
                          <div><strong>Effective Date:</strong> {project.effectiveDate}</div>
                          <div><strong>Actual Completion:</strong> {project.actualCompletion}</div>
                          <div><strong>Rating:</strong> {project.rating}</div>
                        </div>
                      )) || "-"}
                    </div>
                  </div>

                  <div><strong>Tools/Technologies:</strong> {data?.section4?.toolsTechnologies || "-"}</div>
                </div>
              )}
            </div>

            {/* SECTION 5: Attendance Summary */}
            <div className="rounded-xl border border-slate-200 bg-white">
              <button
                onClick={() => toggleSection('section5')}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <h2 className="text-lg font-semibold text-slate-900">SECTION 5: Attendance Summary</h2>
                <span className={`transform transition-transform ${expandedSections.section5 ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {expandedSections.section5 && (
                <div className="p-4 border-t border-slate-200 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div><strong>Leave Days:</strong> {data?.section5?.leaveDays || "-"}</div>
                    <div><strong>Approved Holidays:</strong> {data?.section5?.approvedHolidays || "-"}</div>
                    <div><strong>Present Days:</strong> {data?.section5?.presentDays || "-"}</div>
                    <div><strong>Attendance Percentage:</strong> {data?.section5?.attendancePercentage || "-"}</div>
                    <div><strong>Attendance Status:</strong> {data?.section5?.attendanceStatus || "-"}</div>
                    <div><strong>Total Working Days:</strong> {data?.section5?.totalWorkingDays || "-"}</div>
                    <div><strong>Leaves Taken:</strong> {data?.section5?.leavesTaken || "-"}</div>
                    <div><strong>Leaves to Compensate:</strong> {data?.section5?.leavesToCompensate || "-"}</div>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 6: Letter of Recommendation (LOR) */}
            <div className="rounded-xl border border-slate-200 bg-white">
              <button
                onClick={() => toggleSection('section6')}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <h2 className="text-lg font-semibold text-slate-900">SECTION 6: Letter of Recommendation (LOR)</h2>
                <span className={`transform transition-transform ${expandedSections.section6 ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {expandedSections.section6 && (
                <div className="p-4 border-t border-slate-200 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div><strong>LOR Status:</strong> <span className={`px-2 py-1 rounded text-sm ${data?.section6?.lorStatus === 'Received' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{data?.section6?.lorStatus || "-"}</span></div>
                    <div><strong>Issued By:</strong> {data?.section6?.issuedBy || "-"}</div>
                    <div><strong>Issue Date:</strong> {data?.section6?.issueDate || "-"}</div>
                    <div><strong>Download:</strong> <a href={data?.section6?.downloadButtonLink} className="text-blue-600 hover:underline">Download LOR</a></div>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 7: Certificate Details */}
            <div className="rounded-xl border border-slate-200 bg-white">
              <button
                onClick={() => toggleSection('section7')}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <h2 className="text-lg font-semibold text-slate-900">SECTION 7: Certificate Details</h2>
                <span className={`transform transition-transform ${expandedSections.section7 ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {expandedSections.section7 && (
                <div className="p-4 border-t border-slate-200 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div><strong>Certificate ID:</strong> {data?.section7?.certificateId || "-"}</div>
                    <div><strong>Issue Date:</strong> {data?.section7?.issueDate || "-"}</div>
                    <div><strong>Status:</strong> <span className={`px-2 py-1 rounded text-sm ${data?.section7?.status === 'Issued' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{data?.section7?.status || "-"}</span></div>
                    <div><strong>Download Certificate:</strong> <a href={data?.section7?.downloadCertificate} className="text-blue-600 hover:underline">Download</a></div>
                    <div><strong>QR Code:</strong> <a href={data?.section7?.qrCode} className="text-blue-600 hover:underline">View QR</a></div>
                  </div>

                  <div className="mt-4">
                    <strong>Documents:</strong>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      <div><strong>AL:</strong> <a href={data?.section7?.documents?.AL} className="text-blue-600 hover:underline">Download</a></div>
                      <div><strong>TC:</strong> <a href={data?.section7?.documents?.TC} className="text-blue-600 hover:underline">Download</a></div>
                      <div><strong>OL:</strong> <a href={data?.section7?.documents?.OL} className="text-blue-600 hover:underline">Download</a></div>
                      <div><strong>OTHERS:</strong> <a href={data?.section7?.documents?.OTHERS} className="text-blue-600 hover:underline">Download</a></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 8: Verification Metadata */}
            <div className="rounded-xl border border-slate-200 bg-white">
              <button
                onClick={() => toggleSection('section8')}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <h2 className="text-lg font-semibold text-slate-900">SECTION 8: Verification Metadata</h2>
                <span className={`transform transition-transform ${expandedSections.section8 ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {expandedSections.section8 && (
                <div className="p-4 border-t border-slate-200 space-y-3">
                  <div><strong>Reference ID:</strong> {data?.section8?.referenceId || "-"}</div>
                  <div><strong>Data Source:</strong> {data?.section8?.dataSource || "-"}</div>
                  <div><strong>Disclaimer:</strong> {data?.section8?.disclaimer || "-"}</div>
                </div>
              )}
            </div>

            {/* Additional Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Present Days</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{data?.presentDays ?? "-"}</p>
                <p className="text-xs text-slate-500">out of {data?.totalWorkingDays ?? "-"} days</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Performance Score</p>
                <p className="mt-1 text-2xl font-bold text-purple-600">{data?.performanceScore ?? "-"}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Attendance</p>
                <p className="mt-1 text-2xl font-bold text-green-600">{data?.attendancePercentage ?? "-"}%</p>
              </div>
            </div>

            {/* Internship Details */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Internship Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Duration</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">{data?.internshipDuration ?? "-"}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Project</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">{data?.projectTitle ?? "-"}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Joining Date</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">{data?.joiningDate ?? "-"}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Completion Date</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">{data?.completionDate ?? "-"}</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            {data?.recentActivity && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-3">Recent Activity</h2>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="space-y-2">
                    {data.recentActivity.split('\n').map((activity, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        <p className="text-sm text-slate-700">{activity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Mentor Remarks */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Mentor Remarks</h2>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-700">{data?.mentorRemarks || "-"}</p>
              </div>
            </div>
          </div >
        )
        }
      </section >
    </div >
  );
}

export default Dashboard;
