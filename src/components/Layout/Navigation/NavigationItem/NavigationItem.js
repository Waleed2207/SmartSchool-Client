// import React from 'react';
// import { NavLink } from 'react-router-dom';

// const NavigationItem = ({ children, to, ...props }) => (
//   <li>
//     <NavLink to={to} {...props}>
//       {children}
//     </NavLink>
//   </li>
// );

// export default NavigationItem;
// // NavigationItem.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

const NavigationItem = ({ to, children }) => (
  <li>
    <NavLink to={to} >
      {children}
    </NavLink>
  </li>
);

NavigationItem.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default NavigationItem;