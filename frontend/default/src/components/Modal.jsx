import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({ visible, onClose, children }) => {
if (!visible) return null; // Render nothing if not visible

  return (
    <div className="z-50 fixed top-0 left-0 w-full h-full flex items-center justify-center bg-transparent backdrop-blur-sm" onClick={onClose}>
      <div className="relative bg-white w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-6 right-6 font-semibold" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

Modal.propTypes = {
  visible: PropTypes.bool.isRequired, // Controls modal visibility
  onClose: PropTypes.func, // Function to close modal
  children: PropTypes.node,           // Content inside the modal
};

export default Modal;
