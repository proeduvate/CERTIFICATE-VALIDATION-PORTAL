import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import './Dashboard.css';

const recentInterns = [
  {
    initials: 'AK',
    avatarClass: 'ak',
    name: 'Arunima Krishnan',
    meta: 'UI/UX Design · SSN College',
    status: 'Verified',
  },
  {
    initials: 'DB',
    avatarClass: 'db',
    name: 'Dinesh Balaji',
    meta: 'Full Stack Dev · Anna University',
    status: 'Pending',
  },
  {
    initials: 'PS',
    avatarClass: 'ps',
    name: 'Priya Subramanian',
    meta: 'Data Science · IIT Madras',
    status: 'Verified',
  },
];

const quickActions = ['Calendar', 'Performance', 'All Interns', 'Admin Form'];

function Dashboard() {
  return (
    <div className="dashboard-shell">
      <div className="dash-browser">
        <div className="dash-browser-header">
          <div className="dash-dots" aria-hidden="true">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
          </div>
          <div className="dash-url">app.interntrack.in/dashboard</div>
        </div>

        <div className="dash-window">
          <Sidebar view="dashboard" setView={() => {}} />

          <main className="dashboard-main">
            <Header title="Dashboard" searchPlaceholder="Search interns..." />

            <section className="content-area">
              <div className="page-title">
                <div>
                  <h2>Dashboard</h2>
                  <p>Good morning, Admin</p>
                </div>
                <button className="add-intern" type="button">+ Add intern</button>
              </div>

              <div className="stats-grid">
                <span className="dash-callout stats-callout">Stats titles x4</span>
                <article className="stat-card blue">
                  <strong>24</strong>
                  <span>TOTAL INTERNS</span>
                </article>
                <article className="stat-card green">
                  <strong>18</strong>
                  <span>ACTIVE</span>
                </article>
                <article className="stat-card amber">
                  <strong>6</strong>
                  <span>COMPLETING SOON</span>
                </article>
                <article className="stat-card attendance">
                  <strong>87%</strong>
                  <span>AVG ATTENDANCE</span>
                  <div><i></i></div>
                </article>
              </div>

              <div className="lower-grid">
                <section className="panel">
                  <span className="dash-callout recent-callout">Recent intern list</span>
                  <h3>RECENT INTERNS</h3>
                  {recentInterns.map((intern) => (
                    <div className="intern-row" key={intern.name}>
                      <div className={`intern-avatar ${intern.avatarClass}`}>{intern.initials}</div>
                      <div>
                        <strong>{intern.name}</strong>
                        <p>{intern.meta}</p>
                      </div>
                      <span className={`status ${intern.status === 'Verified' ? 'verified' : 'pending'}`}>
                        {intern.status === 'Verified' ? '● Verified' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </section>

                <section className="panel">
                  <span className="dash-callout actions-callout">Quick nav actions</span>
                  <h3>QUICK ACTIONS</h3>
                  <div className="action-grid">
                    {quickActions.map((action) => (
                      <button type="button" key={action}>
                        <span></span>
                        {action}
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
