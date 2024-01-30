import React from 'react';
import SignInForm from '../../components/SignInForm/SignInForm';
import classes from './SignIn.module.scss'; // Add this line

const SignIn = ({ onSignInSuccess }) => {
  const handleSignIn = (token, user) => {
    onSignInSuccess(token, user);
  };
  return (
    <div className={classes.container}>
      <SignInForm onSignIn={handleSignIn} />
    </div>
  );
};

export default SignIn;
