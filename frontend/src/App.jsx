import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import WishlistDetails from "./pages/WishlistDetails";
import Profile from "./pages/Profile";

function App() {
  const token = localStorage.getItem("token");
  return (
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Home />} />
        <Route path="/Login" element={token ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/Register" element={token ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/Login" />} />
        <Route path="/wishlists/:id" element={token ? <WishlistDetails /> : <Navigate to="/Login" />} />
        <Route path="/profile" element={token ? <Profile /> : <Navigate to="/Login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
  );
}
export default App;
