import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function PublicBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/books")
      .then((res) => setBooks(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = books.filter(
    (b) =>
      b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.author?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=DM+Sans:wght@400&display=swap');
          .pb-loader-screen {
            min-height: 100vh; background: #080d0b;
            display: flex; align-items: center; justify-content: center;
            font-family: 'DM Sans', sans-serif; color: #7a9180;
            flex-direction: column; gap: 20px;
          }
          .pb-loader-icon { font-size: 3rem; animation: pb-bounce 1s ease infinite alternate; }
          @keyframes pb-bounce { from { transform: translateY(0); } to { transform: translateY(-12px); } }
          .pb-loader-text { font-size: 0.9rem; letter-spacing: 1px; }
        `}</style>
        <div className="pb-loader-screen">
          <div className="pb-loader-icon">📚</div>
          <span className="pb-loader-text">Loading library books…</span>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --pb-bg: #080d0b;
          --pb-surface: #111a16;
          --pb-border: rgba(52,211,153,0.12);
          --pb-emerald: #34d399;
          --pb-gold: #d4a853;
          --pb-text: #e8ede8;
          --pb-muted: #7a9180;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .pb-page {
          min-height: 100vh;
          background: var(--pb-bg);
          font-family: 'DM Sans', sans-serif;
          color: var(--pb-text);
          padding-bottom: 80px;
        }

        /* NAV */
        .pb-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 56px;
          background: rgba(8,13,11,0.8);
          border-bottom: 1px solid var(--pb-border);
          backdrop-filter: blur(12px);
          position: sticky;
          top: 0; z-index: 100;
        }
        .pb-nav-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--pb-text);
          cursor: pointer;
          text-decoration: none;
        }
        .pb-nav-logo {
          width: 36px; height: 36px;
          background: rgba(52,211,153,0.1);
          border: 1px solid rgba(52,211,153,0.2);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem;
        }
        .pb-nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .pb-nav-btn {
          padding: 8px 20px;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.83rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid var(--pb-border);
          background: transparent;
          color: var(--pb-muted);
        }
        .pb-nav-btn:hover { color: var(--pb-text); border-color: rgba(52,211,153,0.3); }
        .pb-nav-btn-primary {
          background: rgba(52,211,153,0.1);
          border-color: rgba(52,211,153,0.3);
          color: var(--pb-emerald);
        }
        .pb-nav-btn-primary:hover {
          background: rgba(52,211,153,0.2);
          box-shadow: 0 4px 16px rgba(52,211,153,0.15);
        }

        /* HERO */
        .pb-hero {
          padding: 72px 56px 56px;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #080d0b 0%, #0e1c14 100%);
          border-bottom: 1px solid var(--pb-border);
        }
        .pb-hero-glow {
          position: absolute;
          top: 50%; right: 10%;
          transform: translateY(-50%);
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .pb-hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(52,211,153,0.08);
          border: 1px solid rgba(52,211,153,0.18);
          border-radius: 30px;
          padding: 5px 14px;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--pb-emerald);
          margin-bottom: 20px;
          position: relative; z-index: 1;
        }
        .pb-hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.4rem, 5vw, 3.8rem);
          font-weight: 700;
          line-height: 1.1;
          color: var(--pb-text);
          margin-bottom: 14px;
          position: relative; z-index: 1;
        }
        .pb-hero-title em {
          font-style: normal;
          color: var(--pb-emerald);
        }
        .pb-hero-sub {
          font-size: 0.95rem;
          color: var(--pb-muted);
          font-weight: 300;
          max-width: 500px;
          line-height: 1.6;
          margin-bottom: 36px;
          position: relative; z-index: 1;
        }
        .pb-search-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(17,26,22,0.8);
          border: 1px solid var(--pb-border);
          border-radius: 14px;
          padding: 0 20px;
          max-width: 500px;
          backdrop-filter: blur(8px);
          transition: border-color 0.25s, box-shadow 0.25s;
          position: relative; z-index: 1;
        }
        .pb-search-bar:focus-within {
          border-color: var(--pb-emerald);
          box-shadow: 0 0 0 3px rgba(52,211,153,0.08);
        }
        .pb-search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--pb-text);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          padding: 15px 0;
        }
        .pb-search-input::placeholder { color: var(--pb-muted); }
        .pb-search-icon { opacity: 0.5; font-size: 1rem; }

        /* CONTENT */
        .pb-content {
          padding: 48px 56px;
        }
        .pb-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
        }
        .pb-results {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 600;
          color: var(--pb-text);
        }
        .pb-results-count {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--pb-emerald);
          background: rgba(52,211,153,0.1);
          border: 1px solid rgba(52,211,153,0.2);
          border-radius: 20px;
          padding: 3px 10px;
          margin-left: 10px;
          vertical-align: middle;
        }
        .pb-login-cta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: var(--pb-muted);
          background: var(--pb-surface);
          border: 1px solid var(--pb-border);
          border-radius: 10px;
          padding: 8px 16px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .pb-login-cta:hover {
          border-color: rgba(52,211,153,0.3);
          color: var(--pb-emerald);
        }

        /* GRID */
        .pb-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
          gap: 24px;
        }

        /* CARD */
        .pb-card {
          background: rgba(17,26,22,0.7);
          border: 1px solid var(--pb-border);
          border-radius: 18px;
          overflow: hidden;
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
          backdrop-filter: blur(8px);
        }
        .pb-card:hover {
          transform: translateY(-8px);
          border-color: rgba(52,211,153,0.35);
          box-shadow: 0 20px 50px rgba(0,0,0,0.4);
        }
        .pb-img-wrapper {
          position: relative;
          height: 220px;
          overflow: hidden;
          background: rgba(22,32,24,0.8);
        }
        .pb-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .pb-card:hover .pb-img-wrapper img { transform: scale(1.06); }
        .pb-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(8,13,11,0.75) 0%, transparent 55%);
        }
        .pb-badge {
          position: absolute;
          top: 12px; right: 12px;
          background: rgba(52,211,153,0.15);
          border: 1px solid rgba(52,211,153,0.3);
          border-radius: 20px;
          padding: 3px 10px;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: var(--pb-emerald);
        }
        .pb-info {
          padding: 16px 18px 20px;
        }
        .pb-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--pb-text);
          margin-bottom: 5px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.3;
        }
        .pb-author {
          font-size: 0.8rem;
          color: var(--pb-muted);
          margin-bottom: 14px;
        }
        .pb-card-action {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .pb-req-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--pb-emerald);
          background: rgba(52,211,153,0.08);
          border: 1px solid rgba(52,211,153,0.2);
          border-radius: 8px;
          padding: 7px 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .pb-req-btn:hover {
          background: rgba(52,211,153,0.15);
          border-color: var(--pb-emerald);
        }
        .pb-arrow {
          width: 30px; height: 30px;
          background: var(--pb-surface);
          border: 1px solid var(--pb-border);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.7rem;
          color: var(--pb-muted);
          transition: all 0.2s;
        }
        .pb-card:hover .pb-arrow {
          background: rgba(52,211,153,0.1);
          border-color: rgba(52,211,153,0.3);
          color: var(--pb-emerald);
        }

        .pb-empty-state {
          text-align: center;
          padding: 80px 20px;
          color: var(--pb-muted);
        }
        .pb-empty-icon { font-size: 3rem; margin-bottom: 16px; }
        .pb-empty-text { font-size: 0.95rem; }

        @media (max-width: 768px) {
          .pb-nav { padding: 16px 20px; }
          .pb-hero, .pb-content { padding-inline: 20px; }
          .pb-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px; }
        }
      `}</style>

      <div className="pb-page">
        {/* NAV */}
        <nav className="pb-nav">
          <div className="pb-nav-brand" onClick={() => navigate("/")}>
            <div className="pb-nav-logo">📚</div>
            Scholar's Library
          </div>
          <div className="pb-nav-actions">
            <button className="pb-nav-btn" onClick={() => navigate("/login")}>Sign In</button>
            <button className="pb-nav-btn pb-nav-btn-primary" onClick={() => navigate("/login/student")}>
              Student Portal →
            </button>
          </div>
        </nav>

        {/* HERO */}
        <div className="pb-hero">
          <div className="pb-hero-glow" />
          <div className="pb-hero-tag">📖 Public Library</div>
          <h1 className="pb-hero-title">
            Explore Our<br /><em>Library Collection</em>
          </h1>
          <p className="pb-hero-sub">
            Browse thousands of titles available for students. Sign in to request books and track your borrowing history.
          </p>
          <div className="pb-search-bar">
            <span className="pb-search-icon">🔍</span>
            <input
              className="pb-search-input"
              placeholder="Search by title, author…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* CONTENT */}
        <div className="pb-content">
          <div className="pb-toolbar">
            <div className="pb-results">
              All Books
              <span className="pb-results-count">{filtered.length} found</span>
            </div>
            <button className="pb-login-cta" onClick={() => navigate("/login/student")}>
              🎓 Login to Request Books
            </button>
          </div>

          {filtered.length > 0 ? (
            <div className="pb-grid">
              {filtered.map((book) => (
                <div
                  className="pb-card"
                  key={book._id}
                  onMouseEnter={() => setHovered(book._id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className="pb-img-wrapper">
                    <img
                      src={
                        book.image?.startsWith("http")
                          ? book.image
                          : `https://lms-final-5mk1.onrender.com/uploads/${book.image}`
                      }
                      alt={book.title}
                    />
                    <div className="pb-img-overlay" />
                    <span className="pb-badge">Available</span>
                  </div>
                  <div className="pb-info">
                    <div className="pb-title">{book.title}</div>
                    <div className="pb-author">{book.author}</div>
                    <div className="pb-card-action">
                      <button
                        className="pb-req-btn"
                        onClick={() => navigate("/login/student")}
                      >
                        Request Book
                      </button>
                      <div className="pb-arrow">→</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="pb-empty-state">
              <div className="pb-empty-icon">📭</div>
              <p className="pb-empty-text">No books found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}