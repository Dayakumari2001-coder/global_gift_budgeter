import { Link } from "react-router-dom";
import "../styles/auth.css";

function Login() {
  return (
    <div className="auth-container">

      {/* LEFT SIDE */}

      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-logo">
            GLOBAL GIFT BUDGETER
          </div>

          <h1>
            Welcome Back
          </h1>

          <p>
            Plan gifts smarter across countries,
            currencies, and wishlists with a
            beautiful modern budgeting experience.
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

          <form className="auth-form">

            <input type="email" placeholder="Enter your email"/>
            <input type="password" placeholder="Enter your password"/>

            <button type="submit">
              Login
            </button>

          </form>

          <div className="auth-footer">
            Don’t have an account?{" "}
            <Link to="/register">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;