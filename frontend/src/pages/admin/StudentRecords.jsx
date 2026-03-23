import { useState } from "react";
import api from "../../api";
import "./admin.css";

const STATUS_MAP = {
  cart:     { label:"Pending",  cls:"badge-pending"  },
  approved: { label:"Issued",   cls:"badge-approved" },
  rejected: { label:"Rejected", cls:"badge-rejected" },
  returned: { label:"Returned", cls:"badge-returned" },
};

export default function StudentRecords() {
  const [rollNo,  setRollNo]  = useState("");
  const [records, setRecords] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg,     setMsg]     = useState("");

  const searchStudent = async () => {
    if (!rollNo.trim()) return;
    setLoading(true);
    setMsg("");
    setRecords([]);

    try {
      const res = await api.get(`/cart/admin/student/${rollNo.trim()}`);
      setRecords(res.data);
      setSearched(true);
      if (res.data.length === 0) setMsg("No borrow records found for this student.");
    } catch {
      setMsg("Student not found or server error.");
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => e.key === "Enter" && searchStudent();

  // Summary counts
  const counts = records.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">🎓 Student Records</div>
      </div>

      {/* Search */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Enter Roll Number (e.g. 2024CS001)"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
          onKeyDown={handleKey}
        />
        <button className="btn-primary" onClick={searchStudent} disabled={loading}>
          {loading ? "…" : "🔍 Search"}
        </button>
      </div>

      {/* Summary pills */}
      {records.length > 0 && (
        <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"20px" }}>
          <span style={{ fontSize:".72rem", color:"#8B7355", display:"flex", alignItems:"center" }}>
            Roll: <strong style={{ color:"#DAA520", marginLeft:"6px" }}>{rollNo}</strong>
          </span>
          <span style={{ color:"rgba(184,134,11,.3)" }}>|</span>
          {Object.entries(counts).map(([status, count]) => {
            const s = STATUS_MAP[status] || { label: status, cls:"badge-pending" };
            return (
              <span key={status} className={`badge ${s.cls}`}>
                {s.label}: {count}
              </span>
            );
          })}
          <span style={{ color:"rgba(184,134,11,.3)" }}>|</span>
          <span style={{ fontSize:".72rem", color:"#8B7355" }}>Total: {records.length} records</span>
        </div>
      )}

      {/* Results table */}
      {loading ? (
        <div className="spinner" />
      ) : records.length > 0 ? (
        <div className="table-wrap">
          <table className="request-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Book Title</th>
                <th>Author</th>
                <th>Status</th>
                <th>Requested</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => {
                const s = STATUS_MAP[r.status] || { label: r.status, cls:"badge-pending" };
                return (
                  <tr key={r._id}>
                    <td style={{ color:"#8B7355", fontSize:".78rem" }}>{i + 1}</td>
                    <td style={{ fontWeight:500, color:"#F5F0E8" }}>
                      {r.bookId?.title || <span style={{ color:"#8B7355" }}>Book removed</span>}
                    </td>
                    <td style={{ color:"#C4B89A" }}>{r.bookId?.author || "—"}</td>
                    <td>
                      <span className={`badge ${s.cls}`}>{s.label}</span>
                    </td>
                    <td style={{ fontSize:".75rem", color:"#8B7355" }}>
                      {new Date(r.createdAt).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}
                    </td>
                    <td style={{ fontSize:".75rem", color:"#8B7355" }}>
                      {new Date(r.updatedAt).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : searched && (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <div className="empty-text">{msg || "No records found"}</div>
        </div>
      )}

      {!searched && (
        <div className="empty-state">
          <div className="empty-icon">🎓</div>
          <div className="empty-text">Enter a roll number above to view borrow history</div>
        </div>
      )}
    </div>
  );
}
