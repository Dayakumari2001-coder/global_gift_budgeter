import {useState} from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import currencyCodes from "currency-codes";
import API from "../services/api";
import "../styles/auth.css";

function Register() {
  // CREATE OPTIONS
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [homeCurrency, setHomeCurrency] = useState("");
  const currencyOptions = currencyCodes.codes().map(
    (code) => {
      const currency = currencyCodes.code(code);
      return {
        value: currency.code,
        label: `${currency.code} - ${currency.currency}`
      };
    }
  );

  // CUSTOM SELECT STYLES
  const customSelectStyles = {
    control: (provided, state) => ({...provided,
      minHeight: "52px",
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
        "/api/users/register",
        {
          name,
          email,
          password,
          home_currency: homeCurrency
        }
      );
      console.log(response.data);
      alert("Registration Successful");
    } catch (error) {
      console.log(error.response?.data);
      alert(error.response?.data?.detail|| "Registration Failed");
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
      // SAVE TOKEN
      localStorage.setItem("token", response.data.access_token);
      alert("Login Successful");
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
              onChange={(selectOption)=>setHomeCurrency(selectOption.value)}/>
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