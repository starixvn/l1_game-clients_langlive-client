'use client';

import React from 'react';
import './exit-popup.css';
import { getExitPopupTranslations } from '../../_shared';

export interface ExitPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    onCancel: () => void;
    language?: string;
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
    language = 'zh-TW',
    title,
    message,
    confirmText,
    cancelText
}) => {
    // Get translations based on language
    const translations = getExitPopupTranslations(language);
    
    // Use provided text or fallback to translations
    const finalTitle = title || translations.title;
    const finalMessage = message || translations.message;
    const finalConfirmText = confirmText || translations.confirmText;
    const finalCancelText = cancelText || translations.cancelText;
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
                    {finalTitle}
                </div>
                <div className="popup-body">
                    <p>{finalMessage}</p>
                </div>
                <div className="popup-footer">
                    <button 
                        className="popup-button btn-cancel" 
                        onClick={handleCancel}
                    >
                        {finalCancelText}
                    </button>
                    <button 
                        className="popup-button btn-confirm" 
                        onClick={handleConfirm}
                    >
                        {finalConfirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExitPopup;
