import React, { useState } from 'react';
import '../assets/css/navbar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

function Navbar() {
    const navigate = useNavigate();
    const username = localStorage.getItem("username");
    const location = useLocation();
    const [isLogout, setIsLogout] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        setIsLogout(true);
    };

    const closeLogout = () => {
        setIsLogout(false);
    };

    const handleLogoutSubmit = () => {
        localStorage.removeItem("id");
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setIsLogout(false);
        navigate('/');
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleCloseMenu = () => {
        setIsMobileMenuOpen(false);
    };

    if (location.pathname === '/register' || location.pathname === '/login') {
        return null;
    }

    return (
        <>
            <Modal show={isLogout} onHide={closeLogout}>
                <Modal.Header closeButton>
                    <p className='text-danger'>Are you sure you want to Logout?</p>
                </Modal.Header>
                <Modal.Footer>
                    <button className='btn btn-secondary' onClick={closeLogout}>Close</button>
                    <button className='btn btn-danger' onClick={handleLogoutSubmit}>Logout</button>
                </Modal.Footer>
            </Modal>

            <nav className="navbar">
                <div className="navbar-container d-flex justify-content-between">
                    <div className="navbar-logo">
                        <h2>VMS Post</h2>
                    </div>

                    <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                        <i className={`fas fa-${isMobileMenuOpen ? 'times' : 'bars'} fa-2x`}></i>
                    </div>

                    <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                        {username ? (
                            <div className='username-logout-flex'>
                                <Link to="/" className="navbar-link mb-3 blog-button" onClick={handleCloseMenu}>Blog</Link>
                                <p className='username'>{username}</p>
                                <button className='btn mb-3 text-white logout-button' onClick={() => { handleLogout(); handleCloseMenu(); }}>Logout</button>
                            </div>
                        ) : (
                            <ul>
                                <li className="navbar-item">
                                    <Link to="/" className="navbar-link blog-button" onClick={handleCloseMenu}>Blog</Link>
                                </li>
                                <li className="navbar-item">
                                    <Link to="/register" className="navbar-link" onClick={handleCloseMenu}>Signup</Link>
                                </li>
                                <li className="navbar-item">
                                    <Link to="/login" className="navbar-link login-button p-2" onClick={handleCloseMenu}>Login</Link>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;
