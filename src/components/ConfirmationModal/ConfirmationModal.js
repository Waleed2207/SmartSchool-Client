import styles from './ConfirmationModal.module.scss';
const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;
  
    return (
      <div className={styles.modalBackdrop}>
        <div className={styles.modalContent}>
          <p className={styles.modalMessage}>{message}</p>
          <div className={styles.buttonGroup}>
            <button className={`${styles.button} ${styles.confirm}`} onClick={onConfirm}>Yes</button>
            <button className={`${styles.button} ${styles.cancel}`} onClick={onClose}>No</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ConfirmationModal;