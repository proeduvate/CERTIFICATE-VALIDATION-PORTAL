import { useState } from 'react';
import './Interns.css';

// 8 Sample Intern Records matching reference UI image
const INITIAL_INTERNS = [
  {
    id: 'PEV-INT-000123',
    name: 'John Doe',
    email: 'john.doe@email.com',
    college: 'Vel Tech University',
    department: 'Computer Science',
    role: 'Full Stack Developer',
    duration: '6 Months',
    status: 'Active',
    joinedOn: '23 Jan 2024',
    avatarBg: '#0066FF'
  },
  {
    id: 'PEV-INT-000122',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    college: 'SRM Institute',
    department: 'Information Technology',
    role: 'UI/UX Design Intern',
    duration: '3 Months',
    status: 'Active',
    joinedOn: '25 Jan 2024',
    avatarBg: '#EC4899'
  },
  {
    id: 'PEV-INT-000121',
    name: 'Rohan Kumar',
    email: 'rohan.kumar@email.com',
    college: 'VIT University',
    department: 'Mechanical Engineering',
    role: 'ML Intern',
    duration: '6 Months',
    status: 'Active',
    joinedOn: '01 Feb 2024',
    avatarBg: '#10B981'
  },
  {
    id: 'PEV-INT-000120',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    college: 'Anna University',
    department: 'Data Science',
    role: 'Data Science Intern',
    duration: '6 Months',
    status: 'Active',
    joinedOn: '05 Feb 2024',
    avatarBg: '#8B5CF6'
  },
  {
    id: 'PEV-INT-000119',
    name: 'Arun N',
    email: 'arun.n@email.com',
    college: 'Dr. MGR University',
    department: 'Electronics & Comm.',
    role: 'Embedded Intern',
    duration: '3 Months',
    status: 'Inactive',
    joinedOn: '10 Feb 2024',
    avatarBg: '#F59E0B'
  },
  {
    id: 'PEV-INT-000118',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@email.com',
    college: 'Bharath University',
    department: 'Computer Science',
    role: 'Frontend Developer',
    duration: '6 Months',
    status: 'Inactive',
    joinedOn: '15 Feb 2024',
    avatarBg: '#EF4444'
  },
  {
    id: 'PEV-INT-000117',
    name: 'Vikram Raj',
    email: 'vikram.raj@email.com',
    college: 'PSG College',
    department: 'Information Technology',
    role: 'Backend Developer',
    duration: '3 Months',
    status: 'Completed',
    joinedOn: '20 Nov 2023',
    avatarBg: '#6366F1'
  },
  {
    id: 'PEV-INT-000116',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@email.com',
    college: 'Amrita University',
    department: 'Computer Science',
    role: 'AI/ML Intern',
    duration: '6 Months',
    status: 'Completed',
    joinedOn: '18 Nov 2023',
    avatarBg: '#14B8A6'
  }
];

export default function Interns({ onSelectIntern }) {
  const [internsList, setInternsList] = useState(INITIAL_INTERNS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState(null);

  // New Intern Form State
  const [newIntern, setNewIntern] = useState({
    name: '',
    email: '',
    college: '',
    department: 'Computer Science',
    role: '',
    duration: '6 Months',
    status: 'Active'
  });

  // Filtered List
  const filteredInterns = internsList.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.college.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesDept = deptFilter === 'All' || item.department === deptFilter;

    return matchesSearch && matchesStatus && matchesDept;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newIntern.name || !newIntern.email) return;

    const created = {
      id: `PEV-INT-000${124 + internsList.length}`,
      ...newIntern,
      joinedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      avatarBg: '#0066FF'
    };

    setInternsList([created, ...internsList]);
    setShowAddModal(false);
    setNewIntern({
      name: '',
      email: '',
      college: '',
      department: 'Computer Science',
      role: '',
      duration: '6 Months',
      status: 'Active'
    });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setDeptFilter('All');
  };

  return (
    <div className="interns-page-container">
      {/* -------------------------------------------------------------------- */}
      {/* Title & Add Button Header                                            */}
      {/* -------------------------------------------------------------------- */}
      <div className="interns-page-header">
        <div>
          <h1 className="interns-title">Interns</h1>
          <p className="interns-subtitle">Manage and view all interns in the program.</p>
        </div>

        <button type="button" className="btn-add-new-intern" onClick={() => setShowAddModal(true)}>
          <span className="plus-icon">+</span> Add New Intern
        </button>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 4 Summary Metric Cards Row                                           */}
      {/* -------------------------------------------------------------------- */}
      <div className="interns-metrics-grid">
        {/* Total Interns */}
        <div className="summary-card">
          <div className="summary-icon-circle blue">👥</div>
          <div className="summary-info">
            <span className="summary-label">Total Interns</span>
            <strong className="summary-val">248</strong>
            <span className="summary-subtext">All Time</span>
          </div>
        </div>

        {/* Active Interns */}
        <div className="summary-card">
          <div className="summary-icon-circle green">☑️</div>
          <div className="summary-info">
            <span className="summary-label">Active Interns</span>
            <strong className="summary-val">178</strong>
            <span className="summary-subtext text-green">🟢 72% of total</span>
          </div>
        </div>

        {/* Inactive Interns */}
        <div className="summary-card">
          <div className="summary-icon-circle amber">👤</div>
          <div className="summary-info">
            <span className="summary-label">Inactive Interns</span>
            <strong className="summary-val">70</strong>
            <span className="summary-subtext text-red">🔴 28% of total</span>
          </div>
        </div>

        {/* Completed Interns */}
        <div className="summary-card">
          <div className="summary-icon-circle purple">☑️</div>
          <div className="summary-info">
            <span className="summary-label">Completed Interns</span>
            <strong className="summary-val">96</strong>
            <span className="summary-subtext">This Year</span>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Search & Filters Controls Panel                                      */}
      {/* -------------------------------------------------------------------- */}
      <div className="filters-control-card">
        {/* Search Input Box */}
        <div className="search-filter-box">
          <input
            type="text"
            placeholder="Search by name, email, ID, college..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-magnifier">🔍</span>
        </div>

        {/* Dropdown Filters */}
        <div className="select-filter-group">
          <div className="filter-select-wrapper">
            <label>Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="filter-select-wrapper">
            <label>Department</label>
            <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
              <option value="All">All</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Data Science">Data Science</option>
              <option value="Electronics & Comm.">Electronics &amp; Comm.</option>
            </select>
          </div>

          <div className="filter-select-wrapper">
            <label>Internship Mode</label>
            <select>
              <option>All</option>
              <option>Full Time</option>
              <option>Part Time</option>
              <option>Remote</option>
            </select>
          </div>

          <div className="filter-select-wrapper">
            <label>Duration</label>
            <select>
              <option>All</option>
              <option>3 Months</option>
              <option>6 Months</option>
            </select>
          </div>

          <button type="button" className="btn-more-filters">
            <span>🎛️</span> More Filters
          </button>

          <button type="button" className="btn-reset-filters" onClick={handleResetFilters}>
            <span>🔄</span> Reset
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Interns Table Card                                                   */}
      {/* -------------------------------------------------------------------- */}
      <div className="interns-table-card">
        <div className="table-overflow-wrapper">
          <table className="interns-data-table">
            <thead>
              <tr>
                <th>Intern</th>
                <th>Intern ID</th>
                <th>College</th>
                <th>Department</th>
                <th>Role</th>
                <th>Duration</th>
                <th>Status <span className="info-icon">ℹ️</span></th>
                <th>Joined On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInterns.map((intern) => (
                <tr key={intern.id}>
                  {/* Intern Profile Column */}
                  <td>
                    <div 
                      className="intern-profile-cell"
                      style={{ cursor: 'pointer' }}
                      onClick={() => onSelectIntern ? onSelectIntern(intern) : setSelectedIntern(intern)}
                    >
                      <div className="intern-avatar-circle" style={{ background: intern.avatarBg }}>
                        {intern.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <strong className="cell-intern-name">{intern.name}</strong>
                        <span className="cell-intern-email">{intern.email}</span>
                      </div>
                    </div>
                  </td>

                  {/* Intern ID */}
                  <td className="cell-mono-id">{intern.id}</td>

                  {/* College */}
                  <td>{intern.college}</td>

                  {/* Department */}
                  <td>{intern.department}</td>

                  {/* Role */}
                  <td>{intern.role}</td>

                  {/* Duration */}
                  <td>{intern.duration}</td>

                  {/* Status Badge */}
                  <td>
                    <span className={`status-pill-badge ${intern.status.toLowerCase()}`}>
                      {intern.status}
                    </span>
                  </td>

                  {/* Joined On */}
                  <td className="cell-date">{intern.joinedOn}</td>

                  {/* Action Icons */}
                  <td>
                    <div className="action-buttons-cell">
                      <button 
                        type="button" 
                        className="btn-action-icon view"
                        title="View Intern Profile"
                        onClick={() => onSelectIntern ? onSelectIntern(intern) : setSelectedIntern(intern)}
                      >
                        👁️
                      </button>

                      <button 
                        type="button" 
                        className="btn-action-icon edit"
                        title="Edit Intern Details"
                        onClick={() => alert(`Editing intern ${intern.name}...`)}
                      >
                        ✏️
                      </button>

                      <button 
                        type="button" 
                        className="btn-action-icon more"
                        title="More Actions"
                        onClick={() => alert(`Options for ${intern.name}`)}
                      >
                        ⋮
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="table-pagination-footer">
          <div className="pagination-info">
            Showing 1 to {filteredInterns.length} of 248 interns
          </div>

          <div className="pagination-controls">
            <button type="button" className="page-nav-btn">&lt;</button>
            <button type="button" className="page-num-btn active">1</button>
            <button type="button" className="page-num-btn">2</button>
            <button type="button" className="page-num-btn">3</button>
            <span className="dots-sep">...</span>
            <button type="button" className="page-num-btn">31</button>
            <button type="button" className="page-nav-btn">&gt;</button>

            <select className="page-size-select">
              <option>10 / page</option>
              <option>20 / page</option>
              <option>50 / page</option>
            </select>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Add New Intern Modal                                                 */}
      {/* -------------------------------------------------------------------- */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-card-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top-bar">
              <h2>Add New Intern</h2>
              <button type="button" className="close-btn" onClick={() => setShowAddModal(false)}>✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="add-intern-form">
              <div className="form-grid-2col">
                <div className="form-field">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newIntern.name}
                    onChange={(e) => setNewIntern({ ...newIntern, name: e.target.value })}
                    placeholder="e.g. Rohit Gupta"
                  />
                </div>

                <div className="form-field">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newIntern.email}
                    onChange={(e) => setNewIntern({ ...newIntern, email: e.target.value })}
                    placeholder="rohit.gupta@email.com"
                  />
                </div>

                <div className="form-field">
                  <label>College / University</label>
                  <input
                    type="text"
                    value={newIntern.college}
                    onChange={(e) => setNewIntern({ ...newIntern, college: e.target.value })}
                    placeholder="e.g. SRM Institute"
                  />
                </div>

                <div className="form-field">
                  <label>Department</label>
                  <select
                    value={newIntern.department}
                    onChange={(e) => setNewIntern({ ...newIntern, department: e.target.value })}
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Electronics & Comm.">Electronics &amp; Comm.</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Internship Role</label>
                  <input
                    type="text"
                    value={newIntern.role}
                    onChange={(e) => setNewIntern({ ...newIntern, role: e.target.value })}
                    placeholder="e.g. Full Stack Developer"
                  />
                </div>

                <div className="form-field">
                  <label>Duration</label>
                  <select
                    value={newIntern.duration}
                    onChange={(e) => setNewIntern({ ...newIntern, duration: e.target.value })}
                  >
                    <option value="3 Months">3 Months</option>
                    <option value="6 Months">6 Months</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-submit-add">Add Intern Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* View Intern Profile Modal                                            */}
      {/* -------------------------------------------------------------------- */}
      {selectedIntern && (
        <div className="modal-backdrop" onClick={() => setSelectedIntern(null)}>
          <div className="modal-card-box profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top-bar">
              <h2>Intern Profile Details</h2>
              <button type="button" className="close-btn" onClick={() => setSelectedIntern(null)}>✕</button>
            </div>

            <div className="intern-detail-view">
              <div className="profile-detail-header">
                <div className="profile-avatar-large" style={{ background: selectedIntern.avatarBg }}>
                  {selectedIntern.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3>{selectedIntern.name}</h3>
                  <p>{selectedIntern.role} • {selectedIntern.department}</p>
                  <span className={`status-pill-badge ${selectedIntern.status.toLowerCase()}`}>
                    {selectedIntern.status}
                  </span>
                </div>
              </div>

              <div className="detail-fields-grid">
                <div>
                  <label>INTERN ID</label>
                  <strong>{selectedIntern.id}</strong>
                </div>

                <div>
                  <label>EMAIL ADDRESS</label>
                  <span>{selectedIntern.email}</span>
                </div>

                <div>
                  <label>COLLEGE / UNIVERSITY</label>
                  <span>{selectedIntern.college}</span>
                </div>

                <div>
                  <label>DURATION</label>
                  <span>{selectedIntern.duration}</span>
                </div>

                <div>
                  <label>JOINED DATE</label>
                  <span>{selectedIntern.joinedOn}</span>
                </div>

                <div>
                  <label>CERTIFICATE STATUS</label>
                  <span className="text-green">✓ Verified &amp; Issued</span>
                </div>
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="btn-submit-add" onClick={() => setSelectedIntern(null)}>
                  Close Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
