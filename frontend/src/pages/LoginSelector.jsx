import { useNavigate } from "react-router-dom";

export default function LoginSelector() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .sel-page {
          min-height: 100vh;
          background: #080d0b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          color: #e8ede8;
          padding: 40px 20px;
          position: relative;
          overflow: hidden;
        }
        .sel-page::before {
          content: '';
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(52,211,153,0.05) 0%, transparent 70%);
          pointer-events: none;
        }

        .sel-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 760px;
          text-align: center;
        }

        .sel-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(52,211,153,0.08);
          border: 1px solid rgba(52,211,153,0.2);
          border-radius: 30px;
          padding: 6px 16px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #34d399;
          margin-bottom: 24px;
        }
        .sel-badge-dot {
          width: 6px; height: 6px;
          background: #34d399;
          border-radius: 50%;
          animation: sel-pulse 2s infinite;
        }
        @keyframes sel-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .sel-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.2rem, 5vw, 3.6rem);
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 14px;
          background: linear-gradient(135deg, #e8ede8 40%, #34d399 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .sel-sub {
          font-size: 0.95rem;
          color: #7a9180;
          margin-bottom: 56px;
          font-weight: 300;
        }

        .sel-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .sel-card {
          background: rgba(17,26,22,0.7);
          border: 1px solid rgba(52,211,153,0.12);
          border-radius: 24px;
          padding: 44px 36px;
          cursor: pointer;
          transition: all 0.35s ease;
          text-align: left;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
        }
        .sel-card::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.35s;
          border-radius: 24px;
        }
        .sel-card.student-card::before {
          background: radial-gradient(circle at top right, rgba(52,211,153,0.08) 0%, transparent 60%);
        }
        .sel-card.admin-card::before {
          background: radial-gradient(circle at top right, rgba(212,168,83,0.08) 0%, transparent 60%);
        }
        .sel-card:hover { transform: translateY(-8px); }
        .sel-card:hover::before { opacity: 1; }
        .sel-card.student-card:hover {
          border-color: rgba(52,211,153,0.4);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(52,211,153,0.1);
        }
        .sel-card.admin-card:hover {
          border-color: rgba(212,168,83,0.4);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,168,83,0.1);
        }

        .sel-card-icon-wrap {
          width: 60px; height: 60px;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.6rem;
          margin-bottom: 24px;
          position: relative;
          z-index: 1;
        }
        .student-card .sel-card-icon-wrap {
          background: rgba(52,211,153,0.1);
          border: 1px solid rgba(52,211,153,0.2);
        }
        .admin-card .sel-card-icon-wrap {
          background: rgba(212,168,83,0.1);
          border: 1px solid rgba(212,168,83,0.2);
        }

        .sel-card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: #e8ede8;
          margin-bottom: 8px;
          position: relative; z-index: 1;
        }
        .sel-card-desc {
          font-size: 0.85rem;
          color: #7a9180;
          line-height: 1.6;
          position: relative; z-index: 1;
          margin-bottom: 28px;
        }
        .sel-card-perks {
          display: flex;
          flex-direction: column;
          gap: 8px;
          position: relative; z-index: 1;
          margin-bottom: 32px;
        }
        .sel-perk {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          color: #7a9180;
        }
        .sel-perk-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .student-card .sel-perk-dot { background: #34d399; }
        .admin-card .sel-perk-dot { background: #d4a853; }

        .sel-card-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 22px;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          border: 1px solid transparent;
          transition: all 0.25s;
          position: relative; z-index: 1;
        }
        .student-card .sel-card-btn {
          background: rgba(52,211,153,0.1);
          border-color: rgba(52,211,153,0.3);
          color: #34d399;
        }
        .admin-card .sel-card-btn {
          background: rgba(212,168,83,0.1);
          border-color: rgba(212,168,83,0.3);
          color: #d4a853;
        }
        .sel-card:hover .sel-card-btn {
          transform: translateX(4px);
        }

        .sel-footer {
          margin-top: 40px;
          font-size: 0.78rem;
          color: #4a6155;
        }

        @media (max-width: 600px) {
          .sel-cards { grid-template-columns: 1fr; }
          .sel-card { padding: 32px 24px; }
        }
      `}</style>

      <div className="sel-page">
        <div className="sel-container">
          <div className="sel-badge">
            <span className="sel-badge-dot" />
            Library Management System
          </div>
          <h1 className="sel-title">Scholar's Central Library</h1>
          <p className="sel-sub">Choose your role to access the portal</p>

          <div className="sel-cards">
            {/* STUDENT */}
            <div className="sel-card student-card" onClick={() => navigate("/login/student")}>
              <div className="sel-card-icon-wrap">🎓</div>
              <h2 className="sel-card-title">Student Login</h2>
              <p className="sel-card-desc">Access your personal library dashboard and manage book requests.</p>
              <div className="sel-card-perks">
                {["Browse all available books", "Add books to requests", "Track approval status", "Return borrowed books"].map((p, i) => (
                  <div className="sel-perk" key={i}>
                    <span className="sel-perk-dot" />
                    {p}
                  </div>
                ))}
              </div>
              <span className="sel-card-btn">Login as Student →</span>
            </div>

            {/* ADMIN */}
            <div className="sel-card admin-card" onClick={() => navigate("/login/admin")}>
              <div className="sel-card-icon-wrap">🛡️</div>
              <h2 className="sel-card-title">Admin Login</h2>
              <p className="sel-card-desc">Full control over the library system, books, and members.</p>
              <div className="sel-card-perks">
                {["Add & remove books", "Manage student accounts", "Approve or reject requests", "View system analytics"].map((p, i) => (
                  <div className="sel-perk" key={i}>
                    <span className="sel-perk-dot" />
                    {p}
                  </div>
                ))}
              </div>
              <span className="sel-card-btn">Login as Admin →</span>
            </div>
          </div>

          <p className="sel-footer">Secured access · Scholar's Central Library © 2026</p>
        </div>
      </div>
    </>
  );
}