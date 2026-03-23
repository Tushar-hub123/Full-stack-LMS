import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

export default function LoginStudent() {
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/student/dashboard";

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { rollNo, password });
      if (res.data.role !== "student") {
        setError("Not a student account");
        setLoading(false);
        return;
      }
      login(res.data);
      navigate(redirectTo, { replace: true });
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

        .stu-page {
          min-height: 100vh;
          display: flex;
          background: #080d0b;
          font-family: 'DM Sans', sans-serif;
          color: #e8ede8;
        }

        /* LEFT */
        .stu-left {
          width: 45%;
          position: relative;
          overflow: hidden;
          background: linear-gradient(155deg, #0a150f 0%, #0c1f14 60%, #0a0f0d 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px 56px;
          border-right: 1px solid rgba(52,211,153,0.1);
        }
        .stu-left-glow {
          position: absolute;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .stu-deco-text {
          position: absolute;
          font-family: 'Cormorant Garamond', serif;
          font-size: 9rem;
          font-weight: 700;
          color: rgba(52,211,153,0.04);
          bottom: -20px; right: -10px;
          line-height: 1;
          user-select: none;
          pointer-events: none;
        }
        .stu-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #34d399;
          margin-bottom: 20px;
          position: relative; z-index: 1;
        }
        .stu-tag::before {
          content: '';
          width: 24px; height: 1px;
          background: #34d399;
        }
        .stu-left-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.4rem, 3.5vw, 3.4rem);
          font-weight: 700;
          line-height: 1.1;
          color: #e8ede8;
          margin-bottom: 18px;
          position: relative; z-index: 1;
        }
        .stu-left-heading span { color: #34d399; }
        .stu-left-desc {
          font-size: 0.9rem;
          color: #7a9180;
          line-height: 1.7;
          max-width: 300px;
          margin-bottom: 40px;
          position: relative; z-index: 1;
        }
        .stu-stats {
          display: flex;
          gap: 24px;
          position: relative; z-index: 1;
        }
        .stu-stat {
          padding: 16px 20px;
          background: rgba(52,211,153,0.05);
          border: 1px solid rgba(52,211,153,0.1);
          border-radius: 14px;
          text-align: center;
        }
        .stu-stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: #34d399;
          display: block;
        }
        .stu-stat-label {
          font-size: 0.72rem;
          color: #7a9180;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        /* RIGHT */
        .stu-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 56px;
        }
        .stu-form-wrap {
          width: 100%;
          max-width: 400px;
        }
        .stu-form-icon {
          width: 56px; height: 56px;
          background: rgba(52,211,153,0.1);
          border: 1px solid rgba(52,211,153,0.2);
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.4rem;
          margin-bottom: 24px;
        }
        .stu-form-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 700;
          color: #e8ede8;
          margin-bottom: 6px;
        }
        .stu-form-sub {
          font-size: 0.85rem;
          color: #7a9180;
          margin-bottom: 36px;
        }
        .stu-field {
          margin-bottom: 20px;
        }
        .stu-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #7a9180;
          margin-bottom: 8px;
        }
        .stu-input-wrap { position: relative; }
        .stu-input {
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
        .stu-input:focus {
          border-color: #34d399;
          box-shadow: 0 0 0 3px rgba(52,211,153,0.08);
        }
        .stu-input::placeholder { color: #4a6155; }
        .stu-eye {
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
        .stu-eye:hover { opacity: 1; }
        .stu-submit {
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
          transition: all 0.25s ease;
          margin-top: 8px;
        }
        .stu-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(52,211,153,0.3);
        }
        .stu-submit:disabled { opacity: 0.7; cursor: wait; }
        .stu-error {
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
        .stu-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 28px;
          font-size: 0.82rem;
          color: #7a9180;
          cursor: pointer;
          transition: color 0.2s;
          background: none;
          border: none;
        }
        .stu-back:hover { color: #34d399; }

        @media (max-width: 900px) {
          .stu-page { flex-direction: column; }
          .stu-left { width: 100%; padding: 48px 28px; }
          .stu-right { padding: 40px 28px 60px; }
        }
      `}</style>

      <div className="stu-page">
        {/* LEFT */}
        <div className="stu-left">
          <div className="stu-left-glow" />
          <div className="stu-deco-text">SCL</div>
          <div className="stu-tag">Student Portal</div>
          <h1 className="stu-left-heading">
            Your Library,<br />Your <span>Journey</span>
          </h1>
          <p className="stu-left-desc">
            Browse thousands of books, request titles instantly, and track your reading history — all in one place.
          </p>
          <div className="stu-stats">
            <div className="stu-stat">
              <span className="stu-stat-num">50K+</span>
              <span className="stu-stat-label">Books</span>
            </div>
            <div className="stu-stat">
              <span className="stu-stat-num">12K+</span>
              <span className="stu-stat-label">Students</span>
            </div>
            <div className="stu-stat">
              <span className="stu-stat-num">24/7</span>
              <span className="stu-stat-label">Access</span>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="stu-right">
          <div className="stu-form-wrap">
            <div className="stu-form-icon">🎓</div>
            <h2 className="stu-form-title">Student Login</h2>
            <p className="stu-form-sub">Sign in with your roll number to continue</p>

            <div className="stu-field">
              <label className="stu-label">Roll Number</label>
              <div className="stu-input-wrap">
                <input
                  className="stu-input"
                  placeholder="e.g. 2023CS001"
                  onChange={(e) => setRollNo(e.target.value)}
                  onKeyDown={handleKey}
                />
              </div>
            </div>

            <div className="stu-field">
              <label className="stu-label">Password</label>
              <div className="stu-input-wrap">
                <input
                  className="stu-input"
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKey}
                  style={{ paddingRight: "48px" }}
                />
                <button className="stu-eye" onClick={() => setShowPass(!showPass)}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button className="stu-submit" onClick={submit} disabled={loading}>
              {loading ? "Signing in…" : "Sign In →"}
            </button>

            {error && (
              <div className="stu-error">
                <span>⚠️</span> {error}
              </div>
            )}

            <button className="stu-back" onClick={() => navigate("/login")}>
              ← Back to login selector
            </button>
          </div>
        </div>
      </div>
    </>
  );
}