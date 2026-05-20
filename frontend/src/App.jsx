import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import WishlistDetails from "./pages/WishlistDetails";

function App() {
  const token = localStorage.getItem("token");
  return (
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/Login" />} />
        <Route path="/Login" element={token ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/Register" element={token ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/Login" />} />
        <Route path="/wishlists/:id" element={token ? <WishlistDetails /> : <Navigate to="/Login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
  );
}
export default App;
