import { useState,useEffect} from "react";
import Select from "react-select";
import { useNavigate }
from "react-router-dom";
import API from "../services/api";
import { getCurrencies} from "../api/currency";
import {getCurrencyDetails} from "../utils/Helpers";
import "../styles/profile.css";
import BackButton from "../components/BackButton";

function Profile() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [showConfirm, setShowConfirm] = useState(false);

  // STATES
  const [name, setName] =useState("");
  const [email, setEmail] = useState("");
  const [currency, setCurrency] = useState("");
  const [loading, setLoading] = useState(false);
  const [currencyOptions, setCurrencyOptions ] = useState([]);

  // LOAD USER
  useEffect(() => {
    if (storedUser) {
      setName( storedUser.name );
      setEmail( storedUser.email );
      setCurrency( storedUser.home_currency );
    }
    fetchCurrencies();
  }, []);

  // FETCH CURRENCIES
  async function fetchCurrencies() {
    try {
      const response =  await getCurrencies();
      const formatted =
        response.data.map((code) => {
          const details =
            getCurrencyDetails(code);
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
  // UPDATE PROFILE
  async function handleUpdate( e ) {
    e.preventDefault();
    try {
      setLoading(true);
      await API.put( `/profile/currency?new_currency=${currency}` );
      const updatedUser = {
        ...storedUser,
        name,
        email,
        home_currency: currency
      };
      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );
      alert(
        "Profile updated successfully"
      );

      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert(
        "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  }

  const customSelectStyles = {
    control: ( provided, state ) => ({
      ...provided,
      minHeight: "42px",
      borderRadius: "6px",
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
    <div className="profile-page">
        <BackButton/>
      <div className="profile-card">
        <h1> Manage Profile</h1>
        <form
          className="profile-form"
          onSubmit={(e) => {
            e.preventDefault();
            setShowConfirm(true);
            }}
        >
          {/* NAME */}
          <label>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
          />
          {/* EMAIL */}
          <label> Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
          />
          {/* CURRENCY */}
          <label>
            Primary Wallet Currency
          </label>
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
            onChange={(selected) =>
              setCurrency(
                selected.value
              )
            }
          />
          {/* BUTTON */}
          <button
            type="submit"
            className="profile-update-btn"
            disabled={loading}
          >
            {loading
              ? "Updating..."
              : "Update Profile"}
          </button>
        </form>
        {showConfirm && (
            <div className="confirm-overlay">
                <div className="confirm-modal">
                    <h2> Confirm Profile Update</h2>
                    <p>
                        Are you sure you want
                        to update your profile
                        details?
                    </p>
                    <div className="confirm-actions">
                        <button
                        type="button"
                        className="cancel-btn"
                        onClick={() =>
                            setShowConfirm(false)
                        }
                        >
                        Cancel
                        </button>
                        <button
                        type="button"
                        className="confirm-btn"
                        onClick={handleUpdate}
                        >
                        Confirm Update
                        </button>
                    </div>
                </div>
            </div>
            )}
      </div>
    </div>
  );
}
export default Profile;
