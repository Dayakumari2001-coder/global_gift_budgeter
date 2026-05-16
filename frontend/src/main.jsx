import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route 
        path="/" 
        element={<Navigate to="/Login" />}/>
        <Route path="/Login" element={<Login />}/>
        <Route path="/Register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
