import React from 'react';
import ReactDOM from 'react-dom';
import classes from './ACModal.module.scss';
// import {CloseIcon} from '@material-ui/icons/Close';

const ACModal = (props) => {
  const { show, onClose, children, title } = props;

  if (!show) return null;

  return (
    <div className={classes.modalOverlay}>
      <div className={classes.modal}>
        <div className={classes.modalHeader}>
          <h2>{title}</h2>
          {/* <CloseIcon className={classes.closeIcon} onClick={onClose} /> */}
        </div>
        <div className={classes.modalBody}>{children}</div>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default ACModal;
