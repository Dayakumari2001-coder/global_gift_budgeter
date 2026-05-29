import { Link } from "react-router-dom";

import "../styles/home.css";

function Home() {

  return (

    <div className="home-page">

      {/* ========================= */}
      {/* NAVBAR */}
      {/* ========================= */}

      <nav className="home-navbar">

        <div className="home-logo">

          GLOBAL GIFT BUDGETER

        </div>

        <div className="home-nav-links">

          <Link to="/login">
            Login
          </Link>

          <Link
            to="/register"
            className="register-btn"
          >
            Register
          </Link>

        </div>

      </nav>


      {/* ========================= */}
      {/* HERO */}
      {/* ========================= */}

      <section className="hero-section">

        <div className="hero-content">

          <h1>

            Manage Global Gift Budgets
            Across Multiple Currencies

          </h1>

          <p>

            Create smart wishlists,
            convert currencies instantly,
            and track international
            spending with a modern
            fintech-style dashboard.

          </p>

          <div className="hero-buttons">

            <Link
              to="/register"
              className="primary-hero-btn"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="secondary-hero-btn"
            >
              Login
            </Link>

          </div>

        </div>


        {/* RIGHT PREVIEW */}

        <div className="hero-preview">

          <div className="preview-card">

            <h3>
              Total Budget
            </h3>

            <h2>
              ₹1,24,500
            </h2>

            <p>
              +12% this month
            </p>

          </div>

          <div className="preview-card">

            <h3>
              Active Currencies
            </h3>

            <h2>
              USD • EUR • GBP
            </h2>

          </div>

          <div className="preview-card">

            <h3>
              Wishlists
            </h3>

            <h2>
              12 Active
            </h2>

          </div>

        </div>

      </section>


      {/* ========================= */}
      {/* FEATURES */}
      {/* ========================= */}

      <section className="features-section">

        <h2>
          Powerful Features
        </h2>

        <div className="features-grid">

          <div className="feature-card">

            <h3>
              💱 Currency Conversion
            </h3>

            <p>
              Convert international prices
              into your home currency instantly.
            </p>

          </div>

          <div className="feature-card">

            <h3>
              🎁 Smart Wishlists
            </h3>

            <p>
              Organize gifts and budgets
              with scalable wishlist management.
            </p>

          </div>

          <div className="feature-card">

            <h3>
              📊 Analytics Dashboard
            </h3>

            <p>
              Track spending, totals,
              and budget trends visually.
            </p>

          </div>

          <div className="feature-card">

            <h3>
              🔒 Secure Authentication
            </h3>

            <p>
              JWT-secured login system
              with protected dashboard routes.
            </p>

          </div>

        </div>

      </section>


      {/* ========================= */}
      {/* HOW IT WORKS */}
      {/* ========================= */}

      <section className="workflow-section">

        <h2>
          How It Works
        </h2>

        <div className="workflow-grid">

          <div className="workflow-step">

            <span>1</span>

            <h3>Create Account</h3>

          </div>

          <div className="workflow-step">

            <span>2</span>

            <h3>Select Home Currency</h3>

          </div>

          <div className="workflow-step">

            <span>3</span>

            <h3>Create Wishlists</h3>

          </div>

          <div className="workflow-step">

            <span>4</span>

            <h3>Track Global Budgets</h3>

          </div>

        </div>

      </section>


      {/* ========================= */}
      {/* FOOTER */}
      {/* ========================= */}

      <footer className="home-footer">

        <p>

          Global Gift Budgeter

        </p>

        <span>

          FastAPI • React • MySQL

        </span>

      </footer>

    </div>
  );
}

export default Home;