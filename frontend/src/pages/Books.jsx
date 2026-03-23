import React, { useEffect, useState, useRef } from "react";
import api from "../api";

const Books = ({ studentId, studentName }) => {
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState([]);
  const cartRef = useRef(null);
  const [showCart, setShowCart] = useState(false);
  const [search, setSearch] = useState("");
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    api.get("/books").then((res) => setBooks(res.data));
  }, []);

  useEffect(() => {
    if (!studentId) return;
    api.get(`/cart/student/${studentId}`).then((res) => setCart(res.data));
  }, [studentId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setShowCart(true),
      { threshold: 0.2 }
    );
    if (cartRef.current) observer.observe(cartRef.current);
    return () => observer.disconnect();
  }, []);

  const handleAddToCart = async (book) => {
    const alreadyRequested = cart.some(
      (item) =>
        item.bookId?._id === book._id &&
        (item.status === "cart" || item.status === "approved")
    );
    if (alreadyRequested) return;
    setAddingId(book._id);
    await api.post("/cart/add", { studentId, bookId: book._id });
    const res = await api.get(`/cart/student/${studentId}`);
    setCart(res.data);
    setAddingId(null);
  };

  const handleRemoveFromCart = async (item) => {
    await api.delete("/cart/remove", {
      data: { studentId, bookId: item.bookId?._id },
    });
    const res = await api.get(`/cart/student/${studentId}`);
    setCart(res.data);
  };

  const handleReturnBook = async (item) => {
    await api.patch(`/cart/return/${item._id}`);
    const res = await api.get(`/cart/student/${studentId}`);
    setCart(res.data);
  };

  const filtered = books.filter(
    (b) =>
      b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.author?.toLowerCase().includes(search.toLowerCase())
  );

  const statusConfig = {
    cart: { label: "Waiting", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
    approved: { label: "Approved", color: "#10b981", bg: "rgba(16,185,129,0.12)" },
    rejected: { label: "Rejected", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
    returned: { label: "Returned", color: "#6b7280", bg: "rgba(107,114,128,0.12)" },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --bg: #0a0f0d;
          --surface: #111a16;
          --surface2: #162018;
          --border: rgba(52, 211, 153, 0.12);
          --emerald: #34d399;
          --gold: #d4a853;
          --text: #e8ede8;
          --muted: #7a9180;
          --card-bg: rgba(17, 26, 22, 0.85);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .bk-page {
          min-height: 100vh;
          background: var(--bg);
          font-family: 'DM Sans', sans-serif;
          color: var(--text);
          padding-bottom: 80px;
        }

        /* ── HERO ── */
        .bk-hero {
          position: relative;
          padding: 72px 48px 56px;
          overflow: hidden;
          background: linear-gradient(135deg, #0a0f0d 0%, #0e1c14 60%, #111a16 100%);
          border-bottom: 1px solid var(--border);
        }
        .bk-hero::before {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 360px; height: 360px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%);
        }
        .bk-hero-greeting {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 700;
          color: var(--text);
          letter-spacing: -0.5px;
          margin-bottom: 10px;
        }
        .bk-hero-greeting span {
          color: var(--emerald);
        }
        .bk-hero-sub {
          color: var(--muted);
          font-size: 1rem;
          font-weight: 300;
          letter-spacing: 0.3px;
        }

        /* ── SEARCH ── */
        .bk-search-wrap {
          padding: 36px 48px 0;
          max-width: 520px;
        }
        .bk-search-inner {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 0 18px;
          transition: border-color 0.25s;
        }
        .bk-search-inner:focus-within {
          border-color: var(--emerald);
          box-shadow: 0 0 0 3px rgba(52,211,153,0.08);
        }
        .bk-search-icon { font-size: 1rem; opacity: 0.5; }
        .bk-search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          padding: 14px 0;
        }
        .bk-search-input::placeholder { color: var(--muted); }

        /* ── SECTION TITLE ── */
        .bk-section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.75rem;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 28px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .bk-section-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
          margin-left: 16px;
        }
        .bk-count {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--emerald);
          background: rgba(52,211,153,0.1);
          border: 1px solid rgba(52,211,153,0.2);
          border-radius: 20px;
          padding: 2px 10px;
          letter-spacing: 0.5px;
        }

        /* ── BOOKS SECTION ── */
        .bk-books-section {
          padding: 48px 48px 0;
        }
        .bk-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 24px;
        }

        /* ── BOOK CARD ── */
        .bk-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
          backdrop-filter: blur(8px);
          display: flex;
          flex-direction: column;
        }
        .bk-card:hover {
          transform: translateY(-6px);
          border-color: rgba(52,211,153,0.3);
          box-shadow: 0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(52,211,153,0.08);
        }
        .bk-img-wrap {
          position: relative;
          height: 200px;
          overflow: hidden;
          background: var(--surface2);
        }
        .bk-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .bk-card:hover .bk-img-wrap img {
          transform: scale(1.06);
        }
        .bk-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(10,15,13,0.7) 0%, transparent 60%);
        }
        .bk-card-body {
          padding: 16px 18px 18px;
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 6px;
        }
        .bk-card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text);
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .bk-card-author {
          font-size: 0.8rem;
          color: var(--muted);
          font-weight: 400;
        }
        .bk-add-btn {
          margin-top: auto;
          padding-top: 14px;
          width: 100%;
          padding-block: 10px;
          border-radius: 10px;
          border: 1px solid rgba(52,211,153,0.35);
          background: rgba(52,211,153,0.08);
          color: var(--emerald);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s ease;
          letter-spacing: 0.3px;
        }
        .bk-add-btn:hover:not(.bk-added-btn) {
          background: rgba(52,211,153,0.18);
          border-color: var(--emerald);
          box-shadow: 0 4px 16px rgba(52,211,153,0.15);
        }
        .bk-added-btn {
          background: rgba(212,168,83,0.1);
          border-color: rgba(212,168,83,0.35);
          color: var(--gold);
          cursor: not-allowed;
        }
        .bk-loading-btn {
          opacity: 0.6;
          cursor: wait;
        }

        /* ── CART SECTION ── */
        .bk-cart-section {
          margin: 56px 48px 0;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .bk-cart-section.show {
          opacity: 1;
          transform: translateY(0);
        }
        .bk-cart-box {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
        }
        .bk-cart-header {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1fr 1fr;
          padding: 14px 24px;
          background: rgba(52,211,153,0.05);
          border-bottom: 1px solid var(--border);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          color: var(--muted);
        }
        .bk-cart-row {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1fr 1fr;
          padding: 16px 24px;
          border-bottom: 1px solid var(--border);
          align-items: center;
          transition: background 0.2s;
        }
        .bk-cart-row:last-child { border-bottom: none; }
        .bk-cart-row:hover { background: rgba(52,211,153,0.03); }
        .bk-col-book {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text);
        }
        .bk-col-author {
          font-size: 0.85rem;
          color: var(--muted);
        }
        .bk-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
          letter-spacing: 0.3px;
        }
        .bk-status-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: currentColor;
        }
        .bk-actions { display: flex; gap: 8px; align-items: center; }
        .bk-remove-btn {
          width: 32px; height: 32px;
          border-radius: 8px;
          border: 1px solid rgba(239,68,68,0.3);
          background: rgba(239,68,68,0.08);
          color: #ef4444;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex; align-items: center; justify-content: center;
        }
        .bk-remove-btn:hover { background: rgba(239,68,68,0.18); }
        .bk-return-btn {
          padding: 6px 14px;
          border-radius: 8px;
          border: 1px solid rgba(52,211,153,0.35);
          background: rgba(52,211,153,0.08);
          color: var(--emerald);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .bk-return-btn:hover { background: rgba(52,211,153,0.18); }
        .bk-final-status {
          font-size: 0.78rem;
          color: var(--muted);
          font-style: italic;
        }
        .bk-empty {
          text-align: center;
          padding: 48px;
          color: var(--muted);
          font-size: 0.95rem;
        }

        @media (max-width: 768px) {
          .bk-hero, .bk-search-wrap, .bk-books-section, .bk-cart-section {
            padding-inline: 20px;
          }
          .bk-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px; }
          .bk-cart-header, .bk-cart-row {
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }
        }
      `}</style>

      <div className="bk-page">
        {/* HERO */}
        <section className="bk-hero">
          <h1 className="bk-hero-greeting">
            Welcome back, <span>{studentName}</span> 👋
          </h1>
          <p className="bk-hero-sub">Explore books and manage your library requests</p>
        </section>

        {/* SEARCH */}
        <div className="bk-search-wrap">
          <div className="bk-search-inner">
            <span className="bk-search-icon">🔍</span>
            <input
              className="bk-search-input"
              placeholder="Search by title or author…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* BOOKS */}
        <section className="bk-books-section">
          <h2 className="bk-section-title">
            Available Books
            <span className="bk-count">{filtered.length} titles</span>
          </h2>

          <div className="bk-grid">
            {filtered.map((book) => {
              const isAdded = cart.some(
                (item) =>
                  item.bookId?._id === book._id &&
                  (item.status === "cart" || item.status === "approved")
              );
              const isLoading = addingId === book._id;

              return (
                <div className="bk-card" key={book._id}>
                  <div className="bk-img-wrap">
                    <img
                      src={
                        book.image?.startsWith("http")
                          ? book.image
                          : `http://localhost:4000/uploads/${book.image}`
                      }
                      alt={book.title}
                    />
                    <div className="bk-img-overlay" />
                  </div>
                  <div className="bk-card-body">
                    <div className="bk-card-title">{book.title}</div>
                    <div className="bk-card-author">{book.author}</div>
                    <button
                      className={`bk-add-btn ${isAdded ? "bk-added-btn" : ""} ${isLoading ? "bk-loading-btn" : ""}`}
                      onClick={() => handleAddToCart(book)}
                    >
                      {isLoading ? "Adding…" : isAdded ? "✓ Book Added" : "+ Add to Requests"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CART */}
        <section
          ref={cartRef}
          className={`bk-cart-section ${showCart ? "show" : ""}`}
        >
          <h2 className="bk-section-title">
            Your Requests
            <span className="bk-count">{cart.length} items</span>
          </h2>

          {cart.length === 0 ? (
            <div className="bk-cart-box">
              <p className="bk-empty">📭 No books requested yet — start exploring above!</p>
            </div>
          ) : (
            <div className="bk-cart-box">
              <div className="bk-cart-header">
                <span>Book Name</span>
                <span>Author</span>
                <span>Status</span>
                <span>Actions</span>
              </div>

              {cart.filter((item) => item.bookId).map((item) => {
                const s = statusConfig[item.status] || {};
                return (
                  <div className="bk-cart-row" key={item._id}>
                    <span className="bk-col-book">{item.bookId?.title}</span>
                    <span className="bk-col-author">{item.bookId?.author}</span>
                    <span>
                      <span
                        className="bk-status-badge"
                        style={{ color: s.color, background: s.bg }}
                      >
                        <span className="bk-status-dot" style={{ background: s.color }} />
                        {s.label}
                      </span>
                    </span>
                    <span className="bk-actions">
                      {item.status === "cart" && (
                        <button className="bk-remove-btn" onClick={() => handleRemoveFromCart(item)}>✕</button>
                      )}
                      {item.status === "approved" && (
                        <button className="bk-return-btn" onClick={() => handleReturnBook(item)}>Return</button>
                      )}
                      {(item.status === "rejected" || item.status === "returned") && (
                        <span className="bk-final-status">— finalized</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default Books;