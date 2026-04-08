import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './PageTransition.css';

/**
 * Page Transition Wrapper
 * Adds smooth fade transitions when navigating between pages
 */
const PageTransition = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('fade-in');

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('fade-out');
    }
  }, [location, displayLocation]);

  const onAnimationEnd = () => {
    if (transitionStage === 'fade-out') {
      setTransitionStage('fade-in');
      setDisplayLocation(location);
      // Scroll to top on page change
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  return (
    <div
      className={`page-transition ${transitionStage}`}
      onAnimationEnd={onAnimationEnd}
    >
      {children}
    </div>
  );
};

export default PageTransition;
