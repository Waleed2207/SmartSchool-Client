import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Button from '../../components/UI/Button/Button';
import Navigation from '../../components/Layout/Navigation/Navigation';
import NavigationItem from '../../components/Layout/Navigation/NavigationItem/NavigationItem';
import { getGreeting } from '../../utils/utils';
import { NewSuggestionsCount } from '../../components/Suggestions/NewSuggestionsCount';
import { toggleSideDrawer } from '../../store/ui/ui.actions';
import classes from './Header.module.scss';
import styled from 'styled-components';
import { useSpace } from './../../contexts/SpaceContext';

const NavigationItemContainer = styled.div`
  display: flex;
`;

const Header = ({ toggleSideDrawer, user, onLogout, newSuggestionsCount }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const toggleNav = () => setIsNavOpen(!isNavOpen);
    const location = useLocation();

  const firstName = user ? user.fullName.split(" ")[0] : "";
  const greeting = getGreeting();
  const hasEnteredSpace = location.pathname.startsWith('/spaces/');

  const isCurrentPage = (path) => location.pathname.startsWith(path);
  const handleNavItemClick = () => setIsNavOpen(false); // Close menu on item click
  const { spaceId } = useSpace();


  return (
    <header className={classes.Header}>
      <div className={classes.HeaderContainer}>
        <div className={classes.TopBar}>
          <div className={classes.AppName}>
            <NavLink to="/" className={classes.AppNameLink}>
              SmartHome
            </NavLink>
          </div>
          <div className={`${classes.Navigation} ${isNavOpen ? classes.open : ''}`}>
            <Navigation>
              {["spaces", "location", "suggestions", "insights"].map((item, index) => {
                const items = [];
                items.push(
                  <NavigationItem
                    key={item}
                    to={`/${item}`}
                    activeClassName={classes.ActiveNavLink}
                    className={isCurrentPage(`/${item}`) ? classes.ActiveNavLink : ""}
                    onClick={handleNavItemClick}
                  >
                    <NavigationItemContainer>
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                      {item === "suggestions" && !!newSuggestionsCount && (
                        <NewSuggestionsCount value={newSuggestionsCount} />
                      )}
                    </NavigationItemContainer>
                  </NavigationItem>
                );

                if (item === "spaces"  && hasEnteredSpace) {
                  items.push(
                    <NavigationItem
                      key="rules"
                      to={`/spaces/${spaceId}/rules`}
                      activeClassName={classes.ActiveNavLink}
                      className={isCurrentPage(`/spaces/${spaceId}/rules`) ? classes.ActiveNavLink : ""}
                      onClick={handleNavItemClick}
                    >
                      <NavigationItemContainer>
                        Rules
                      </NavigationItemContainer>
                    </NavigationItem>
                  );
                }
                
                return items;
              })}
            </Navigation>
          </div>
          {user && (
            <div className={`${classes.UserGreeting} ${isNavOpen ? 'open' : ''}`}>
              <span>{greeting}, {firstName}</span>
              <Button onClick={onLogout}>Logout</Button>
              <div className={classes.MenuBtn}>
                <Button onClick={toggleNav}>
                  <FontAwesomeIcon icon={faBars} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  toggleSideDrawer: PropTypes.func,
  user: PropTypes.object,
  onLogout: PropTypes.func,
  newSuggestionsCount: PropTypes.number
};

export default connect(null, { toggleSideDrawer })(Header);
