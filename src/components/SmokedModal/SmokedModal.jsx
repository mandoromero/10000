import React from "react";
import "./SmokedModal.css";

export default function SmokedModal({ show, onClose }) {
    if (!show) return null;

    return (
        <div className="smoked-overlay">
            <div className="smoked-modal">
                <h2>You smoked it!! Your turn is over.</h2>
                <button 
                    className="smoked-btn"
                    onClick={onClose}
                >
                    OK
                </button>
            </div>
        </div>
    )
}