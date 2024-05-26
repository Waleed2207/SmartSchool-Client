// import React from "react";
// import PropTypes from "prop-types";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTimes } from "@fortawesome/free-solid-svg-icons";

// import classes from "./RulesModal.module.scss";

// function RulesModal(props) {
//   let modalClasses = [classes.ModalBox];
//   if (props.show) {
//     modalClasses.push(classes.Show);
//   }

//   return (
//     <div className={classes.ModalWrapper} style={{ display: props.show ? "block" : "none" }}>
//       <div className={modalClasses.join(" ")}>
//         <div className={classes.ModalHeader}>
//           <FontAwesomeIcon icon={faTimes} className={classes.CloseIcon} onClick={props.onCloseModal} />
//         </div>
//         <div className={classes.ModalBody}>
//           <div className={classes.ModalMessage}>{props.message}</div>
//         </div>
//       </div>
//     </div>
//   );
// }
// RulesModal.propTypes = {
//   show: PropTypes.bool,
//   onCloseModal: PropTypes.func,
//   message: PropTypes.string,
// };

// export default RulesModal;



import React from "react";
import PropTypes from "prop-types";
import classes from "./RulesModal.module.scss";

const RulesModal = ({ show, onCloseModal, message, children }) => {
  if (!show) return null;

  return (
    <div className={classes.ModalOverlay}>
      <div className={classes.Modal}>
        <div className={classes.ModalHeader}>
          <button className={classes.CloseButton} onClick={onCloseModal}>
            &times;
          </button>
        </div>
        <div className={classes.ModalBody}>
          {message && <p>{message}</p>}
          {children}
        </div>
      </div>
    </div>
  );
};

RulesModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  message: PropTypes.string,
  children: PropTypes.node,
};

export default RulesModal;
