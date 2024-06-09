import React, { useEffect, useState, useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import RoomsDashboard from "./containers/RoomsDashboard/RoomsDashboard";
import SpacesDashboard from "./containers/SpacesDashboard/SpacesDashboard";
import WelcomeDashboard from "./containers/WelcomeDashboard/WelcomeDashboard";
import SignIn from "./containers/SignIn/SignIn";
import SignUp from "./containers/SignUp/SignUp";
import LocationDashboard from "./containers/LocationDashboard/LocationDashboard";
import RulesDashboard from "./containers/RulesDashboard/RulesDashboard";
import Header from "./containers/Header/Header";
import RoomDevices from "./containers/RoomsDashboard/RoomDevices/RoomDevices";
import { Notification } from "./components/Notification/Notification";
import { SuggestionsTable } from "./components/Suggestions/SuggestionsTable";
import Insights from "./containers/Insights/Insights";
import HouseMap from "./components/HouseMap/HouseMap";
import RoomsPage from "./containers/RoomPage/RoomsPage";
import { SpaceProvider } from './contexts/SpaceContext';
import AuthContext, { AuthProvider } from "./contexts/AuthContext";
import { getSuggestions } from "./components/Suggestions/suggestions.service";
import UserContext from "./contexts/UserContext";
import CalendarDashboard from "./containers/CalendarDashboard/CalendarDashboard";


const App = () => {
  const [newSuggestionsCount, setNewSuggestionsCount] = useState(0);
  const [isHouseMapVisible, setIsHouseMapVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const suggestions = await getSuggestions();
      const newSuggestions = suggestions.filter(({ is_new }) => is_new);
      setNewSuggestionsCount(newSuggestions.length);
    })();
  }, []);

  return (
    <AuthProvider>
      <AppContent
        newSuggestionsCount={newSuggestionsCount}
        setNewSuggestionsCount={setNewSuggestionsCount}
        isHouseMapVisible={isHouseMapVisible}
        setIsHouseMapVisible={setIsHouseMapVisible}
      />
    </AuthProvider>
  );
};

const AppContent = ({
  newSuggestionsCount,
  setNewSuggestionsCount,
  isHouseMapVisible,
  setIsHouseMapVisible
}) => {
  const { isAuthenticated, user, setUser, handleSignIn, handleLogout } = useContext(AuthContext);

  return (
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
          {/* <Route path="/spaces/:spaceId/rooms" element={isAuthenticated ? <RoomsPage token={user?.token} /> : <Navigate to="/login" />} /> */}
          <Route path="/spaces/:spaceId/rooms-dashboard" element={isAuthenticated ? <RoomsDashboard token={user?.token} /> : <Navigate to="/login" />} />
          <Route
            path="/rooms"
            element={
              isAuthenticated ? <RoomsPage token={user?.token} /> : <Navigate to="/login" />
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
          <Route path="/spaces/:spaceId/Calendar" element={isAuthenticated ? <CalendarDashboard token={user?.token} /> : <Navigate to="/login" />} />
          <Route path="/spaces/:spaceId/rules" element={isAuthenticated ? <RulesDashboard /> : <Navigate to="/login" />} />
          <Route path="/spaces/:spaceId/rooms-dashboard/room/:id" element={isAuthenticated ? <RoomDevices /> : <Navigate to="/login" />} />
          <Route path="/room/:id" element={isAuthenticated ? <RoomDevices /> : <Navigate to="/login" />} />
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
  );
};

export default App;
