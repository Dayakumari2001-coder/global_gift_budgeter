# Global Gift Budgeter

Global Gift Budgeter is a full-stack application designed to help users manage gift wishlists across multiple currencies. It allows users to create personalized wishlists, track international item prices, convert values into their preferred home currency, and monitor their budget in a modern dashboard experience.

The project combines a FastAPI backend, a React + Vite frontend, and a MySQL database to provide a secure and user-friendly budgeting workflow for gifting and international spending.

## Overview

Global Gift Budgeter helps users:

- Create and manage multiple wishlists
- Add items with foreign prices in various currencies
- Convert item totals to the user’s home currency
- Track budget totals and wishlist summaries
- Maintain a personalized profile and account settings
- View a modern dashboard for gift planning and financial tracking

This project is ideal for users who frequently shop across borders or manage gifting budgets for family, friends, and events.

---

## Features

- Secure user authentication and authorization
- Wishlist creation and management
- Item tracking with price and currency metadata
- Automatic currency conversion using exchange-rate data
- Home currency configuration per user
- Real-time wishlist total calculations
- Dashboard for overview and budgeting insights
- Responsive frontend for desktop and browser use
- REST API backend for clean separation of concerns

---

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS
- React Router
- Axios

### Backend
- Python
- FastAPI
- SQLAlchemy
- MySQL
- JWT-based authentication
- Passlib for password hashing
- Requests for external API calls

### Database
- MySQL

---

## Project Structure

```text
global_gift_budgeter/
├── .gitignore
├── backend/
│   ├── .env
│   ├── app/
│   │   ├── api/
│   │   │   ├── currency.py
│   │   │   ├── currency_convert.py
│   │   │   ├── currency_rates.py
│   │   │   ├── currency_refresh.py
│   │   │   ├── profile.py
│   │   │   ├── users.py
│   │   │   ├── wishlist_items.py
│   │   │   ├── wishlist_summary.py
│   │   │   └── wishlists.py
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── scheduler.py
│   │   └── schemas.py
│   └── main.py
├── database/
│   └── schema.sql
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
└── README.md
```

---

## Architecture

The application follows a layered architecture:

- Frontend: user interface and interactions
- Backend API: business logic, authentication, and route handling
- Database: persistent storage for users, wishlists, items, and exchange rate data
- Exchange rate integration: external API fetches used to keep currency values current

The backend exposes API routes for:
- user registration and login
- wishlist management
- item management
- profile actions
- currency conversion
- exchange-rate refresh

---

## Prerequisites

Before running the project, ensure you have the following installed:

- Python 3.10+
- Node.js 18+
- npm
- MySQL 8+
- A virtual environment tool such as `venv`
- An exchange rate API key (for live currency data)

---

## Environment Setup

Create a `.env` file inside the `backend/` project directory with the following variables:

```env
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_NAME=gift_budgeter
EXCHANGE_RATE_API_KEY=your_exchange_rate_api_key
DEBUG=True
```

The backend configuration is loaded from environment variables and is used to connect to the database and access external exchange-rate data.

---

## Database Setup

The project includes a MySQL schema at:

```text
database/schema.sql
```

Import it into your MySQL instance before starting the backend:

```bash
mysql -u root -p < database/schema.sql
```

This setup creates the required tables for:
- users
- wishlists
- wishlist items
- exchange rates

---

## Backend Setup

From the repository root:

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment:

On macOS/Linux:

```bash
source .venv/bin/activate
```

On Windows:

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install fastapi uvicorn sqlalchemy mysql-connector-python python-dotenv python-jose[cryptography] passlib[bcrypt] requests apscheduler
```

Start the backend:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API should now be available at:

```text
http://localhost:8000
```

You can verify the application root endpoint:

```bash
curl http://localhost:8000/
```

Expected response:

```json
{
  "message": "Welcome to the Global Gift Budgeter API!"
}
```

---

## Frontend Setup

From the repository root:

```bash
cd frontend
npm install
npm run dev
```

The frontend will typically run at:

```text
http://localhost:5173
```

---
## Running the Application
To use the app locally:

1. Start MySQL and ensure your database is available.
2. Configure the backend environment variables.
3. Run the backend server.
4. Run the frontend development server.
5. Open the frontend in your browser.
---

## API Overview

The backend exposes a set of REST endpoints grouped by feature area:

### Users
- `/api/users/register`
- `/api/users/login`
- `/api/users/me`

### Wishlists
- `/api/wishlists/my`
- `/api/wishlists/`
- `/api/wishlists/{wishlist_id}`

### Wishlist Items
- `/api/items/{wishlist_id}`
- `/api/items/{item_id}`

### Currency
- `/api/currency`
- `/api/currency-rates`
- `/api/currency-convert`
- `/api/currency-refresh/all`

These routes support data retrieval, creation, update, deletion, and currency conversion logic for wishlist-based budgeting.

---

## Functional Workflow

A typical user flow is:

1. Register a new account
2. Log in to receive a JWT token
3. Choose a home currency
4. Create a wishlist
5. Add gift items with prices in foreign currencies
6. View converted totals in the user’s base currency
7. Monitor the total budget and item details from the dashboard

---

## Contact

For questions, suggestions, or collaboration, use the repository’s GitHub issue tracker or contact the repository owner directly.
---
## Summary

Global Gift Budgeter is a practical budgeting and wishlist management application that simplifies tracking gift costs across currencies. With a FastAPI backend, React frontend, and MySQL database, it offers a full-stack solution for international budgeting and gift planning.

If you want to extend the app further, the current architecture provides a solid base for richer budgeting features, analytics, and user personalization.
