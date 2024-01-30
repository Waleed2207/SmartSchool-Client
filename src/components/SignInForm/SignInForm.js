import React, { useState } from "react";
import axios from "axios";
import classes from "./SignInForm.module.scss";
import { SERVER_URL } from "../../consts";

const SignInForm = ({ onSignIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${SERVER_URL}/login`, {
        email,
        password,
      });

      console.log(response);

      if (response.status === 200) {
        onSignIn(response.data.token, response.data.user);
      }
    } catch (error) {
      console.error("Sign in failed:", error);
      setErrorMessage("Invalid email or password");
    }
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Log In</h1>
      {errorMessage && <div className={classes.error_message}>{errorMessage}</div>}
      <form onSubmit={handleSubmit} className={classes.form}>
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
            type={showPassword ? 'text' : 'password'} // Update the input type based on the showPassword state
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className={classes.showPasswordButton}
            onClick={() => setShowPassword(!showPassword)} // Toggle the showPassword state
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <div className={classes.subContainer}>
          <button className={classes.submit_btn} type="submit">Log In</button>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
