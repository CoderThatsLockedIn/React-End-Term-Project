import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar"
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Requests from "./pages/Requests";
import ProtectedRoute from "./components/ProtectedRoute"; // Import your guard

function App() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/login" && <Navbar />}

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        
        {/* Wrap these to ensure only logged-in users can see them */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;