import React from "react";
import PropTypes from "prop-types";
import classes from "./RulesModal.module.scss";

const RulesModal = ({ show, onCloseModal, title, children }) => {
  if (!show) return null;

  return (
    <div className={classes.ModalOverlay}>
      <div className={classes.Modal}>
        <div className={classes.ModalHeader}>
          <h2 className={classes.ModalTitle}>{title}</h2>
          <button className={classes.CloseButton} onClick={onCloseModal}>
            &times;
          </button>
        </div>
        <div className={classes.ModalBody}>
          {children}
        </div>
      </div>
    </div>
  );
};

RulesModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
};

export default RulesModal;
