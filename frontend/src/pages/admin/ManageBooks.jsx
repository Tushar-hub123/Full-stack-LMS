import { useEffect, useState } from "react";
import api from "../../api";
import "./admin.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function ManageBooks() {
  const [books,   setBooks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");

  useEffect(() => { fetchBooks(); }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/books");
      setBooks(res.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const removeBook = async (id) => {
    if (!window.confirm("Remove this book from the library?")) return;
    try {
      await api.delete(`/books/${id}`);
      setBooks((prev) => prev.filter((b) => b._id !== id));
    } catch {
      alert("Failed to remove book");
    }
  };

  // Debounced quantity update — only fires on blur
  const updateQuantity = async (id, newQty) => {
    if (isNaN(newQty) || newQty < 0) return;
    try {
      await api.patch(`/books/${id}/quantity`, { quantity: newQty });
      setBooks((prev) =>
        prev.map((b) => b._id === id ? { ...b, quantity: newQty } : b)
      );
    } catch {
      alert("Failed to update quantity");
    }
  };

  const handleQtyChange = (id, val) => {
    setBooks((prev) =>
      prev.map((b) => b._id === id ? { ...b, quantity: val } : b)
    );
  };

  const filtered = books.filter(
    (b) =>
      b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.author?.toLowerCase().includes(search.toLowerCase())
  );

  const getImage = (img) => {
    if (!img) return null;
    return img.startsWith("http") ? img : `${API_BASE}/uploads/${img}`;
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          📚 Manage Books
          <span className="card-count">{books.length} titles</span>
        </div>

        {/* Search */}
        <div style={{ display:"flex", gap:"10px" }}>
          <div style={{ position:"relative" }}>
            <input
              style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(184,134,11,.2)", borderRadius:"6px", padding:"8px 16px 8px 36px", color:"#F5F0E8", fontFamily:"'Raleway',sans-serif", fontSize:".82rem", outline:"none", width:"220px", transition:"border-color .2s" }}
              placeholder="Search books..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={(e) => e.target.style.borderColor="#B8860B"}
              onBlur={(e) => e.target.style.borderColor="rgba(184,134,11,.2)"}
            />
            <span style={{ position:"absolute", left:"12px", top:"50%", transform:"translateY(-50%)", color:"#8B7355", fontSize:".85rem" }}>🔍</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <div className="empty-text">No books found</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="request-table">
            <thead>
              <tr>
                <th>Cover</th>
                <th>Title</th>
                <th>Author</th>
                <th>Quantity</th>
                <th>Added</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((book) => {
                const imgSrc = getImage(book.image);
                return (
                  <tr key={book._id}>
                    <td>
                      {imgSrc ? (
                        <img src={imgSrc} alt={book.title} className="book-thumb"
                          onError={(e) => { e.target.style.display="none"; }}
                        />
                      ) : (
                        <div className="book-thumb-placeholder">📖</div>
                      )}
                    </td>
                    <td style={{ fontWeight:500, color:"#F5F0E8", maxWidth:"200px" }}>
                      {book.title}
                    </td>
                    <td style={{ color:"#C4B89A" }}>{book.author}</td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        className="qty-input"
                        value={book.quantity}
                        onChange={(e) => handleQtyChange(book._id, Number(e.target.value))}
                        onBlur={(e) => updateQuantity(book._id, Number(e.target.value))}
                      />
                    </td>
                    <td style={{ fontSize:".75rem", color:"#8B7355" }}>
                      {new Date(book.createdAt).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}
                    </td>
                    <td>
                      <button className="btn-delete" onClick={() => removeBook(book._id)}>
                        🗑 Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
