import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate, redirect } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const API_URL = process.env.NODE_ENV === "production" ? "YOUR_APP_URL" : "http://localhost:5000";


const Login = ({ }) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    username: "",
    password: ""
  });

  const { username, password } = inputs;

  const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const body = { username, password };
      console.log("send");
      const response = await fetch(
        `${API_URL}/user/login`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(body)
        }
      );

      const parseRes = await response.json();

      if (parseRes.id) {
        localStorage.setItem("id", parseRes.id);
        localStorage.setItem("name", parseRes.name);
        navigate("/");
      } else {
        toast(parseRes);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
        <div className="col" style={{"backgroundColor": "#414180"}}></div>
        <div className="col-5 justify-content-center">
            <div className="d-flex justify-content-center" style={{"flexDirection":"column", "height": "100vh"}}>
              <h1 className="mt-1 text-center" style={{"color":"white"}}>Welcome to NoteX!</h1>
              <h3 className="mt-3 text-center" style={{"color":"white"}}>Login</h3>
            <form onSubmit={onSubmitForm}>
              <input
                type="text"
                name="username"
                placeholder="Enter Username"
                value={username}
                onChange={e => onChange(e)}
                className="form-control my-3"
              />
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                value={password}
                onChange={e => onChange(e)}
                className="form-control my-3"
              />
              <button class="btn btn-success btn-block">Submit</button>
            </form>
            <Link to="/register" style={{"color": "white"}} className="mt-3">Click here to register!</Link>
            </div>
          </div>
          <div className="col" style={{"backgroundColor": "#414180"}}></div>
          <ToastContainer></ToastContainer>
    </Fragment>
  );
};

export default Login;