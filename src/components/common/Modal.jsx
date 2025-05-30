// src/components/common/Modal.jsx
import React from "react";
import { FaTimes } from "react-icons/fa";

function Modal({ isOpen, onClose, title, children, size = "max-w-lg" }) {
  if (!isOpen) {
    return null;
  }

  return (
    // DaisyUI modal structure with open class controlled by isOpen
    // We use a fixed position overlay and then the modal box
    <div className={`modal modal-open`}>
      {" "}
      {/* modal-open makes it visible */}
      <div className={`modal-box ${size} bg-base-100 shadow-xl relative`}>
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-3 border-b border-base-300">
          <h3 className="text-xl font-semibold text-primary">{title}</h3>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-4">{children}</div>

        {/* Optional: Modal Footer (can be added via children or specific props) */}
        {/* <div className="modal-action">
          <button onClick={onClose} className="btn">Close</button>
        </div> */}
      </div>
      {/* Optional: Click outside to close (can be tricky with DaisyUI's default method) */}
      {/* <div className="modal-backdrop fixed inset-0 bg-black/30" onClick={onClose}></div> */}
    </div>
  );
}

export default Modal;
