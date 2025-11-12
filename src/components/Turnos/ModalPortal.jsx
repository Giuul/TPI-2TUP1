import React from "react";
import ReactDOM from "react-dom";
const ModalPortal = ({ isOpen, onClose, title, children, actions }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>✕</button>
                {title && <h2 className="modal-title">{title}</h2>}
                {children && <div className="modal-body">{children}</div>}
                {actions && <div className="modal-actions">{actions}</div>}
            </div>
        </div>,
        document.body
    );
};

export default ModalPortal;
