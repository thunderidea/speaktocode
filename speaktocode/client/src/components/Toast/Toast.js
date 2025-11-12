import React, { useEffect, useState } from 'react';
import './Toast.css';

let toastQueue = [];
let showToastCallback = null;

export const showToast = (message, type = 'info') => {
  if (showToastCallback) {
    showToastCallback(message, type);
  }
};

const Toast = () => {
  const [currentToast, setCurrentToast] = useState(null);
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    showToastCallback = (message, type) => {
      toastQueue.push({ message, type });
      if (!isShowing) {
        displayNextToast();
      }
    };

    return () => {
      showToastCallback = null;
    };
  }, [isShowing]);

  const displayNextToast = () => {
    if (toastQueue.length === 0) {
      setIsShowing(false);
      return;
    }

    const toast = toastQueue.shift();
    setCurrentToast(toast);
    setIsShowing(true);

    // Auto dismiss after 1 second
    setTimeout(() => {
      setCurrentToast(null);
      setIsShowing(false);
      
      // Show next toast if any
      if (toastQueue.length > 0) {
        setTimeout(displayNextToast, 100);
      }
    }, 1000);
  };

  const getIcon = (type) => {
    switch(type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      default: return 'ℹ';
    }
  };

  if (!currentToast) return null;

  return (
    <div className="toast-container">
      <div className={`toast ${currentToast.type}`}>
        <span className="toast-icon">{getIcon(currentToast.type)}</span>
        <span className="toast-message">{currentToast.message}</span>
      </div>
    </div>
  );
};

export default Toast;
