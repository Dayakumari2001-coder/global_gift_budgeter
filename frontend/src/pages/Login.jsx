import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/auth.css";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post(
        "/users/login",
        {
          email,
          password
        }
      );
      localStorage.setItem("token", response.data.access_token)
      alert("Login Successful");
      navigate("/dashboard");
    } catch (error) {
      console.log(error.response?.data);
      alert(error.response?.data?.detail|| "Login Failed");
    }
  };
  return (
    <div className="auth-container">
      {/* LEFT SIDE */}
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-logo">
            GLOBAL GIFT BUDGETER
          </div>
          <h1>Welcome Back</h1>
          <p>
            Manage your global gift budgets,
            currencies, and wishlists easily.
          </p>
        </div>
      </div>
      {/* RIGHT SIDE */}
      <div className="auth-right">
        <div className="auth-form-box">
          <h2>Login</h2>
          <p className="auth-subtitle">
            Access your account
          </p>
          <form className="auth-form" onSubmit={handleLogin}>
            <input type="email" placeholder="Enter your email"
              value={email} onChange={(e) =>setEmail(e.target.value)} />
            <input type="password" placeholder="Enter your password"
              value={password} onChange={(e) =>setPassword(e.target.value)}/>
            <button type="submit"> Login </button>
          </form>
          <div className="auth-footer">
            Don’t have an account?{" "}
            <Link to="/register"> Register </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;