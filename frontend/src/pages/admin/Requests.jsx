import { useEffect, useState } from "react";
import api from "../../api";
import "./admin.css";

export default function Requests({ onStatsChange }) {
  const [tab,      setTab]      = useState("pending");
  const [pending,  setPending]  = useState([]);
  const [approved, setApproved] = useState([]);
  const [loading,  setLoading]  = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pRes, aRes] = await Promise.all([
        api.get("/cart/admin/requests"),
        api.get("/cart/admin/approved"),
      ]);
      setPending(pRes.data);
      setApproved(aRes.data);
    } catch {
      // silently fail — data stays as-is
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const approve = async (id) => {
    try {
      await api.patch(`/cart/admin/approve/${id}`);
      await fetchAll();
      onStatsChange?.();
    } catch (err) {
      alert(err.response?.data?.message || "Approval failed");
    }
  };

  const reject = async (id) => {
    try {
      await api.patch(`/cart/admin/reject/${id}`);
      await fetchAll();
      onStatsChange?.();
    } catch {
      alert("Rejection failed");
    }
  };

  const returnBook = async (id) => {
    try {
      await api.patch(`/cart/admin/return/${id}`);
      await fetchAll();
      onStatsChange?.();
    } catch {
      alert("Return failed");
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          📄 Book Requests
          <span className="card-count">
            {tab === "pending" ? pending.length : approved.length}
          </span>
        </div>

        {/* Tab switcher */}
        <div className="tab-bar">
          <button className={`tab-btn ${tab === "pending"  ? "active" : ""}`} onClick={() => setTab("pending")}>
            Pending
          </button>
          <button className={`tab-btn ${tab === "approved" ? "active" : ""}`} onClick={() => setTab("approved")}>
            Issued
          </button>
        </div>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : (

        /* ── Pending tab ── */
        tab === "pending" ? (
          pending.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✅</div>
              <div className="empty-text">No pending requests — all caught up!</div>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="request-table">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Book</th>
                    <th>Author</th>
                    <th>Requested</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((req) => (
                    <tr key={req._id}>
                      <td>
                        <span style={{ fontFamily:"'Raleway',sans-serif", fontWeight:600, color:"#DAA520" }}>
                          {req.studentId}
                        </span>
                      </td>
                      <td style={{ fontWeight:500, color:"#F5F0E8" }}>
                        {req.bookId?.title || "—"}
                      </td>
                      <td>{req.bookId?.author || "—"}</td>
                      <td style={{ fontSize:".75rem", color:"#8B7355" }}>
                        {new Date(req.createdAt).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}
                      </td>
                      <td>
                        <button className="btn-approve" onClick={() => approve(req._id)}>✓ Approve</button>
                        <button className="btn-reject"  onClick={() => reject(req._id)}>✕ Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )

        /* ── Issued/approved tab ── */
        ) : (
          approved.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <div className="empty-text">No books currently issued</div>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="request-table">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Book</th>
                    <th>Author</th>
                    <th>Issued On</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {approved.map((req) => (
                    <tr key={req._id}>
                      <td>
                        <span style={{ fontFamily:"'Raleway',sans-serif", fontWeight:600, color:"#DAA520" }}>
                          {req.studentId}
                        </span>
                      </td>
                      <td style={{ fontWeight:500, color:"#F5F0E8" }}>
                        {req.bookId?.title || "—"}
                      </td>
                      <td>{req.bookId?.author || "—"}</td>
                      <td style={{ fontSize:".75rem", color:"#8B7355" }}>
                        {new Date(req.updatedAt).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}
                      </td>
                      <td>
                        <button className="btn-return" onClick={() => returnBook(req._id)}>
                          🔄 Return
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )
      )}
    </div>
  );
}
