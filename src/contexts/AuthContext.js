import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Cookies.get("isAuthenticated") === "true"
  );
  const [user, setUser] = useState(() => {
    const userData = Cookies.get("user");
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error("Failed to parse user data:", error);
        Cookies.remove("user");
      }
    }
    return null;
  });

  const handleSignIn = (token, userData) => {
    setIsAuthenticated(true);
    setUser({ ...userData, token });
    Cookies.set("isAuthenticated", "true", { expires: 1 });
    Cookies.set("user", JSON.stringify({ ...userData, token }), { expires: 1 });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    Cookies.remove("isAuthenticated");
    Cookies.remove("user");
  };

  useEffect(() => {
    if (user && !user.role) {
      const fetchUserRole = async () => {
        try {
          const response = await axios.post("/api-login/login", {
            email: user.email,
            password: user.password
          });
          setUser({ ...user, role: response.data.user.role, space_id: response.data.user.space_id });
          Cookies.set("user", JSON.stringify({ ...user, role: response.data.user.role, space_id: response.data.user.space_id }), { expires: 1 });
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      };

      fetchUserRole();
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setUser, handleSignIn, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
