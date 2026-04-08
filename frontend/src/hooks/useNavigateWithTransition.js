import { useNavigate } from 'react-router-dom';

/**
 * Custom hook for navigation with smooth transitions
 * Adds a small delay to allow exit animation to complete
 * 
 * Usage:
 * const navigate = useNavigateWithTransition();
 * navigate('/path');
 */
export const useNavigateWithTransition = () => {
  const navigate = useNavigate();

  const navigateWithTransition = (to, options = {}) => {
    // Small delay to allow exit animation
    const delay = options.delay || 0;
    
    if (delay > 0) {
      setTimeout(() => {
        navigate(to, options);
      }, delay);
    } else {
      navigate(to, options);
    }
  };

  return navigateWithTransition;
};

export default useNavigateWithTransition;
