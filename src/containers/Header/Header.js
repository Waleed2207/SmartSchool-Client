import React, { useState } from "react";
import PropTypes from "prop-types";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { toggleSideDrawer } from "./../../store/ui/ui.actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Button from "./../../components/UI/Button/Button";
import Navigation from "./../../components/Layout/Navigation/Navigation";
import NavigationItem from "./../../components/Layout/Navigation/NavigationItem/NavigationItem";
import classes from "./Header.module.scss";
import { getGreeting } from "../../utils/utils";
import { NewSuggestionsCount } from "../../components/Suggestions/NewSuggestionsCount";
import styled from "styled-components";

const NavigationItemContainer = styled.div`
  display: flex;
`;

const Header = ({ toggleSideDrawer, user, onLogout, newSuggestionsCount }) => {
  const firstName = user ? user.fullName.split(" ")[0] : "";
  const greeting = getGreeting();
  const location = useLocation();
  const navigate = useNavigate();

  const isCurrentPage = (path) => {
    return location.pathname.startsWith(path);
  };

  const handleRoomsClick = () => {
    navigate("/rooms");
  };


  return (
    <header className={classes.Header}>
      <div className={classes.HeaderContainer}>
        <div className={classes.AppName}>
          <NavLink to="/" className={classes.AppNameLink}>
            Smarthome
          </NavLink>
        </div>
        <div className={classes.Navigation}>
          <Navigation>
            <NavigationItem
              to="/rooms"
              onClick={handleRoomsClick}
              activeClassName={classes.ActiveNavLink}
              className={isCurrentPage("/rooms") ? classes.ActiveNavLink : ""}
            >
              Rooms
            </NavigationItem>
            <NavigationItem
              to="/rules"
              activeClassName={classes.ActiveNavLink}
              className={isCurrentPage("/rules") ? classes.ActiveNavLink : ""}
            >
              Rules
            </NavigationItem>
            <NavigationItem
              to="/location"
              activeClassName={classes.ActiveNavLink}
              className={
                isCurrentPage("/location") ? classes.ActiveNavLink : ""
              }
            >
              <NavigationItemContainer>

              Location
              </NavigationItemContainer>
            </NavigationItem>
            <NavigationItem
              to="/suggestions"
              activeClassName={classes.ActiveNavLink}
              className={
                isCurrentPage("/suggestions") ? classes.ActiveNavLink : ""
              }
            >
              <NavigationItemContainer>
                Suggestions
                {!!newSuggestionsCount && <NewSuggestionsCount value={newSuggestionsCount} />}
              </NavigationItemContainer>
            </NavigationItem>
            <NavigationItem
              to="/insights"
              activeClassName={classes.ActiveNavLink}
              className={
                isCurrentPage("/insights") ? classes.ActiveNavLink : ""
              }
            >
              Insights
            </NavigationItem>
          </Navigation>
        </div>
        {user && (
          <div className={classes.UserGreeting}>
            <span>
              {greeting}, {firstName}
            </span>
            <Button onClick={onLogout}>Logout</Button>
          </div>
        )}
        <div className={classes.MenuBtn}>
          <Button onClick={toggleSideDrawer}>
            <FontAwesomeIcon icon={faBars} />
          </Button>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  toggleSideDrawer: PropTypes.func,
  user: PropTypes.object,
  onLogout: PropTypes.func,
};

export default connect(null, { toggleSideDrawer })(Header);
