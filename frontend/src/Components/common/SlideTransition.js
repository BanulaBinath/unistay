import React from 'react';
import './SlideTransition.css';

const SlideTransition = ({ children, direction = 'left' }) => {
  return (
    <div className={`slide-transition slide-transition-${direction}`}>
      {children}
    </div>
  );
};

export default SlideTransition;
