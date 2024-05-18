import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import "./App.module.scss";
import RoomsDashboard from "./containers/RoomsDashboard/RoomsDashboard";
import SpacesDashboard from "./containers/SpacesDashboard/SpacesDashboard";
import WelcomeDashboard from "./containers/WelcomeDashboard/WelcomeDashboard";
import SignIn from "./containers/SignIn/SignIn";
import SignUp from "./containers/SignUp/SignUp";
import LocationDashboard from "./containers/LocationDashboard/LocationDashboard";
import RulesDashboard from "./containers/RulesDashboard/RulesDashboard";
import Header from "./containers/Header/Header";
import Cookies from "js-cookie";
import RoomDevices, { RoomDevicesWrapper } from "./containers/RoomsDashboard/RoomDevices/RoomDevices";
import { Notification } from "./components/Notification/Notification";
import { SuggestionsTable } from "./components/Suggestions/SuggestionsTable";
import Insights from "./containers/Insights/Insights";
import axios from 'axios';
import { getSuggestions } from "./components/Suggestions/suggestions.service";
import UserContext from "./contexts/UserContext";
import HouseMap from "./components/HouseMap/HouseMap";
import RoomsPage from "./containers/RoomPage/RoomsPage";
import { SpaceProvider } from './contexts/SpaceContext';

function App() {
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
  const [newSuggestionsCount, setNewSuggestionsCount] = useState(0);
  const [isHouseMapVisible, setIsHouseMapVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const suggestions = await getSuggestions();
      const newSuggestions = suggestions.filter(({ is_new }) => is_new);
      setNewSuggestionsCount(newSuggestions.length);
    })()
  }, []);


  // Fetch the user role when the user logs in
  useEffect(() => {
    if (user && !user.role) {
      const fetchUserRole = async () => {
        try {
          const response = await axios.post('/api-login/login', { email: user.email, password: user.password });
          setUser({ ...user, role: response.data.user.role, space_id: response.data.user.space_id });
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      };

      fetchUserRole();
    }
  }, [user]);
  useEffect(() => {
    console.log({ newSuggestionsCount });
  }, [newSuggestionsCount]);

  const handleSignIn = (token, userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    Cookies.set("isAuthenticated", true, { expires: 1 }); // 1 day expiration
    Cookies.set("user", JSON.stringify(userData), { expires: 1 });
  };
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    Cookies.remove("isAuthenticated");
    Cookies.remove("user");
  };

  return (
    <>
      <UserContext.Provider value={{ user, setUser }}>
      <SpaceProvider>
        <Header
          user={user}
          onLogout={handleLogout}
          newSuggestionsCount={newSuggestionsCount}
        />
        <Notification
          setNewSuggestionsCount={setNewSuggestionsCount}
          newSuggestionsCount={newSuggestionsCount}
        />
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/spaces" replace />
              ) : (
                <WelcomeDashboard />
              )
            }
          />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/spaces" replace />
              ) : (
                <SignIn onSignInSuccess={handleSignIn} />
              )
            }
          />
          <Route
            path="/signup"
            element={<SignUp onSignUpSuccess={handleSignIn} />}
          />
        <Route path="/spaces" element={isAuthenticated ? <SpacesDashboard /> : <Navigate to="/login" />} />
        <Route path="/spaces/:spaceId/rooms" element={isAuthenticated ? <RoomsPage /> : <Navigate to="/login" />} />
        <Route path="/spaces/:spaceId/rooms-dashboard" element={isAuthenticated ? <RoomsDashboard /> : <Navigate to="/login" />} />         
          <Route
            path="/rooms"
            element={
              isAuthenticated ? <RoomsPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/rooms-dashboard"
            element={
              isAuthenticated ? <RoomsDashboard /> : <Navigate to="/login" />
            }
          >
            <Route
              path="room/:id"
              element={
                isAuthenticated ? <RoomDevices /> : <Navigate to="/login" />
              }
            />
          </Route>
          <Route
            path="/location"
            element={
              isAuthenticated ? <LocationDashboard user={user} /> : <Navigate to="/login" />
            }
          />
           <Route path="/spaces/:spaceId/rules" element={isAuthenticated ? <RulesDashboard /> : <Navigate to="/login" />} />
          <Route
            path="/spaces/:spaceId/rooms-dashboard/room/:id"
            element={isAuthenticated ? <RoomDevices /> : <Navigate to="/login" />}
          />
          <Route
            path="/room/:id"
            element={isAuthenticated ? <RoomDevices /> : <Navigate to="/login" />}
          />
          <Route
            path="/suggestions"
            element={
              isAuthenticated ? (
                <SuggestionsTable
                  setNewSuggestionsCount={setNewSuggestionsCount}
                  newSuggestionsCount={newSuggestionsCount}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/insights"
            element={isAuthenticated ? <Insights /> : <Navigate to="/login" />}
          />
        </Routes>
        {isHouseMapVisible && <HouseMap onClose={() => setIsHouseMapVisible(false)} />}
        </SpaceProvider>

      </UserContext.Provider>
    </>
  );
}

export default App;
