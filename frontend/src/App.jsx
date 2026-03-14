import { Routes, Route, Navigate } from "react-router-dom";
import { useContext, useEffect } from "react";

import Home from "./pages/Home";
import PublicBooks from "./pages/PublicBooks";
import LoginSelector from "./pages/LoginSelector";
import LoginStudent from "./pages/LoginStudent";
import LoginAdmin from "./pages/LoginAdmin";

import StudentDashboard from "./pages/student/StudentDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContext } from "./context/AuthContext";

export default function App() {
  const { user } = useContext(AuthContext);

  // Wake up backend server
  useEffect(() => {
    fetch("https://lms-yce2.onrender.com/api");
  }, []);

  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Home />} />
      <Route path="/books" element={<PublicBooks />} />

      {/* LOGIN */}
      <Route path="/login" element={<LoginSelector />} />
      <Route path="/login/student" element={<LoginStudent />} />
      <Route path="/login/admin" element={<LoginAdmin />} />

      {/* STUDENT */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute user={user} role="student">
            <StudentDashboard user={user} />
          </ProtectedRoute>
        }
      />

      {/* ADMIN */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute user={user} role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}