import React from 'react';
import './TicketStatusBadge.css';

const TicketStatusBadge = ({ status }) => {
  const getStatusClass = () => {
    switch (status) {
      case 'open':
        return 'status-open';
      case 'in_progress':
        return 'status-in-progress';
      case 'waiting_vendor':
      case 'waiting_student':
        return 'status-waiting';
      case 'escalated':
        return 'status-escalated';
      case 'resolved':
        return 'status-resolved';
      case 'closed':
        return 'status-closed';
      case 'reopened':
        return 'status-reopened';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-default';
    }
  };

  const getStatusLabel = () => {
    return status.replace(/_/g, ' ').toUpperCase();
  };

  return (
    <span className={`ticket-status-badge ${getStatusClass()}`}>
      {getStatusLabel()}
    </span>
  );
};

export default TicketStatusBadge;
