import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../CSSFiles/Navbar.css';

function Navbar() {
  const [click, setClick] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [darkMode]);

  return (
    <nav className='navbar'>
      <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
        <i className="bi bi-cloud-moon-fill"></i> QuizCraft
      </Link>

      <div className='menu-icon' onClick={handleClick}>
        <i className={click ? 'bi bi-x' : 'bi bi-list'} />
      </div>

      <ul className={click ? 'nav-menu active' : 'nav-menu'}>
        <li className='nav-item'>
          <Link
            to='/'
            className={`nav-links ${location.pathname === '/' ? 'active-link' : ''}`}
            onClick={closeMobileMenu}
          >
            Home
          </Link>
        </li>
        <li className='nav-item'>
          <Link
            to='/about'
            className={`nav-links ${location.pathname === '/about' ? 'active-link' : ''}`}
            onClick={closeMobileMenu}
          >
            About
          </Link>
        </li>
        <li className='theme-toggle'>
          <button className='theme-button' onClick={toggleTheme} aria-label="Toggle Theme">
            <i className={darkMode ? 'bi bi-brightness-high-fill' : 'bi bi-moon-fill'}></i>
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
