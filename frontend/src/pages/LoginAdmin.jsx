import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import "./styles/loginForm.css";

export default function LoginAdmin() {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
const submit = async () => {
  console.log("LOGIN BUTTON CLICKED");

  setError("");

  if (!adminId || !password) {
    setError("Please enter Admin ID and Password");
    return;
  }

  console.log("BEFORE REQUEST");

  try {

    const res = await api.post("/auth/login", {
      adminId,
      password,
    });

    console.log("AFTER REQUEST", res);

  } catch (err) {
    console.log("REQUEST ERROR", err);
  }
};
  // const submit = async () => {
  //   setError("");

  //   if (!adminId || !password) {
  //     setError("Please enter Admin ID and Password");
  //     return;
  //   }

  //   try {
  //     const res = await api.post("/auth/login", {
  //       adminId,
  //       password,
  //     });

  //     if (res.data.role !== "admin") {
  //       setError("Not an admin account");
  //       return;
  //     }

  //     login(res.data);
  //     navigate("/admin/dashboard");

  //   } catch (err) {
  //     setError(err.response?.data?.message || "Login failed");
  //   }
  // };

  return (
    <div className="login-page admin-theme">
      
      {/* HERO */}
      <section className="login-hero">
        <h1>Admin Control Panel</h1>
        <p>Manage books, members, and approvals</p>
      </section>

      {/* FORM */}
      <section className="login-section">
        <div className="login-form-card admin">
          <h2>Admin Login</h2>

          <input
            placeholder="Admin ID"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={submit}>Login</button>

          {error && (
            <p style={{ color: "red", marginTop: "10px" }}>
              {error}
            </p>
          )}
        </div>
      </section>

      {/* INFO */}
      <section className="login-info">
        <h3>Admin Responsibilities</h3>
        <p>
          Add books, manage students, and approve
          or reject book requests efficiently.
        </p>
      </section>

    </div>
  );
}