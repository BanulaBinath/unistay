import { useState, useCallback } from 'react';

/**
 * Custom hook for managing toast notifications
 * Usage:
 * const { toasts, showToast, removeToast } = useToast();
 * showToast({ type: 'success', message: 'Operation successful!' });
 */
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(({ type = 'info', message, duration = 3000 }) => {
    const id = Date.now() + Math.random();
    const newToast = { id, type, message, duration };
    
    setToasts((prev) => [...prev, newToast]);
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    showToast,
    removeToast,
    clearAllToasts
  };
};

export default useToast;
