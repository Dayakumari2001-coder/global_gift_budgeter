import {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import API from "../services/api";
import "../styles/auth.css";
import {getCurrencyDetails} from "../utils/Helpers";
import { getCurrencies } from "../api/currency";

function Register() {
  // CREATE OPTIONS
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [homeCurrency, setHomeCurrency] = useState("");
  const [currencyOptions, setCurrencyOptions] = useState([]);

  useEffect(() => {
    fetchCurrencies();
  }, []);

  async function fetchCurrencies() {
    try {
      const response = await getCurrencies();
      const formatted=response.data.map((code) =>{
      const details=getCurrencyDetails(code);
      return{
        value:details.code,
        label:`${details.flag} ${details.code} — ${details.name} (${details.symbol})`
      }
    });
      setCurrencyOptions(formatted);
    } catch (error) {
      console.error("Error fetching currencies:", error);
    }
  }

  // CUSTOM SELECT STYLES
  const customSelectStyles = {
    control: (provided, state) => ({...provided,
      minHeight: "42px",
      paddingLeft: "8px",
      borderRadius: "10px",
      borderColor: state.isFocused ? "#7406d4" : "#d1d5db",
      backgroundColor: "#f9fafb",
      boxShadow: state.isFocused
        ? "0 0 0 4px rgba(116, 6, 212, 0.12)"
        : "none",
      "&:hover": { borderColor: "#7406d4"}
    }),

    option: (provided, state) => ({...provided,
      backgroundColor: state.isSelected
        ? "#7406d4"
        : state.isFocused
        ? "#ede9fe"
        : "white",
      color: state.isSelected ? "white" : "#111827",
      cursor: "pointer"
    }),
    placeholder: (provided) => ({ ...provided, color: "#667280", fontSize:"15px", marginLeft: "2px" }),
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post(
        "/users/register",
        {
          name,
          email,
          password,
          home_currency: homeCurrency
        }
      );
      console.log(response.data);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } catch (error) {
      console.log(error.response?.data);
      setError(error.response?.data?.detail || "Registration Failed");
    }
  };
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
      console.log(response.data);
      localStorage.setItem("token", response.data.access_token);
      window.location.href = "/dashboard";
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
          <h1>
            Start Your Budget Journey
          </h1>
          <p>
            Create wishlists, track global gift expenses,
            and manage currencies with a modern budgeting system.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}

      <div className="auth-right">
        <div className="auth-form-box">
          <h2>Create Account</h2>
          <p className="auth-subtitle">
            Register your new account
          </p>

          <form className="auth-form"  onSubmit={handleRegister}>
            <input type="text" placeholder="Enter full name"
            value={name} onChange={(e) => setName(e.target.value)} />
            <input type="email" placeholder="Enter email"
            value={email} onChange={(e)=> setEmail(e.target.value)}/>
            <input type="password" placeholder="Create password"
            value={password} onChange={(e)=>setPassword(e.target.value)} />
            <Select
              options={currencyOptions}
              placeholder="Select Home Currency"
              className="currency-select"
              styles={customSelectStyles}
              isSearchable
              onChange={(selected) => setHomeCurrency(selected.value)}/>
            {error && <div className="auth-error">{error}</div>}
            {success && <div className="auth-success">{success}</div>}
            <button type="submit">Create Account</button>
          </form>
          <div className="auth-footer">
            Already have an account?{" "}
            <Link to="/login">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Register;