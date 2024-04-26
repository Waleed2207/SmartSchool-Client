import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import classes from "./Space.module.scss";

function Space(props) {


  return (
    <div className={classes.Space}>
      <div>
        <div className={classes.Title}>{props.type}</div>
        <div>
          {props.rasp_ip} 
        </div>
      </div>
      {props.icon ? (
        <FontAwesomeIcon icon={props.icon} className={classes.Icon} />
      ) : null}
    </div>
  );
}

Space.propTypes = {
  id: PropTypes.string,
  type: PropTypes.string,
  icon: PropTypes.object,
  rasp_ip: PropTypes.string
};

export default Space;
