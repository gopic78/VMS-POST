import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => {
            window.removeEventListener("scroll", toggleVisibility);
        };
    }, []);

    const toggleVisibility = () => {
        if (window.pageYOffset > 200) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"  
        });
    };

    if (location.pathname === '/register' || location.pathname === '/login') {
        return null;
    }

    return (
        <>
            <footer className="bg-dark text-light text-center py-3">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <p className='mt-2'>&copy; 2024 VMS POST. All rights reserved.</p>
                        </div>
                        <div className="col-md-6">
                            <div className="social-links">
                                <Link  className="text-light me-2"><i className="fab fa-facebook"></i></Link>
                                <Link  className="text-light me-2"><i className="fab fa-twitter"></i></Link>
                                <Link  className="text-light me-2"><i className="fab fa-instagram"></i></Link>
                                <Link className="text-light me-2"><i className="fab fa-linkedin"></i></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            <div className="go-to-top">
                {isVisible && (
                    <button className="btn btn-primary" onClick={scrollToTop}>
                        <i className="fa-solid fa-circle-arrow-up"></i> 
                    </button>
                )}
            </div>
        </>
    );
};

export default Footer;
