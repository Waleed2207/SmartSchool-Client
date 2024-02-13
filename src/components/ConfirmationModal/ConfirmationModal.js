// ConfirmationModal.js or within the same file if you prefer
const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;
  
    return (
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', zIndex: 100, border: '1px solid #ccc', borderRadius: '4px' }}>
        <p>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
          <button onClick={onConfirm} style={{ marginRight: '10px' }}>Yes</button>
          <button onClick={onClose}>No</button>
        </div>
      </div>
    );
  };
  export default ConfirmationModal;
