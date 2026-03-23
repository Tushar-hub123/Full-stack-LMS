import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

export default function LoginAdmin() {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async () => {
    setError("");
    if (!adminId || !password) {
      setError("Please enter Admin ID and Password");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { adminId, password });
      if (res.data.role !== "admin") {
        setError("Not an admin account");
        setLoading(false);
        return;
      }
      login(res.data);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  const handleKey = (e) => e.key === "Enter" && submit();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .admin-page {
          min-height: 100vh;
          display: flex;
          background: #080d0b;
          font-family: 'DM Sans', sans-serif;
          color: #e8ede8;
        }

        /* LEFT PANEL */
        .admin-panel-left {
          width: 45%;
          background: linear-gradient(160deg, #0a0f0d 0%, #0e1c14 50%, #0c1a12 100%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 60px 56px;
          border-right: 1px solid rgba(52,211,153,0.1);
          position: relative;
          overflow: hidden;
        }
        .admin-panel-left::before {
          content: '';
          position: absolute;
          bottom: -120px; left: -80px;
          width: 480px; height: 480px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 70%);
        }
        .admin-panel-left::after {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 240px; height: 240px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(212,168,83,0.05) 0%, transparent 70%);
        }
        .admin-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
          z-index: 1;
        }
        .admin-brand-icon {
          width: 44px; height: 44px;
          background: rgba(52,211,153,0.12);
          border: 1px solid rgba(52,211,153,0.25);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.2rem;
        }
        .admin-brand-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #e8ede8;
          letter-spacing: 0.5px;
        }
        .admin-left-content { position: relative; z-index: 1; }
        .admin-left-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #34d399;
          margin-bottom: 20px;
        }
        .admin-left-tag::before {
          content: '';
          width: 24px; height: 1px;
          background: #34d399;
        }
        .admin-left-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.4rem, 3.5vw, 3.2rem);
          font-weight: 700;
          line-height: 1.15;
          color: #e8ede8;
          margin-bottom: 20px;
        }
        .admin-left-heading em {
          font-style: normal;
          color: #34d399;
        }
        .admin-left-desc {
          font-size: 0.9rem;
          color: #7a9180;
          line-height: 1.7;
          max-width: 320px;
        }
        .admin-features {
          display: flex;
          flex-direction: column;
          gap: 14px;
          position: relative;
          z-index: 1;
        }
        .admin-feat {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(52,211,153,0.05);
          border: 1px solid rgba(52,211,153,0.08);
          border-radius: 12px;
          font-size: 0.85rem;
          color: #7a9180;
        }
        .admin-feat-icon {
          font-size: 1rem;
          width: 28px; text-align: center;
        }

        /* RIGHT PANEL */
        .admin-panel-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 56px;
          background: #080d0b;
        }
        .admin-form-wrap {
          width: 100%;
          max-width: 420px;
        }
        .admin-form-header {
          margin-bottom: 40px;
        }
        .admin-form-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 700;
          color: #e8ede8;
          margin-bottom: 6px;
        }
        .admin-form-sub {
          font-size: 0.85rem;
          color: #7a9180;
        }
        .admin-field {
          margin-bottom: 20px;
        }
        .admin-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #7a9180;
          margin-bottom: 8px;
        }
        .admin-input-wrap {
          position: relative;
        }
        .admin-input {
          width: 100%;
          background: rgba(17,26,22,0.8);
          border: 1px solid rgba(52,211,153,0.15);
          border-radius: 12px;
          padding: 14px 18px;
          color: #e8ede8;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        .admin-input:focus {
          border-color: #34d399;
          box-shadow: 0 0 0 3px rgba(52,211,153,0.08);
        }
        .admin-input::placeholder { color: #4a6155; }
        .admin-eye-btn {
          position: absolute;
          right: 14px; top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          opacity: 0.5;
          transition: opacity 0.2s;
        }
        .admin-eye-btn:hover { opacity: 1; }
        .admin-submit {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #34d399, #059669);
          border: none;
          border-radius: 12px;
          color: #080d0b;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.3px;
          transition: all 0.25s ease;
          margin-top: 8px;
          position: relative;
          overflow: hidden;
        }
        .admin-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(52,211,153,0.3);
        }
        .admin-submit:disabled { opacity: 0.7; cursor: wait; }
        .admin-error {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 10px;
          padding: 12px 16px;
          color: #ef4444;
          font-size: 0.85rem;
          margin-top: 16px;
        }
        .admin-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 28px;
          font-size: 0.82rem;
          color: #7a9180;
          cursor: pointer;
          text-decoration: none;
          transition: color 0.2s;
        }
        .admin-back:hover { color: #34d399; }

        @media (max-width: 900px) {
          .admin-page { flex-direction: column; }
          .admin-panel-left { width: 100%; padding: 40px 28px; }
          .admin-features { flex-direction: row; flex-wrap: wrap; }
          .admin-panel-right { padding: 40px 28px 60px; }
        }
      `}</style>

      <div className="admin-page">
        {/* LEFT */}
        <div className="admin-panel-left">
          <div className="admin-brand">
            <div className="admin-brand-icon">📚</div>
            <span className="admin-brand-name">Scholar's Central Library</span>
          </div>

          <div className="admin-left-content">
            <div className="admin-left-tag">Admin Portal</div>
            <h1 className="admin-left-heading">
              Control<br />the <em>Library</em><br />Universe
            </h1>
            <p className="admin-left-desc">
              Full command over books, members, and requests. Manage everything from one powerful dashboard.
            </p>
          </div>

          <div className="admin-features">
            {[
              { icon: "📖", text: "Add & manage book inventory" },
              { icon: "👥", text: "Oversee student accounts" },
              { icon: "✅", text: "Approve or reject book requests" },
            ].map((f, i) => (
              <div className="admin-feat" key={i}>
                <span className="admin-feat-icon">{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="admin-panel-right">
          <div className="admin-form-wrap">
            <div className="admin-form-header">
              <h2 className="admin-form-title">Admin Login</h2>
              <p className="admin-form-sub">Sign in to access the control panel</p>
            </div>

            <div className="admin-field">
              <label className="admin-label">Admin ID</label>
              <div className="admin-input-wrap">
                <input
                  className="admin-input"
                  placeholder="Enter your admin ID"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  onKeyDown={handleKey}
                />
              </div>
            </div>

            <div className="admin-field">
              <label className="admin-label">Password</label>
              <div className="admin-input-wrap">
                <input
                  className="admin-input"
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKey}
                  style={{ paddingRight: "48px" }}
                />
                <button className="admin-eye-btn" onClick={() => setShowPass(!showPass)}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button className="admin-submit" onClick={submit} disabled={loading}>
              {loading ? "Signing in…" : "Sign In as Admin →"}
            </button>

            {error && (
              <div className="admin-error">
                <span>⚠️</span> {error}
              </div>
            )}

            <span className="admin-back" onClick={() => navigate("/login")}>
              ← Back to login selector
            </span>
          </div>
        </div>
      </div>
    </>
  );
}