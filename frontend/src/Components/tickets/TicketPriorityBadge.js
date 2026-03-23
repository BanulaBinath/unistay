import React from 'react';
import './TicketPriorityBadge.css';

const TicketPriorityBadge = ({ priority }) => {
  const getPriorityClass = () => {
    switch (priority) {
      case 'low':
        return 'priority-low';
      case 'medium':
        return 'priority-medium';
      case 'high':
        return 'priority-high';
      case 'urgent':
        return 'priority-urgent';
      default:
        return 'priority-default';
    }
  };

  return (
    <span className={`ticket-priority-badge ${getPriorityClass()}`}>
      {priority.toUpperCase()}
    </span>
  );
};

export default TicketPriorityBadge;
