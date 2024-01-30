import React from "react";
import SignUpForm from "../../components/SignUpForm/SignUpForm";

const SignUp = ({ onSignUpSuccess }) => {
  return <SignUpForm onSignUpSuccess={onSignUpSuccess} />;
};

export default SignUp;
