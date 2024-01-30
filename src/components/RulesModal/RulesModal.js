import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import classes from "./RulesModal.module.scss";

function RulesModal(props) {
  let modalClasses = [classes.ModalBox];
  if (props.show) {
    modalClasses.push(classes.Show);
  }

  return (
    <div className={classes.ModalWrapper} style={{ display: props.show ? "block" : "none" }}>
      <div className={modalClasses.join(" ")}>
        <div className={classes.ModalHeader}>
          <FontAwesomeIcon icon={faTimes} className={classes.CloseIcon} onClick={props.onCloseModal} />
        </div>
        <div className={classes.ModalBody}>
          <div className={classes.ModalMessage}>{props.message}</div>
        </div>
      </div>
    </div>
  );
}
RulesModal.propTypes = {
  show: PropTypes.bool,
  onCloseModal: PropTypes.func,
  message: PropTypes.string,
};

export default RulesModal;
