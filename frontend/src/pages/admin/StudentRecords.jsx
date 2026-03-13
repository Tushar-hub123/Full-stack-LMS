import { useState } from "react";
import api from "../../api";
import "./admin.css";

export default function StudentRecords() {
  const [rollNo, setRollNo] = useState("");
  const [records, setRecords] = useState([]);
  const [msg, setMsg] = useState("");

  const searchStudent = async () => {
    if (!rollNo) return;

    try {
      const res = await api.get(
        `/cart/admin/student/${rollNo}`
      );

      setRecords(res.data);

      if (res.data.length === 0) {
        setMsg("No records found");
      } else {
        setMsg("");
      }
    } catch (err) {
      setMsg("Student not found");
      setRecords([]);
    }
  };

  return (
    <div className="card">
      <h3>🎓 Student Record</h3>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter Roll No"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
        />

        <button onClick={searchStudent}>
          Search
        </button>
      </div>

      {records.length > 0 && (
        <table className="request-table">
          <thead>
            <tr>
              <th>Book</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {records.map((r) => (
              <tr key={r._id}>
                <td>{r.bookId?.title}</td>
                <td>
                  {r.status === "cart" && "Waiting"}
                  {r.status === "approved" && "Approved"}
                  {r.status === "rejected" && "Rejected"}
                  {r.status === "returned" && "Returned"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {msg && <p style={{ marginTop: "1rem" }}>{msg}</p>}
    </div>
  );
}
