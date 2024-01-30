import React from 'react';
import { NavLink } from 'react-router-dom';

const NavigationItem = ({ children, to, ...props }) => (
  <li>
    <NavLink to={to} {...props}>
      {children}
    </NavLink>
  </li>
);

export default NavigationItem;
