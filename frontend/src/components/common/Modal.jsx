import React from 'react';

const Modal = ({ children, onClose }) => (
  <div className="modal">
    <div className="modal-content">
      <button onClick={onClose}>Close</button>
      {children}
    </div>
  </div>
);

export default Modal;
