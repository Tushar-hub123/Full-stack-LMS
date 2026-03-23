import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import AddBook        from "./AddBook";
import AddMember      from "./AddMember";
import Requests       from "./Requests";
import ManageBooks    from "./ManageBooks";
import StudentRecords from "./StudentRecords";
import "./admin.css";

const NAV_ITEMS = [
  { key:"requests",       icon:"📄", label:"Requests"       },
  { key:"manageBooks",    icon:"📚", label:"Manage Books"   },
  { key:"addBook",        icon:"➕", label:"Add Book"       },
  { key:"addMember",      icon:"👤", label:"Add Member"     },
  { key:"studentRecords", icon:"🎓", label:"Student Records"},
];

export default function AdminDashboard() {
  const [active, setActive]   = useState("requests");
  const [stats,  setStats]    = useState(null);
  const navigate              = useNavigate();

  useEffect(() => {
    api.get("/admin/stats")
      .then((r) => setStats(r.data))
      .catch(() => {});
  }, [active]); // refresh stats when switching tabs

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const PAGE_TITLES = {
    requests:       { title:"Book Requests",    sub:"Approve or reject pending borrow requests" },
    manageBooks:    { title:"Manage Books",     sub:"Edit, update quantity or remove books"     },
    addBook:        { title:"Add New Book",     sub:"Add a new title to the library collection" },
    addMember:      { title:"Add Member",       sub:"Register a new student account"            },
    studentRecords: { title:"Student Records",  sub:"Search and view a student's borrow history"},
  };

  const current = PAGE_TITLES[active];

  return (
    <div className="admin-layout">

      {/* ══════════ SIDEBAR ══════════ */}
      <aside className="admin-sidebar">

        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">📚</div>
          <div>
            <div className="sidebar-logo-text">BIBLIOTHECA</div>
            <div className="sidebar-logo-sub">Admin Panel</div>
          </div>
        </div>

        {/* Admin info */}
        <div className="sidebar-admin-info">
          <div className="sidebar-admin-name">Library Admin</div>
          <div className="sidebar-admin-role">Administrator</div>
        </div>

        {/* Stats summary in sidebar */}
        {stats && (
          <div style={{ padding:"0 12px 8px" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
              {[
                { label:"Books",    value: stats.totalBooks       },
                { label:"Members",  value: stats.totalStudents    },
                { label:"Pending",  value: stats.pendingRequests  },
                { label:"Issued",   value: stats.activeIssued     },
              ].map((s) => (
                <div key={s.label} style={{ background:"rgba(184,134,11,.06)", border:"1px solid rgba(184,134,11,.12)", borderRadius:"6px", padding:"10px 10px 8px", textAlign:"center" }}>
                  <div style={{ fontFamily:"'Cinzel',serif", fontSize:"1.1rem", fontWeight:700, color:"#DAA520" }}>{s.value}</div>
                  <div style={{ fontSize:".6rem", letterSpacing:".1em", textTransform:"uppercase", color:"#8B7355", marginTop:"2px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="sidebar-section-label">Navigation</div>

        {/* Nav */}
        <ul className="sidebar-nav">
          {NAV_ITEMS.map(({ key, icon, label }) => (
            <li key={key}
              className={active === key ? "active" : ""}
              onClick={() => setActive(key)}>
              <span className="nav-icon">{icon}</span>
              <span className="nav-label">{label}</span>
            </li>
          ))}
        </ul>

        {/* Logout */}
        <button className="sidebar-logout" onClick={handleLogout}>
          🚪 <span>Logout</span>
        </button>
      </aside>

      {/* ══════════ MAIN ══════════ */}
      <main className="admin-main">

        {/* Top bar */}
        <div className="admin-topbar">
          <div>
            <div className="topbar-title">{current.title}</div>
            <div className="topbar-subtitle">{current.sub}</div>
          </div>
          <div className="topbar-badge">
            <span className="topbar-dot" />
            System Online
          </div>
        </div>

        {/* Content */}
        <div className="admin-content">
          {active === "requests"       && <Requests       onStatsChange={() => api.get("/admin/stats").then(r => setStats(r.data))} />}
          {active === "manageBooks"    && <ManageBooks    />}
          {active === "addBook"        && <AddBook        />}
          {active === "addMember"      && <AddMember      />}
          {active === "studentRecords" && <StudentRecords />}
        </div>
      </main>
    </div>
  );
}
