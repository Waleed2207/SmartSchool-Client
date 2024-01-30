// src/components/UI/Switch/Switch.js

import React, { useState } from "react";
import PropTypes from "prop-types";
import classes from "./Switch.module.scss";
import Modal from "../Modal/Modal";

function Switch(props) {
  const [showModal, setShowModal] = useState(false);

  const handleToggle = (event) => {
    props.onChange(event);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  let switchClasses = [classes.Switch];
  if (props.checked) {
    switchClasses.push(classes.Checked);
  }

  return (
    <>
      {/* <Modal show={showModal} onCloseModal={handleCloseModal}>
        {props.modalContent}
      </Modal> */}
      <label className={switchClasses.join(" ")}>
        <input type="checkbox" {...props} onChange={handleToggle} />
        <div />
      </label>
    </>
  );
}

Switch.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  modalContent: PropTypes.node,
};

export default Switch;
