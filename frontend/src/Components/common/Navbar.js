import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen]       = useState(false);
  const [profileOpen, setProfileOpen]     = useState(false);
  const profileRef                        = useRef(null);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate                          = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu  = () => setIsMenuOpen(false);

  const isStudent = user?.role === 'student_sliit' || user?.role === 'student_external';

  // Fix: use fullName (matches your User model)
  const displayName = user?.fullName || user?.email || "Student";
  const initials    = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    closeMenu();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <svg className="logo-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9ZM17 15.99L12 18.72L7 15.99V12.27L12 15L17 12.27V15.99Z"/>
          </svg>
          Unistay
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          <div className={isMenuOpen ? 'hamburger active' : 'hamburger'}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/services" className="nav-link" onClick={closeMenu}>Services</Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link" onClick={closeMenu}>About Us</Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-link" onClick={closeMenu}>Contact</Link>
          </li>

          {isAuthenticated() && isStudent ? (
            <li className="nav-item nav-profile-item" ref={profileRef}>
              {/* Profile pill button */}
              <button
                className="nav-profile-btn"
                onClick={() => setProfileOpen((p) => !p)}
              >
                <div className="nav-avatar">{initials}</div>
                <span className="nav-profile-name">{displayName}</span>
                <span className="nav-chevron">{profileOpen ? "▲" : "▼"}</span>
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div className="nav-dropdown">
                  <div className="nav-dropdown-header">
                    <div className="nav-avatar nav-avatar-lg">{initials}</div>
                    <div className="nav-dropdown-info">
                      <p className="nav-dropdown-name">{displayName}</p>
                      <p className="nav-dropdown-email">{user?.email || ""}</p>
                    </div>
                  </div>
                  <div className="nav-dropdown-divider" />
                  <Link
                    to="/student/dashboard"
                    className="nav-dropdown-item"
                    onClick={() => { setProfileOpen(false); closeMenu(); }}
                  >
                    🎓 My Dashboard
                  </Link>
                  <div className="nav-dropdown-divider" />
                  <button className="nav-dropdown-item danger" onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </li>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link" onClick={closeMenu}>Sign in</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link-btn" onClick={closeMenu}>Sign up</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;