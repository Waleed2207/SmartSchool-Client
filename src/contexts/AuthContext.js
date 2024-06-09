import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

// Create AuthContext with default values
const AuthContext = createContext();

// AuthProvider component to wrap the component tree and provide authentication state
export const AuthProvider = ({ children }) => {
  // Initialize isAuthenticated state based on cookies
  const [isAuthenticated, setIsAuthenticated] = useState(
    Cookies.get("isAuthenticated") === "true"
  );

  // Initialize user state based on cookies
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

  // Function to handle user sign-in
  const handleSignIn = (token, userData) => {
    setIsAuthenticated(true);
    const userWithToken = { ...userData, token };
    setUser(userWithToken);
    Cookies.set("isAuthenticated", "true", { expires: 1 });
    Cookies.set("user", JSON.stringify(userWithToken), { expires: 1 });
  };

  // Function to handle user logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    Cookies.remove("isAuthenticated");
    Cookies.remove("user");
  };

  // Fetch user role if not already available
  useEffect(() => {
    if (user && !user.role) {
      const fetchUserRole = async () => {
        try {
          const response = await axios.post("/api-login/login", {
            email: user.email,
            password: user.password
          });
          const updatedUser = {
            ...user,
            role: response.data.user.role,
            space_id: response.data.user.space_id
          };
          setUser(updatedUser);
          Cookies.set("user", JSON.stringify(updatedUser), { expires: 1 });
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
