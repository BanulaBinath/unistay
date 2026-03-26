import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyTickets } from '../../services/ticketApi';
import { getStudentOrders } from '../../services/orderApi';
import TicketStatusBadge from '../tickets/TicketStatusBadge';
import TicketPriorityBadge from '../tickets/TicketPriorityBadge';
import './StudentDashboard.css';

/* ── Helper: initials from name ── */
const getInitials = (name = '') =>
  name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'U';

/* ── Helper: format date ── */
const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

/* ── Status → stripe class ── */
const stripeClass = (status) => status?.replace(/[^a-z_]/g, '') || 'open';

/* ── Complaint status filter tabs ── */
const STATUS_TABS = [
  { key: '',               label: 'All' },
  { key: 'open',          label: 'Open' },
  { key: 'in_progress',   label: 'In Progress' },
  { key: 'waiting_vendor', label: 'Waiting' },
  { key: 'escalated',    label: 'Escalated' },
  { key: 'resolved',     label: 'Resolved' },
  { key: 'closed',       label: 'Closed' },
  { key: 'rejected',     label: 'Rejected' },
];

/* ── Sidebar module definitions ──
   active: true  → clickable, renders real content
   active: false → future placeholder (disabled visually)
──────────────────────────────────────────────── */
const MODULES = [
  {
    key: 'complaints',
    label: 'Complaints',
    active: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    key: 'food',
    label: 'Food Status',
    active: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
        <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/>
        <line x1="14" y1="1" x2="14" y2="4"/>
      </svg>
    ),
  },
];

/* ════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════ */
function StudentDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  /* ── Active sidebar module ── */
  const [activeModule, setActiveModule] = useState('complaints');

  /* ── Ticket state (unchanged) ── */
  const [tickets,   setTickets]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [activeTab, setActiveTab] = useState('');

  /* ── Food orders state ── */
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');

  /* ── Fetch tickets (unchanged) ── */
  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const filters = activeTab ? { status: activeTab } : {};
      const res = await getMyTickets(filters);
      if (res.success) setTickets(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load complaints.');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  /* ── Fetch orders ── */
  const fetchOrders = useCallback(async () => {
    try {
      setOrdersLoading(true);
      setOrdersError('');
      const res = await getStudentOrders();
      if (res.success) {
        setOrders(res.data || []);
      } else {
        setOrdersError(res.message || 'Failed to load orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrdersError(err.response?.data?.message || 'Failed to load food orders.');
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeModule === 'food') {
      fetchOrders();
    }
  }, [activeModule, fetchOrders]);

  /* ── Derived stats (unchanged) ── */
  const totalTickets  = tickets.length;
  const openCount     = tickets.filter(t => t.status === 'open').length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved').length;
  const displayTickets = tickets;

  /* ── Role label ── */
  const roleLabel = user?.role === 'student_sliit' ? 'SLIIT Student' : 'External Student';

  const handleLogout = () => { logout(); navigate('/'); };

  /* ── Current module meta ── */
  const currentModule = MODULES.find(m => m.key === activeModule) || MODULES[0];

  return (
    <div className="sd-root">

      {/* ════════ TOP NAV BAR ════════ */}
      <header className="sd-topbar">
        <a href="/" className="sd-topbar-brand">
          <svg className="sd-logo-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9ZM17 15.99L12 18.72L7 15.99V12.27L12 15L17 12.27V15.99Z"/>
          </svg>
          Unistay
        </a>

        <div className="sd-topbar-right">
          <div className="sd-user-pill">
            <div className="sd-user-avatar">{getInitials(user?.fullName)}</div>
            <div className="sd-user-info">
              <span className="sd-user-name">{user?.fullName}</span>
              <span className="sd-user-role">{roleLabel}</span>
            </div>
          </div>
          <button className="sd-logout-btn" onClick={handleLogout} id="sd-logout-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign out
          </button>
        </div>
      </header>

      {/* ════════ PAGE SHELL ════════ */}
      <div className="sd-shell">

        {/* ──────── LEFT SIDEBAR ──────── */}
        <aside className="sd-sidebar" role="navigation" aria-label="Dashboard modules">



          {/* Nav label */}
          <p className="sd-sidebar-nav-label">My Dashboard</p>

          {/* Module nav items */}
          <nav className="sd-sidebar-nav">
            {MODULES.map(mod => (
              <button
                key={mod.key}
                id={`sd-sidebar-${mod.key}`}
                className={[
                  'sd-sidebar-item',
                  activeModule === mod.key ? 'active' : '',
                  !mod.active ? 'disabled' : '',
                ].join(' ').trim()}
                onClick={() => mod.active && setActiveModule(mod.key)}
                aria-disabled={!mod.active}
                title={!mod.active ? `${mod.label} — Coming Soon` : mod.label}
              >
                <span className="sd-sidebar-item-icon">{mod.icon}</span>
                <span className="sd-sidebar-item-label">{mod.label}</span>
                {!mod.active && (
                  <span className="sd-sidebar-soon-pill">Soon</span>
                )}
              </button>
            ))}
          </nav>


        </aside>

        {/* ──────── MAIN CONTENT AREA ──────── */}
        <main className="sd-main" id="sd-main-content">

          {/* Welcome hero — always visible */}
          <section className="sd-hero" id="sd-hero-banner">
            <div className="sd-hero-text">
              <div className="sd-hero-badge">
                <span className="sd-hero-badge-dot" />
                Student Portal
              </div>
              <h1 className="sd-hero-title">
                Welcome back, {user?.fullName?.split(' ')[0] || 'Student'}! 👋
              </h1>
              <p className="sd-hero-subtitle">
                Manage your accommodation experience, track complaints, and get support — all in one place.
              </p>
              <div className="sd-hero-meta">
                <span className="sd-hero-meta-item">
                  <svg className="sd-hero-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  {user?.email}
                </span>
                <span className="sd-hero-meta-item">
                  <svg className="sd-hero-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2"/>
                    <line x1="2" y1="10" x2="22" y2="10"/>
                  </svg>
                  {roleLabel}
                </span>
              </div>
            </div>

            {/* Decorative mini card */}
            <div className="sd-hero-visual">
              <div className="sd-hero-card-mockup">
                <div className="sd-mockup-label">Active Complaints</div>
                <div className="sd-mockup-stat">{loading ? '—' : openCount}</div>
                <div className="sd-mockup-desc">out of {loading ? '—' : totalTickets} total</div>
                <div className="sd-mockup-bar-row">
                  {[45, 70, 55, 85, 65, 90, 50].map((h, i) => (
                    <div key={i} className="sd-mockup-bar" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Module content area ── */}
          <div className="sd-module-area">

            {/* ===== COMPLAINTS MODULE (active) ===== */}
            {activeModule === 'complaints' && (
              <section className="sd-complaints-section" id="sd-complaints-section">

                {/* Header */}
                <div className="sd-complaints-head">
                  <div className="sd-complaints-head-top">
                    <div className="sd-complaints-head-info">
                      <span className="sd-complaints-label">Complaints &amp; Support</span>
                      <h2 className="sd-complaints-title">My Complaints</h2>
                      <p className="sd-complaints-desc">Track status, view progress, and submit new issues.</p>
                    </div>

                    <button
                      className="sd-new-complaint-btn"
                      id="sd-submit-complaint-btn"
                      onClick={() => navigate('/student/complaints/new')}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                      Submit New Complaint
                    </button>
                  </div>

                  {/* Status filter tabs */}
                  <div className="sd-status-tabs" role="tablist">
                    {STATUS_TABS.map(tab => (
                      <button
                        key={tab.key}
                        role="tab"
                        aria-selected={activeTab === tab.key}
                        className={`sd-tab${activeTab === tab.key ? ' active' : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                        id={`sd-tab-${tab.key || 'all'}`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Body */}
                <div className="sd-complaints-body">

                  {/* Error */}
                  {error && (
                    <div className="sd-error-banner">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      {error}
                    </div>
                  )}

                  {/* Loading */}
                  {loading ? (
                    <div className="sd-loading-state">
                      <div className="sd-loading-spinner" />
                      <p className="sd-loading-text">Loading your complaints…</p>
                    </div>

                  /* Empty */
                  ) : displayTickets.length === 0 ? (
                    <div className="sd-empty-state" id="sd-empty-complaints">
                      <div className="sd-empty-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                      </div>
                      <h3 className="sd-empty-title">
                        {activeTab ? `No ${activeTab.replace('_', ' ')} complaints` : 'No complaints yet'}
                      </h3>
                      <p className="sd-empty-desc">
                        {activeTab
                          ? 'Try switching to a different status tab.'
                          : 'Submit a complaint to get help from our support team.'}
                      </p>
                      <button
                        className="sd-empty-action-btn"
                        id="sd-empty-action-btn"
                        onClick={() => navigate('/student/complaints/new')}
                      >
                        Submit Your First Complaint
                      </button>
                    </div>

                  /* Ticket list */
                  ) : (
                    <div className="sd-tickets-list" id="sd-tickets-list">
                      {displayTickets.map(ticket => (
                        <div
                          key={ticket._id}
                          className="sd-ticket-row"
                          id={`sd-ticket-${ticket._id}`}
                          onClick={() => navigate(`/student/complaints/${ticket._id}`)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={e => e.key === 'Enter' && navigate(`/student/complaints/${ticket._id}`)}
                        >
                          {/* Left status stripe */}
                          <div className={`sd-ticket-status-stripe ${stripeClass(ticket.status)}`} />

                          {/* Main content */}
                          <div className="sd-ticket-main">
                            <div className="sd-ticket-top-row">
                              <span className="sd-ticket-number">{ticket.ticketNumber}</span>
                              <span className="sd-ticket-title-text">{ticket.title}</span>
                            </div>
                            <div className="sd-ticket-meta-row">
                              {/* Category */}
                              <span className="sd-ticket-meta-item">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                                  <line x1="7" y1="7" x2="7.01" y2="7"/>
                                </svg>
                                {ticket.serviceCategory}
                              </span>
                              {/* Date */}
                              <span className="sd-ticket-meta-item">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                  <line x1="16" y1="2" x2="16" y2="6"/>
                                  <line x1="8" y1="2" x2="8" y2="6"/>
                                  <line x1="3" y1="10" x2="21" y2="10"/>
                                </svg>
                                {formatDate(ticket.createdAt)}
                              </span>
                              {/* Vendor */}
                              {ticket.vendorId && (
                                <span className="sd-ticket-meta-item">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                    <circle cx="12" cy="7" r="4"/>
                                  </svg>
                                  {ticket.vendorId.businessName || ticket.vendorId.fullName}
                                </span>
                              )}
                              {/* Escalation */}
                              {ticket.escalationLevel > 0 && (
                                <span className="sd-ticket-meta-item" style={{ color: '#ef4444' }}>
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                                    <line x1="12" y1="9" x2="12" y2="13"/>
                                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                                  </svg>
                                  Escalation Lv.{ticket.escalationLevel}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Badges */}
                          <div className="sd-ticket-badges">
                            <TicketPriorityBadge priority={ticket.priority} />
                            <TicketStatusBadge status={ticket.status} />
                          </div>

                          {/* Chevron */}
                          <svg className="sd-ticket-chevron" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"/>
                          </svg>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {!loading && displayTickets.length > 0 && (
                  <div className="sd-complaints-footer">
                    <span className="sd-complaints-count-info">
                      Showing {displayTickets.length} complaint{displayTickets.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </section>
            )}

            {/* ===== FOOD STATUS MODULE ===== */}
            {activeModule === 'food' && (
              <section className="sd-food-section" id="sd-food-section">
                {/* Header */}
                <div className="sd-complaints-head">
                  <div className="sd-complaints-head-top">
                    <div className="sd-complaints-head-info">
                      <span className="sd-complaints-label">Food Orders</span>
                      <h2 className="sd-complaints-title">My Food Orders</h2>
                      <p className="sd-complaints-desc">Track your food orders and delivery status.</p>
                    </div>

                    <button
                      className="sd-new-complaint-btn"
                      id="sd-place-order-btn"
                      onClick={() => navigate('/services')}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                      Place New Order
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="sd-complaints-body">
                  {/* Error */}
                  {ordersError && (
                    <div className="sd-error-banner">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      {ordersError}
                    </div>
                  )}

                  {/* Loading */}
                  {ordersLoading ? (
                    <div className="sd-loading-state">
                      <div className="sd-loading-spinner" />
                      <p className="sd-loading-text">Loading your orders…</p>
                    </div>

                  /* Empty */
                  ) : orders.length === 0 ? (
                    <div className="sd-empty-state" id="sd-empty-orders">
                      <div className="sd-empty-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                          <line x1="6" y1="1" x2="6" y2="4"/>
                          <line x1="10" y1="1" x2="10" y2="4"/>
                          <line x1="14" y1="1" x2="14" y2="4"/>
                        </svg>
                      </div>
                      <h3 className="sd-empty-title">No food orders yet</h3>
                      <p className="sd-empty-desc">
                        You have not placed any food orders yet. Once you place an order, it will appear here.
                      </p>
                      <button
                        className="sd-empty-action-btn"
                        id="sd-empty-order-action-btn"
                        onClick={() => navigate('/services')}
                      >
                        Browse Food Menu
                      </button>
                    </div>

                  /* Orders list */
                  ) : (
                    <div className="sd-orders-list" id="sd-orders-list">
                      {orders.map(order => {
                        const statusClass = order.status?.toLowerCase() || 'pending';
                        return (
                          <div
                            key={order._id}
                            className="sd-order-card"
                            id={`sd-order-${order._id}`}
                            onClick={() => navigate(`/student/orders/${order._id}`)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={e => e.key === 'Enter' && navigate(`/student/orders/${order._id}`)}
                          >
                            {/* Order image */}
                            <div className="sd-order-image">
                              {order.itemImage ? (
                                <img 
                                  src={`http://localhost:5000/${order.itemImage}`} 
                                  alt={order.itemName}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div className="sd-order-image-placeholder" style={{ display: order.itemImage ? 'none' : 'flex' }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                                  <line x1="6" y1="1" x2="6" y2="4"/>
                                  <line x1="10" y1="1" x2="10" y2="4"/>
                                  <line x1="14" y1="1" x2="14" y2="4"/>
                                </svg>
                              </div>
                            </div>

                            {/* Order details */}
                            <div className="sd-order-details">
                              <h3 className="sd-order-item-name">{order.itemName}</h3>
                              <div className="sd-order-meta">
                                <span className="sd-order-meta-item">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="1"/>
                                    <circle cx="12" cy="5" r="1"/>
                                    <circle cx="12" cy="19" r="1"/>
                                  </svg>
                                  Qty: {order.quantity}
                                </span>
                                <span className="sd-order-meta-item">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                    <line x1="16" y1="2" x2="16" y2="6"/>
                                    <line x1="8" y1="2" x2="8" y2="6"/>
                                    <line x1="3" y1="10" x2="21" y2="10"/>
                                  </svg>
                                  {formatDate(order.createdAt)}
                                </span>
                                <span className="sd-order-meta-item">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="1" x2="12" y2="23"/>
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                                  </svg>
                                  Rs. {order.totalPrice}
                                </span>
                              </div>
                            </div>

                            {/* Status badge */}
                            <div className={`sd-order-status sd-order-status-${statusClass}`}>
                              {order.status || 'Pending'}
                            </div>

                            {/* Chevron */}
                            <svg className="sd-order-chevron" viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="9 18 15 12 9 6"/>
                            </svg>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {!ordersLoading && orders.length > 0 && (
                  <div className="sd-complaints-footer">
                    <span className="sd-complaints-count-info">
                      Showing {orders.length} order{orders.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </section>
            )}

          </div>{/* end sd-module-area */}

          {/* Help card — shown at bottom of complaints view */}
          {activeModule === 'complaints' && (
            <section className="sd-support-card" id="sd-support-card">
              <div className="sd-support-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div className="sd-support-text">
                <div className="sd-support-title">Need help with a complaint?</div>
                <div className="sd-support-desc">
                  Submit a detailed complaint and our support team will respond within 24 hours.
                  You can track progress and communicate directly in-app.
                </div>
              </div>
              <button
                className="sd-support-action"
                id="sd-support-action-btn"
                onClick={() => navigate('/student/complaints/new')}
              >
                Submit Complaint
              </button>
            </section>
          )}

        </main>{/* end sd-main */}
      </div>{/* end sd-shell */}
    </div>
  );
}

export default StudentDashboard;
