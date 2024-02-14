import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import classes from "./SignUpForm.module.scss";
import { SERVER_URL } from "../../consts";

const SignUpForm = ({ onSignUpSuccess = () => { } }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("User");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

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
      });

      console.log(response);

      if (response.status === 201) {
        alert("Sign up successful");
        onSignUpSuccess(response.data);
        navigate('/rooms-dashboard');
      }
    } catch (error) {
      console.error("Sign up failed:", error);
      setErrorMessage("Sign up failed");
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
        <div className={classes.subContainer}>
          <button className={classes.submit_btn} type="submit">Sign Up</button>

        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
