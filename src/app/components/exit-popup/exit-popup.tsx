'use client';

import React from 'react';
import './exit-popup.css';

export interface ExitPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    onCancel: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
}

const ExitPopup: React.FC<ExitPopupProps> = ({
    isOpen,
    onClose,
    onConfirm,
    onCancel,
    title = '提示',
    message = '是否要離開遊戲？',
    confirmText = '確定',
    cancelText = '取消'
}) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const handleCancel = () => {
        onCancel();
        onClose();
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="popup-container" onClick={handleOverlayClick}>
            <div className="popup">
                <div className="popup-header">
                    {title}
                </div>
                <div className="popup-body">
                    <p>{message}</p>
                </div>
                <div className="popup-footer">
                    <button 
                        className="popup-button btn-cancel" 
                        onClick={handleCancel}
                    >
                        {cancelText}
                    </button>
                    <button 
                        className="popup-button btn-confirm" 
                        onClick={handleConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExitPopup;
