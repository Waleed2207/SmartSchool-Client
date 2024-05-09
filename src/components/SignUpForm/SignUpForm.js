import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import classes from "./SignUpForm.module.scss";
import { SERVER_URL } from "../../consts";
import Cookies from "js-cookie";

const SignUpForm = ({ onSignUpSuccess = () => { } }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("User");
  const [space_id, setSpaceID] = useState("61097711");

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    Cookies.get("isAuthenticated") === "true" || false
  );

const getUserFromCookie = () => {
  const userData = Cookies.get("user");
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Failed to parse user data:', error);
      // Handle the error as needed, e.g., clear the invalid cookie
      Cookies.remove("user");
      return null;
    }
  }
  return null;
};

  // Use the getUserFromCookie function to initialize the 'user' state
  const [user, setUser] = useState(getUserFromCookie()); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(`${SERVER_URL}/api-login/register`, {
        fullName,
        email,
        password,
        role,
        space_id,
      });

      console.log(response);

      if (response.status === 201) {
        alert("Sign up successful");
        setIsAuthenticated(false);
        setUser(null);
        Cookies.remove("isAuthenticated");
        Cookies.remove("user");
        navigate('/'); 
      } else {
        setErrorMessage("Sign up failed with status: " + response.status);
      }
    } catch (error) {
  console.error("Sign up failed:", error);
    setErrorMessage(error.response?.data?.message || "Sign up failed");
    }
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Sign Up</h1>
      {errorMessage && <div className={classes.error_message}>{errorMessage}</div>}
      <form onSubmit={handleSubmit} className={classes.form}>
        <div className={classes.form_group}>
          <label htmlFor="fullName" className={classes.label}>Full Name:</label>
          <input
            className={classes.input}
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div className={classes.form_group}>
          <label htmlFor="email" className={classes.label}>Email:</label>
          <input
            className={classes.input}
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={classes.form_group}>
          <label htmlFor="password" className={classes.label}>Password:</label>
          <input
            className={classes.input}
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className={classes.form_group}>
          <label htmlFor="confirmPassword" className={classes.label}>Confirm Password:</label>
          <input
            className={classes.input}
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className={classes.form_group}>
          <label htmlFor="role" className={classes.label}>Role:</label>
          <select
            className={classes.input}
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="Admin">Admin</option>
            <option value="User">User</option>
            <option value="Owner">Owner</option>
          </select>
        </div>
        <div className={classes.form_group}>
          <label htmlFor="space_id" className={classes.label}>Space ID:</label>
          <select
            className={classes.input}
            id="space_id"
            value={space_id}
            onChange={(e) => setSpaceID(e.target.value)}
            required
          >
            <option value="61097711">61097711</option>
            <option value="17886285">17886285</option>
          </select>
        </div>
        <div className={classes.subContainer}>
          <button className={classes.submit_btn} type="submit">Sign Up</button>

        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
