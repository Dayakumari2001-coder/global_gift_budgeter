import { useEffect, useState } from "react";
import { useNavigate, Link} from "react-router-dom";
import Select from "react-select";
import { getCurrencies} from "../api/currency";
import { getCurrencyDetails } from "../utils/Helpers";
import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse( localStorage.getItem("user"));
  const [showProfile, setShowProfile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showCurrency, setShowCurrency] = useState(false);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [currency, setCurrency] = useState(  user?.home_currency || "");

  useEffect(()=>{fetchCurrencies()},[]);

// FETCH CURRENCIES
  async function fetchCurrencies() {
    try {
      const response =  await getCurrencies();
      const formatted =response.data.map((code) => {
          const details =getCurrencyDetails(code);
          return {
            value: details.code,
            label:
              `${details.flag}
               ${details.code}
               — ${details.name}
               (${details.symbol})`
          };
        });

      setCurrencyOptions(
        formatted
      );
    } catch (error) {
      console.error(
        "Error fetching currencies:",
        error
      );
    }
  }
  // LOGOUT
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  async function updateCurrency(
    currency
  ) {

    if (
      currency ===
      user?.home_currency
    ) {
      return;
    }

    const confirmUpdate =
      window.confirm(
        `Change primary currency to ${currency}?`
      );

    if (!confirmUpdate) {
      return;
    }

    try {
      await fetch(
        `/api/profile/currency?new_currency=${currency}`,
        {
          method: "PUT",
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      const updatedUser = {
        ...user,
        home_currency: currency
      };
      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );
      setShowCurrency(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert(
        "Currency update failed"
      );
    }
  }

   const customSelectStyles = {
    control: ( provided, state ) => ({
      ...provided,
      minHeight: "42px",
      borderRadius: "8px",
      borderColor:
      
        state.isFocused
          ? "#6d28d9"
          : "#d1d5db",

      boxShadow:
        state.isFocused
          ? "0 0 0 2px rgba(109,40,217,0.12)"
          : "none",

      "&:hover": {
        borderColor:
          "#6d28d9"
      }
    }),

    option: ( provided, state ) => ({
      ...provided,
      backgroundColor:
        state.isSelected
          ? "#6d28d9"
          : state.isFocused
          ? "#f5f3ff"
          : "white",

      color:
        state.isSelected
          ? "white"
          : "#111827"
    })
  };

  return (
    <>
      {/* NAVBAR */}
      <div className="navbar">
        {/* LEFT SIDE */}
        <div className="navbar-left">
          <button
            className="menu-btn"
            onClick={() =>
              setShowMenu(!showMenu)
            }
          >
            ☰
          </button>
          <h1 className="app-logo">
            GLOBAL GIFT BUDGETER
          </h1>
        </div>

        {/* RIGHT SIDE */}
        <div className="navbar-right">
          {/* PROFILE */}
          <div
            className="profile-wrapper"
            onClick={() =>
              setShowProfile(!showProfile)
            }
          >
            <div className="profile-circle">
              {user?.name?.charAt(0)}
            </div>
            <span className="profile-name">
              {user?.name}
            </span>
            {/* PROFILE DROPDOWN */}
            {showProfile && (
              <div className="profile-dropdown">
                <h3>
                 Name: {user?.name}
                </h3>
                <p>
                 Email: {user?.email}
                </p>
                <div className="profile-divider" />
                <p>
                  Primary Wallet Currency:
                  {" "}
                  {user?.home_currency}
                </p>
                <div className="profile-divider" />
                  <Link
                  to="/profile"
                  className="profile-link"
                  >
                  Manage Profile
                  </Link>
              </div>
            )}
          </div>

          {/* CURRENCY */}
          <div className="currency-badge"
            onClick={() =>setShowCurrency(!showCurrency)}>
            {user?.home_currency }
            <span className="currency-dropdown-arrow">▼</span>
          </div>

          {/* LOGOUT */}
          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
          {/* CURRENCY DROPDOWN */}
          {showCurrency && (
          <div className="currency-modal-overlay">
              <div className="currency-modal">
                <h2> Select Primary Currency</h2>
                <Select
                  options={currencyOptions}
                  styles={customSelectStyles}
                  isSearchable
                  value={
                    currencyOptions.find(
                      (item) =>
                        item.value ===
                        currency
                    )
                  }
                  onChange={(selected) =>{
                    setCurrency(
                      selected.value
                    );
                    updateCurrency(
                      selected.value
                    );
                  }}
                />
                <button
                  className="close-currency-btn"
                  onClick={() =>setShowCurrency(false) }
                >
                  Cancel
                </button>
              </div>
          </div>
          )}
        </div>
      </div>
      {/* MENU POPUP */}
      {showMenu && (
        <div className="sidebar-menu-popup">
          <button
            className="close-menu-btn"
            onClick={() => setShowMenu(false)}
          >
            ×
          </button>
        <Link
            to="/dashboard"
            className="menu-link"
          >
            Dashboard
          </Link>
          <Link
            to="/profile"
            className="menu-link"
          >
            Profile
          </Link>
          <button
            className="menu-link logout-menu-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </>
  );
}
export default Navbar;
