import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

/* ─── Constants ──────────────────────────────────────────────────────────── */
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

const STATUS = {
  cart:     { label: "Pending",  color: "#f59e0b", bg: "rgba(245,158,11,.12)",  border: "rgba(245,158,11,.25)"  },
  approved: { label: "Issued",   color: "#22c55e", bg: "rgba(34,197,94,.12)",   border: "rgba(34,197,94,.25)"   },
  rejected: { label: "Rejected", color: "#ef4444", bg: "rgba(239,68,68,.12)",   border: "rgba(239,68,68,.25)"   },
  returned: { label: "Returned", color: "#60a5fa", bg: "rgba(96,165,250,.12)",  border: "rgba(96,165,250,.25)"  },
};

const NAV = [
  { key: "browse",  icon: "📚", label: "Browse Books"  },
  { key: "mybooks", icon: "🔖", label: "My Books"      },
];

/* ─── Injected CSS ───────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Raleway:wght@300;400;500;600&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');

  :root {
    --sd-bg:     #0D0A08; --sd-bg2: #110E0A; --sd-bg3: #171210;
    --sd-border: rgba(184,134,11,.15); --sd-border2: rgba(184,134,11,.28);
    --sd-gold:   #B8860B; --sd-gold2: #DAA520; --sd-gold3: #FFD700;
    --sd-text:   #F5F0E8; --sd-muted: #C4B89A; --sd-dim: #8B7355;
    --sd-w:      240px;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: var(--sd-bg); }
  ::-webkit-scrollbar-thumb { background: var(--sd-gold); border-radius: 3px; }

  @keyframes sd-fadeUp  { from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);} }
  @keyframes sd-shimmer { 0%{background-position:-200% center;}100%{background-position:200% center;} }
  @keyframes sd-spin    { to{transform:rotate(360deg);} }
  @keyframes sd-pulse   { 0%,100%{opacity:1;}50%{opacity:.4;} }
  @keyframes sd-pop     { 0%{transform:scale(.92);opacity:0;}100%{transform:scale(1);opacity:1;} }

  .sd-layout  { display:flex; min-height:100vh; background:var(--sd-bg); font-family:'Raleway',sans-serif; color:var(--sd-text); }

  /* Sidebar */
  .sd-sidebar { width:var(--sd-w); min-height:100vh; background:var(--sd-bg2); border-right:1px solid var(--sd-border); display:flex; flex-direction:column; position:fixed; top:0; left:0; z-index:50; padding-bottom:24px; overflow-y:auto; }
  .sd-logo    { padding:26px 20px 22px; border-bottom:1px solid var(--sd-border); display:flex; align-items:center; gap:12px; cursor:pointer; }
  .sd-logo-icon { width:38px;height:38px;border:1.5px solid var(--sd-gold);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0; }
  .sd-logo-name { font-family:'Cinzel',serif;font-size:.95rem;font-weight:700;background:linear-gradient(90deg,#B8860B,#FFD700,#B8860B);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:sd-shimmer 4s linear infinite; }
  .sd-logo-sub  { font-size:.55rem;letter-spacing:.2em;color:var(--sd-dim);text-transform:uppercase;-webkit-text-fill-color:var(--sd-dim);margin-top:1px; }

  .sd-student-card { margin:14px 10px; padding:14px; background:rgba(184,134,11,.06); border:1px solid var(--sd-border); border-radius:8px; }
  .sd-avatar { width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#B8860B,#DAA520);display:flex;align-items:center;justify-content:center;font-family:'Cinzel',serif;font-weight:700;font-size:.95rem;color:#0D0A08;margin-bottom:10px; }
  .sd-student-name { font-size:.85rem;font-weight:600;color:var(--sd-muted); }
  .sd-student-roll { font-size:.68rem;letter-spacing:.1em;color:var(--sd-gold2);text-transform:uppercase;margin-top:2px; }

  .sd-sec-label { padding:18px 18px 6px;font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:var(--sd-dim); }
  .sd-nav { list-style:none;padding:0 8px;display:flex;flex-direction:column;gap:2px;flex:1; }
  .sd-nav li { display:flex;align-items:center;gap:11px;padding:10px 13px;border-radius:6px;cursor:pointer;font-size:.82rem;font-weight:500;color:var(--sd-dim);transition:all .2s;position:relative; }
  .sd-nav li:hover { background:rgba(184,134,11,.07);color:var(--sd-muted); }
  .sd-nav li.active { background:rgba(184,134,11,.14);color:var(--sd-gold2);border:1px solid rgba(184,134,11,.22); }
  .sd-nav li.active::before { content:'';position:absolute;left:0;top:20%;bottom:20%;width:2px;background:var(--sd-gold);border-radius:2px; }
  .sd-nav-badge { margin-left:auto;background:rgba(184,134,11,.2);color:var(--sd-gold2);font-size:.62rem;font-weight:700;padding:2px 7px;border-radius:100px;border:1px solid rgba(184,134,11,.25); }

  .sd-logout { margin:8px 8px 0;padding:10px 13px;border-radius:6px;border:1px solid rgba(239,68,68,.2);background:rgba(239,68,68,.08);color:#ef4444;font-family:'Raleway',sans-serif;font-size:.8rem;font-weight:500;cursor:pointer;display:flex;align-items:center;gap:10px;transition:all .2s;width:calc(100% - 16px); }
  .sd-logout:hover { background:rgba(239,68,68,.16);border-color:#ef4444; }

  /* Main */
  .sd-main   { margin-left:var(--sd-w);flex:1;display:flex;flex-direction:column; }
  .sd-topbar { padding:18px 28px;border-bottom:1px solid var(--sd-border);background:rgba(13,10,8,.85);backdrop-filter:blur(12px);position:sticky;top:0;z-index:40;display:flex;align-items:center;justify-content:space-between; }
  .sd-topbar-title { font-family:'Cinzel',serif;font-size:1.2rem;font-weight:600; }
  .sd-topbar-sub   { font-size:.75rem;color:var(--sd-dim);font-family:'EB Garamond',serif;font-style:italic;margin-top:2px; }
  .sd-online { display:flex;align-items:center;gap:8px;padding:5px 14px;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.2);border-radius:100px;font-size:.7rem;letter-spacing:.08em;color:#22c55e;text-transform:uppercase; }
  .sd-dot { width:6px;height:6px;background:#22c55e;border-radius:50%;animation:sd-pulse 2s infinite; }

  .sd-content { padding:28px;flex:1;animation:sd-fadeUp .4s ease forwards; }

  /* Stats row */
  .sd-stats { display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px;margin-bottom:28px; }
  .sd-stat  { background:var(--sd-bg2);border:1px solid var(--sd-border);border-radius:10px;padding:18px 20px;transition:all .25s;position:relative;overflow:hidden; }
  .sd-stat::after { content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--sd-gold),transparent);opacity:0;transition:opacity .3s; }
  .sd-stat:hover { border-color:var(--sd-border2);transform:translateY(-2px); }
  .sd-stat:hover::after { opacity:1; }
  .sd-stat-lbl { font-size:.62rem;letter-spacing:.16em;text-transform:uppercase;color:var(--sd-dim);margin-bottom:8px; }
  .sd-stat-val { font-family:'Cinzel',serif;font-size:1.8rem;font-weight:700;background:linear-gradient(90deg,#B8860B,#FFD700,#B8860B);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:sd-shimmer 4s linear infinite; }
  .sd-stat-icon { font-size:1.3rem;margin-bottom:10px; }

  /* Search + filter bar */
  .sd-toolbar { display:flex;align-items:center;gap:12px;margin-bottom:24px;flex-wrap:wrap; }
  .sd-search-wrap { position:relative;flex:1;min-width:200px;max-width:380px; }
  .sd-search-icon { position:absolute;left:13px;top:50%;transform:translateY(-50%);color:var(--sd-dim);font-size:.85rem;pointer-events:none; }
  .sd-search { width:100%;background:rgba(255,255,255,.03);border:1px solid rgba(184,134,11,.2);border-radius:7px;padding:10px 16px 10px 36px;color:var(--sd-text);font-family:'Raleway',sans-serif;font-size:.85rem;outline:none;transition:border-color .25s,box-shadow .25s; }
  .sd-search:focus { border-color:var(--sd-gold);box-shadow:0 0 0 3px rgba(184,134,11,.09); }
  .sd-search::placeholder { color:rgba(196,184,154,.35); }

  /* Book grid */
  .sd-book-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:20px; }

  .sd-book-card { background:var(--sd-bg2);border:1px solid var(--sd-border);border-radius:10px;overflow:hidden;transition:all .3s cubic-bezier(.175,.885,.32,1.275);cursor:default;animation:sd-pop .35s ease forwards; }
  .sd-book-card:hover { transform:translateY(-6px);border-color:var(--sd-border2);box-shadow:0 16px 40px rgba(0,0,0,.5),0 0 20px rgba(184,134,11,.1); }

  .sd-book-cover { height:180px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden; }
  .sd-book-cover img { width:100%;height:100%;object-fit:cover;transition:transform .4s; }
  .sd-book-card:hover .sd-book-cover img { transform:scale(1.06); }
  .sd-cover-placeholder { width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;opacity:.5; }
  .sd-book-overlay { position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(0,0,0,.6));pointer-events:none; }

  .sd-qty-badge { position:absolute;top:10px;right:10px;padding:3px 9px;border-radius:100px;font-size:.6rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase; }

  .sd-book-info { padding:14px 16px 16px; }
  .sd-book-title  { font-family:'Cinzel',serif;font-size:.88rem;font-weight:600;color:var(--sd-text);line-height:1.35;margin-bottom:4px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
  .sd-book-author { font-size:.72rem;color:var(--sd-dim);font-style:italic;font-family:'EB Garamond',serif;margin-bottom:14px; }

  .sd-req-btn { width:100%;padding:9px;background:linear-gradient(135deg,#B8860B,#DAA520);color:#0D0A08;border:none;border-radius:6px;font-family:'Raleway',sans-serif;font-size:.74rem;font-weight:700;letter-spacing:.07em;text-transform:uppercase;cursor:pointer;transition:all .25s;display:flex;align-items:center;justify-content:center;gap:7px; }
  .sd-req-btn:hover:not(:disabled) { transform:translateY(-1px);box-shadow:0 6px 18px rgba(184,134,11,.35); }
  .sd-req-btn:disabled { opacity:.55;cursor:not-allowed;transform:none; }
  .sd-req-btn.requested { background:rgba(245,158,11,.1);color:#f59e0b;border:1px solid rgba(245,158,11,.3);box-shadow:none; }
  .sd-req-btn.approved  { background:rgba(34,197,94,.1);color:#22c55e;border:1px solid rgba(34,197,94,.3);box-shadow:none; }

  /* My Books table */
  .sd-table-wrap { overflow-x:auto;border-radius:8px;border:1px solid var(--sd-border); }
  .sd-table { width:100%;border-collapse:collapse;font-size:.82rem; }
  .sd-table thead tr { background:rgba(184,134,11,.07);border-bottom:1px solid var(--sd-border); }
  .sd-table th { padding:11px 15px;text-align:left;font-size:.65rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--sd-gold2);white-space:nowrap; }
  .sd-table td { padding:12px 15px;color:var(--sd-muted);border-bottom:1px solid rgba(184,134,11,.06);vertical-align:middle; }
  .sd-table tbody tr:hover { background:rgba(184,134,11,.04); }
  .sd-table tbody tr:last-child td { border-bottom:none; }

  .sd-badge { display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:100px;font-size:.65rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;white-space:nowrap;border:1px solid; }

  .sd-cancel-btn { padding:5px 12px;background:rgba(239,68,68,.1);color:#ef4444;border:1px solid rgba(239,68,68,.25);border-radius:5px;font-size:.72rem;font-weight:600;cursor:pointer;font-family:'Raleway',sans-serif;transition:all .2s; }
  .sd-cancel-btn:hover { background:rgba(239,68,68,.2); }

  /* Spinner / empty */
  .sd-spinner { width:22px;height:22px;border:2px solid rgba(184,134,11,.2);border-top-color:var(--sd-gold);border-radius:50%;animation:sd-spin .7s linear infinite;margin:48px auto; }
  .sd-empty { text-align:center;padding:56px 20px;color:var(--sd-dim); }
  .sd-empty-icon { font-size:3rem;margin-bottom:14px; }
  .sd-empty-text { font-family:'EB Garamond',serif;font-style:italic;font-size:.95rem; }

  .sd-section-head { font-family:'Cinzel',serif;font-size:1rem;font-weight:600;color:var(--sd-text);margin-bottom:20px;display:flex;align-items:center;gap:10px; }
  .sd-count { font-family:'Raleway',sans-serif;font-size:.7rem;padding:3px 10px;background:rgba(184,134,11,.12);border:1px solid rgba(184,134,11,.2);border-radius:100px;color:var(--sd-gold2); }

  /* Toast */
  .sd-toast { position:fixed;bottom:28px;right:28px;z-index:9999;padding:12px 20px;border-radius:8px;font-family:'Raleway',sans-serif;font-size:.84rem;font-weight:500;display:flex;align-items:center;gap:10px;animation:sd-pop .3s ease forwards;box-shadow:0 8px 24px rgba(0,0,0,.4); }
  .sd-toast-success { background:#0f2a1a;border:1px solid rgba(34,197,94,.3);color:#22c55e; }
  .sd-toast-error   { background:#2a0f0f;border:1px solid rgba(239,68,68,.3);color:#ef4444; }

  @media(max-width:768px){
    .sd-sidebar { width:56px; }
    .sd-sidebar .sd-logo-name,.sd-sidebar .sd-logo-sub,.sd-sidebar .sd-student-card,
    .sd-sidebar .sd-sec-label,.sd-nav .nav-lbl,.sd-nav .sd-nav-badge,.sd-logout span { display:none; }
    .sd-nav li { justify-content:center;padding:12px; }
    .sd-main { margin-left:56px; }
    .sd-content { padding:16px; }
    .sd-book-grid { grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:14px; }
  }
`;

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function StudentDashboard({ user }) {
  const navigate = useNavigate();

  const [tab,        setTab]        = useState("browse");
  const [books,      setBooks]      = useState([]);
  const [myBooks,    setMyBooks]    = useState([]);
  const [search,     setSearch]     = useState("");
  const [loading,    setLoading]    = useState(true);
  const [myLoading,  setMyLoading]  = useState(true);
  const [toast,      setToast]      = useState(null); // { msg, type }

  const studentId = user?.rollNo;

  /* ── Inject CSS once ── */
  useEffect(() => {
    const id = "sd-styles";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id; tag.textContent = CSS;
      document.head.appendChild(tag);
    }
    return () => { const t = document.getElementById(id); if (t) t.remove(); };
  }, []);

  /* ── Toast helper ── */
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Fetch all books ── */
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/books");
      setBooks(res.data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  /* ── Fetch student's borrow history ── */
  const fetchMyBooks = useCallback(async () => {
    if (!studentId) return;
    setMyLoading(true);
    try {
      const res = await api.get(`/cart/student/${studentId}`);
      setMyBooks(res.data);
    } catch { /* silent */ }
    finally { setMyLoading(false); }
  }, [studentId]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);
  useEffect(() => { if (tab === "mybooks") fetchMyBooks(); }, [tab, fetchMyBooks]);

  /* ── Request a book ── */
  const requestBook = async (bookId) => {
    try {
      await api.post("/cart/add", { studentId, bookId });
      showToast("Book request sent!");
      fetchMyBooks();
    } catch (err) {
      showToast(err.response?.data?.message || "Request failed", "error");
    }
  };

  /* ── Cancel a pending request ── */
  const cancelRequest = async (bookId) => {
    try {
      await api.delete("/cart/remove", { data: { studentId, bookId } });
      showToast("Request cancelled");
      fetchMyBooks();
    } catch {
      showToast("Could not cancel request", "error");
    }
  };

  /* ── Helpers ── */
  const getBookStatus = (bookId) => {
    const entry = myBooks.find(
      (m) => (m.bookId?._id || m.bookId) === bookId && m.status !== "rejected" && m.status !== "returned"
    );
    return entry ? entry.status : null;
  };

  const getImage = (img) => {
    if (!img) return null;
    return img.startsWith("http") ? img : `${API_BASE}/uploads/${img}`;
  };

  const filteredBooks = books.filter(
    (b) =>
      b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.author?.toLowerCase().includes(search.toLowerCase())
  );

  /* ── My Books stats ── */
  const stats = {
    total:    myBooks.length,
    pending:  myBooks.filter((b) => b.status === "cart").length,
    issued:   myBooks.filter((b) => b.status === "approved").length,
    returned: myBooks.filter((b) => b.status === "returned").length,
  };

  /* ── Logout ── */
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  /* ─────────────────── RENDER ─────────────────────── */
  return (
    <div className="sd-layout">

      {/* ════ SIDEBAR ════ */}
      <aside className="sd-sidebar">

        {/* Logo */}
        <div className="sd-logo" onClick={() => navigate("/")}>
          <div className="sd-logo-icon">📚</div>
          <div>
            <div className="sd-logo-name">BIBLIOTHECA</div>
            <div className="sd-logo-sub">Student Portal</div>
          </div>
        </div>

        {/* Student info */}
        <div className="sd-student-card">
          <div className="sd-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "S"}
          </div>
          <div className="sd-student-name">{user?.name || "Student"}</div>
          <div className="sd-student-roll">{studentId || "—"}</div>
          {user?.branch && (
            <div style={{ fontSize:".65rem", color:"#5a4d3a", marginTop:"4px", fontStyle:"italic" }}>
              {user.branch}
            </div>
          )}
        </div>

        {/* Mini stats */}
        <div style={{ padding:"0 10px 8px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px" }}>
            {[
              { label:"Pending", value: stats.pending  },
              { label:"Issued",  value: stats.issued   },
            ].map((s) => (
              <div key={s.label} style={{ background:"rgba(184,134,11,.06)", border:"1px solid rgba(184,134,11,.12)", borderRadius:"6px", padding:"8px 6px", textAlign:"center" }}>
                <div style={{ fontFamily:"'Cinzel',serif", fontSize:"1rem", fontWeight:700, color:"#DAA520" }}>{s.value}</div>
                <div style={{ fontSize:".58rem", letterSpacing:".1em", textTransform:"uppercase", color:"#8B7355", marginTop:"1px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="sd-sec-label">Navigation</div>

        {/* Nav */}
        <ul className="sd-nav">
          {NAV.map(({ key, icon, label }) => (
            <li key={key} className={tab === key ? "active" : ""} onClick={() => setTab(key)}>
              <span style={{ fontSize:"1rem", flexShrink:0 }}>{icon}</span>
              <span className="nav-lbl">{label}</span>
              {key === "mybooks" && stats.pending > 0 && (
                <span className="sd-nav-badge">{stats.pending}</span>
              )}
            </li>
          ))}
        </ul>

        <button className="sd-logout" onClick={handleLogout}>
          🚪 <span>Logout</span>
        </button>
      </aside>

      {/* ════ MAIN ════ */}
      <main className="sd-main">

        {/* Topbar */}
        <div className="sd-topbar">
          <div>
            <div className="sd-topbar-title">
              {tab === "browse" ? "Browse Library" : "My Books"}
            </div>
            <div className="sd-topbar-sub">
              {tab === "browse"
                ? "Explore and request books from our collection"
                : "Track your requests and borrow history"}
            </div>
          </div>
          <div className="sd-online">
            <span className="sd-dot" />
            Online
          </div>
        </div>

        <div className="sd-content">

          {/* ══ BROWSE TAB ══ */}
          {tab === "browse" && (
            <>
              {/* Stats */}
              <div className="sd-stats">
                {[
                  { icon:"📚", label:"Total Books",   value: books.length          },
                  { icon:"✅", label:"Available",      value: books.filter(b => b.quantity > 0).length },
                  { icon:"🔖", label:"My Requests",    value: stats.total           },
                  { icon:"📖", label:"Currently Held", value: stats.issued          },
                ].map((s) => (
                  <div key={s.label} className="sd-stat">
                    <div className="sd-stat-icon">{s.icon}</div>
                    <div className="sd-stat-lbl">{s.label}</div>
                    <div className="sd-stat-val">{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Search */}
              <div className="sd-toolbar">
                <div className="sd-search-wrap">
                  <span className="sd-search-icon">🔍</span>
                  <input
                    className="sd-search"
                    placeholder="Search by title or author..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                {search && (
                  <span style={{ fontSize:".75rem", color:"#8B7355" }}>
                    {filteredBooks.length} result{filteredBooks.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* Book grid */}
              {loading ? (
                <div className="sd-spinner" />
              ) : filteredBooks.length === 0 ? (
                <div className="sd-empty">
                  <div className="sd-empty-icon">📭</div>
                  <div className="sd-empty-text">No books found</div>
                </div>
              ) : (
                <div className="sd-book-grid">
                  {filteredBooks.map((book, idx) => {
                    const imgSrc   = getImage(book.image);
                    const status   = getBookStatus(book._id);
                    const outOfStock = book.quantity <= 0;

                    return (
                      <div key={book._id} className="sd-book-card"
                        style={{ animationDelay:`${idx * .04}s` }}>

                        {/* Cover */}
                        <div className="sd-book-cover"
                          style={{ background: imgSrc ? "transparent" : `linear-gradient(145deg,#${Math.abs(book._id.charCodeAt(0) * 997) % 0xFFFFFF | 0x222222 | 0},{#333})` }}>
                          {imgSrc ? (
                            <img src={imgSrc} alt={book.title}
                              onError={(e) => { e.target.style.display="none"; }}
                            />
                          ) : (
                            <div className="sd-cover-placeholder">📖</div>
                          )}
                          <div className="sd-book-overlay" />

                          {/* Stock badge */}
                          <div className="sd-qty-badge" style={{
                            background: outOfStock ? "rgba(239,68,68,.2)" : "rgba(34,197,94,.2)",
                            color:      outOfStock ? "#ef4444"            : "#22c55e",
                            border:     outOfStock ? "1px solid rgba(239,68,68,.3)" : "1px solid rgba(34,197,94,.3)",
                          }}>
                            {outOfStock ? "Out of stock" : `${book.quantity} left`}
                          </div>
                        </div>

                        {/* Info */}
                        <div className="sd-book-info">
                          <div className="sd-book-title">{book.title}</div>
                          <div className="sd-book-author">{book.author}</div>

                          {/* Request button — state-aware */}
                          {status === "cart" ? (
                            <button className="sd-req-btn requested" disabled>
                              ⏳ Request Pending
                            </button>
                          ) : status === "approved" ? (
                            <button className="sd-req-btn approved" disabled>
                              ✅ Currently Issued
                            </button>
                          ) : (
                            <button
                              className="sd-req-btn"
                              disabled={outOfStock}
                              onClick={() => requestBook(book._id)}
                            >
                              {outOfStock ? "Out of Stock" : "📩 Request Book"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* ══ MY BOOKS TAB ══ */}
          {tab === "mybooks" && (
            <>
              {/* Status summary */}
              <div className="sd-stats" style={{ marginBottom:"24px" }}>
                {[
                  { icon:"📋", label:"Total",    value: stats.total,    color:"#DAA520" },
                  { icon:"⏳", label:"Pending",  value: stats.pending,  color:"#f59e0b" },
                  { icon:"📖", label:"Issued",   value: stats.issued,   color:"#22c55e" },
                  { icon:"✔️", label:"Returned", value: stats.returned, color:"#60a5fa" },
                ].map((s) => (
                  <div key={s.label} className="sd-stat">
                    <div className="sd-stat-icon">{s.icon}</div>
                    <div className="sd-stat-lbl">{s.label}</div>
                    <div className="sd-stat-val" style={{ backgroundImage:`linear-gradient(90deg,${s.color},${s.color})` }}>
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="sd-section-head">
                My Borrow History
                <span className="sd-count">{myBooks.length} records</span>
              </div>

              {myLoading ? (
                <div className="sd-spinner" />
              ) : myBooks.length === 0 ? (
                <div className="sd-empty">
                  <div className="sd-empty-icon">📚</div>
                  <div className="sd-empty-text">
                    You haven't requested any books yet.<br />
                    <span style={{ color:"#B8860B", cursor:"pointer" }} onClick={() => setTab("browse")}>
                      Browse the collection →
                    </span>
                  </div>
                </div>
              ) : (
                <div className="sd-table-wrap">
                  <table className="sd-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Book Title</th>
                        <th>Author</th>
                        <th>Status</th>
                        <th>Requested</th>
                        <th>Updated</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myBooks.map((item, i) => {
                        const s = STATUS[item.status] || STATUS.cart;
                        return (
                          <tr key={item._id}>
                            <td style={{ color:"#5a4d3a", fontSize:".75rem" }}>{i + 1}</td>
                            <td style={{ fontWeight:500, color:"#F5F0E8", maxWidth:"180px" }}>
                              {item.bookId?.title || (
                                <span style={{ color:"#5a4d3a", fontStyle:"italic" }}>Book removed</span>
                              )}
                            </td>
                            <td style={{ color:"#C4B89A" }}>{item.bookId?.author || "—"}</td>
                            <td>
                              <span className="sd-badge" style={{ color:s.color, background:s.bg, borderColor:s.border }}>
                                {s.label}
                              </span>
                            </td>
                            <td style={{ fontSize:".73rem", color:"#8B7355" }}>
                              {new Date(item.createdAt).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}
                            </td>
                            <td style={{ fontSize:".73rem", color:"#8B7355" }}>
                              {new Date(item.updatedAt).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}
                            </td>
                            <td>
                              {item.status === "cart" && (
                                <button
                                  className="sd-cancel-btn"
                                  onClick={() => cancelRequest(item.bookId?._id || item.bookId)}
                                >
                                  ✕ Cancel
                                </button>
                              )}
                              {item.status !== "cart" && (
                                <span style={{ fontSize:".72rem", color:"#5a4d3a" }}>—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* ════ TOAST ════ */}
      {toast && (
        <div className={`sd-toast ${toast.type === "error" ? "sd-toast-error" : "sd-toast-success"}`}>
          {toast.type === "error" ? "❌" : "✅"} {toast.msg}
        </div>
      )}
    </div>
  );
}
