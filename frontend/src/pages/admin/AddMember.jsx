import { useState } from "react";
import api from "../../api";
import "./admin.css";

export default function AddMember() {
  const [form, setForm] = useState({
    rollNo:   "",
    name:     "",
    branch:   "",
    email:    "",
    password: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [msg,      setMsg]      = useState("");
  const [msgType,  setMsgType]  = useState("");
  const [loading,  setLoading]  = useState(false);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      await api.post("/admin/add-student", {
        rollNo:   form.rollNo.trim(),
        name:     form.name.trim(),
        branch:   form.branch.trim(),
        email:    form.email.trim(),
        password: form.password,
      });

      setMsg("Student added successfully");
      setMsgType("success");
      setForm({ rollNo:"", name:"", branch:"", email:"", password:"" });
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to add student");
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">👤 Add Library Member</div>
      </div>

      <form onSubmit={handleSubmit} className="form">

        <div className="form-row">
          <div className="form-field">
            <label className="form-label">Roll Number *</label>
            <input
              placeholder="e.g. 2024CS001"
              value={form.rollNo}
              onChange={set("rollNo")}
              required
            />
          </div>
          <div className="form-field">
            <label className="form-label">Full Name *</label>
            <input
              placeholder="e.g. Rahul Sharma"
              value={form.name}
              onChange={set("name")}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label className="form-label">Branch</label>
            <input
              placeholder="e.g. Computer Science"
              value={form.branch}
              onChange={set("branch")}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Email</label>
            <input
              type="email"
              placeholder="e.g. rahul@college.edu"
              value={form.email}
              onChange={set("email")}
            />
          </div>
        </div>

        <div className="form-field">
          <label className="form-label">Temporary Password *</label>
          <div style={{ position:"relative", maxWidth:"480px" }}>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Set a temporary password"
              value={form.password}
              onChange={set("password")}
              required
              style={{ paddingRight:"44px" }}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              style={{ position:"absolute", right:"12px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:"1rem", opacity:.5 }}
            >
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>
          <div style={{ fontSize:".68rem", color:"#8B7355", marginTop:"4px" }}>
            Student can change this after first login
          </div>
        </div>

        <div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Adding…" : "👤 Add Member"}
          </button>
        </div>
      </form>

      {msg && (
        <p className={`msg ${msgType === "success" ? "msg-success" : "msg-error"}`}>
          {msgType === "success" ? "✅" : "❌"} {msg}
        </p>
      )}
    </div>
  );
}
