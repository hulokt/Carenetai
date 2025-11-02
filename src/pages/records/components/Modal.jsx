import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { IconX } from "@tabler/icons-react";

const Modal = ({ title, children, isOpen, onClose, onAction, actionLabel, disabled = false }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Render modal using portal to ensure it's at the root level
  return createPortal(
    <div 
      className="fixed z-[9999] flex items-center justify-center"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: '1rem',
        overflow: 'hidden',
      }}
    >
      {/* Light Mode Backdrop - Full Page Coverage */}
      <div 
        className="bg-white/70"
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      ></div>

      {/* Modal Content */}
      <div 
        className="relative z-10 w-11/12 max-w-lg rounded-3xl bg-white/95 backdrop-blur-xl border border-white/60 shadow-premium-lg animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 font-jakarta">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
            >
              <IconX size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="mb-6">{children}</div>

          {/* Footer */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:-translate-y-0.5"
            >
              Cancel
            </button>
            <button
              onClick={onAction}
              disabled={disabled}
              className="btn-primary inline-flex items-center justify-center gap-x-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLabel}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
