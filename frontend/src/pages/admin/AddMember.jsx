import { useState } from "react";
import "./admin.css";

export default function AddMember() {
  const [form, setForm] = useState({
    rollNo: "",
    name: "",
    branch: "",
    college: "",
    password: "",
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/api/admin/add-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.message || "Failed to add member");
        return;
      }

      setMsg("✅ Member added successfully");
      setForm({ rollNo: "", name: "", branch: "", college: "", password: "" });
    } catch {
      setMsg("❌ Server error");
    }
  };

  return (
    <div className="card">
      <h3>Add Library Member</h3>

      <form onSubmit={handleSubmit} className="form">
        <input name="rollNo" placeholder="Roll Number" value={form.rollNo} onChange={handleChange} required />
        <input name="name" placeholder="Student Name" value={form.name} onChange={handleChange} required />
        <input name="branch" placeholder="Branch" value={form.branch} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Temporary Password" value={form.password} onChange={handleChange} required />
        <button type="submit">Add Member</button>
      </form>

      {msg && <p className="msg">{msg}</p>}
    </div>
  );
}