import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
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
            <Link to="/services" className="nav-link" onClick={closeMenu}>
              Services
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link" onClick={closeMenu}>
              About Us
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-link" onClick={closeMenu}>
              Contact
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/login" className="nav-link" onClick={closeMenu}>
              Sign in
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/register" className="nav-link-btn" onClick={closeMenu}>
              Sign up
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
