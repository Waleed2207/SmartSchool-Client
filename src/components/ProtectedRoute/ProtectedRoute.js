import React from "react";
import { Route, Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, isAuthenticated, ...rest }) => {
  if (isAuthenticated) {
    return <Route {...rest} element={element} />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
