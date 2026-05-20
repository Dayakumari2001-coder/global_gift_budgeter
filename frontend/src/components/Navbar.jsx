import { useState } from "react";

import { useNavigate } from "react-router-dom";

import "../styles/navbar.css";

function Navbar() {

  const navigate = useNavigate();

  const [showProfile, setShowProfile] =
    useState(false);

  // =========================
  // GET USER
  // =========================

  const user = JSON.parse(
    localStorage.getItem("user")
  );


  // =========================
  // LOGOUT
  // =========================

  function handleLogout() {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");
  }


  return (

    <div className="navbar">


      {/* LEFT SIDE */}

      <div className="navbar-left">

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
                {user?.name}
              </h3>

              <p>
                {user?.email}
              </p>

              <div className="profile-divider" />

              <p>
                Home Currency:
                {" "}
                {user?.home_currency}
              </p>

              <p>
                User ID:
                {" "}
                {user?.id}
              </p>

            </div>
          )}

        </div>


        {/* CURRENCY */}

        <div className="currency-badge">

          {user?.home_currency}

        </div>


        {/* LOGOUT */}

        <button
          className="logout-btn"
          onClick={handleLogout}
        >

          Logout

        </button>

      </div>

    </div>
  );
}

export default Navbar;