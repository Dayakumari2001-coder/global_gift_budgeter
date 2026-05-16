import { Link } from "react-router-dom";
import Select from "react-select";
import currencyCodes from "currency-codes";
import "../styles/auth.css";

function Register() {
  // CREATE OPTIONS
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
      minHeight: "55px",
      borderRadius: "12px",
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
    placeholder: (provided) => ({ ...provided, color: "#667280", fontSize:"15px"})
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

          <form className="auth-form">
            <input type="text" placeholder="Enter full name" />
            <input type="email" placeholder="Enter email"/>
            <input type="password" placeholder="Create password" />
            <Select
              options={currencyOptions}
              placeholder="Select Home Currency"
              className="currency-select"
              styles={customSelectStyles}
              isSearchable
            />
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