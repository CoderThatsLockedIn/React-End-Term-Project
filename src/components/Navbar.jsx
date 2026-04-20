import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ADDED: Access auth logic
import "./components.css";
export default function Navbar() {
  const { user, logout } = useAuth(); // ADDED
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">NGO Connect</div>

      <div className="nav-links">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/requests">Requests</NavLink>
      </div>

      <div className="nav-right">
        {user ? (
          <>
            <span className="nav-user">{user?.email}</span>
            <button className="nav-logout-btn" onClick={logout}>Log Out</button>
          </>
        ) : (
          <Link to="/login" className="nav-link">Login</Link>
        )}
      </div>
    </nav>
  );
}