import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faServer } from "@fortawesome/free-solid-svg-icons";
import classes from "./Space.module.scss";

function Space(props) {
  // You can set default icons or pass them via props as needed
  const cityIcon = props.cityIcon || faMapMarkerAlt;
  const serverIcon = props.serverIcon || faServer;

  return (
    <div className={classes.Space}>
      <div>
        <div className={classes.Title}>{props.space_name}</div>
        <div className={classes.Container}>
          <div style={{fontSize : '1.1rem'}}>{props.type}</div>
          <div className={classes.City}>
            <FontAwesomeIcon icon={cityIcon} className={classes.CityIcon} />
            <span className={classes.CityText}>{props.city}</span>
          </div>
          <div className={classes.IP}>
            <FontAwesomeIcon icon={serverIcon} className={classes.IPIcon} />
            <span>{props.rasp_ip}</span>
          </div>
        </div>
      </div>
      {props.icon && (
        <FontAwesomeIcon icon={props.icon} className={classes.Icon} />
      )}
    </div>
  );
}

Space.propTypes = {
  space_name: PropTypes.string.isRequired,
  type: PropTypes.string,
  city: PropTypes.string,
  cityIcon: PropTypes.object,
  serverIcon: PropTypes.object,
  icon: PropTypes.object,
  rasp_ip: PropTypes.string
};

export default Space;
