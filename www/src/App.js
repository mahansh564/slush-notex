import React, { Fragment, useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";

import AuthContext from './context/AuthContext';

import Login from "./routes/Login";
import Register from "./routes/Register";
import Dashboard from "./routes/Dashboard";

const API_URL = process.env.NODE_ENV === "production" ? "YOUR_APP_URL" : "http://localhost:5000";



const App = () => {

  const { auth, logout } = useContext(AuthContext);

  return (
    <Fragment>
        <div className="container main-div">
          <div className="row">
          <Routes>
            <Route
              exact
              path="/"
              element={auth ? <Navigate to="/dashboard"/> : <Login />}
            />
            <Route
              exact
              path="/login"
              element={auth ? <Navigate to="/dashboard"/> : <Login />}
            />
            <Route
              exact
              path="/register"
              element={auth ? <Navigate to="/dashboard"/> : <Register />}
            />
            <Route
              exact
              path="/dashboard"
              element={auth ? <Dashboard /> : <Navigate to="/login"/>}
            />
            <Route
              exact
              path="/logout"
              render={(props) => logout()}
            />
          </Routes>
          </div>
        </div>
    </Fragment>
  );
}

export default App;