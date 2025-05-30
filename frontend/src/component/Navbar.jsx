import React, { useState } from 'react';
import '../css/Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <span>MedRaG</span>
        </div>

        {/* Desktop Menu */}
        <div className="navbar-menu">
          <Link to = '/'><a href="#" className="navbar-link">Home</a></Link>
          <a href="#" className="navbar-link">About</a>
          <Link to = '/chatbot'><a href="#" className="navbar-link button-style">ChatBot</a></Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="navbar-toggle">
          <button
            onClick={toggleMenu}
            className="navbar-button"
            aria-label="Toggle menu"
          >
            <svg className="navbar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`navbar-mobile ${isOpen ? 'navbar-mobile-open' : ''}`}>
          <a href="#" className="navbar-mobile-link">Home</a>
          <a href="#" className="navbar-mobile-link">About</a>
          <Link to = '/chatbot'><a href="#" className="navbar-mobile-link button-style">ChatBot</a></Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;