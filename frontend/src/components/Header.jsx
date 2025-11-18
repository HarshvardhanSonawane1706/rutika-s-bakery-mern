import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
    const { currentUser, logout } = useAuth();
    const { getCartItemsCount } = useCart();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="header" style={{
            animation: 'fadeInUp 1s ease-out'
        }}>
            <div className="header-container">
                <Link to="/" className="logo" style={{
                    fontFamily: "'Dancing Script', cursive",
                    fontSize: '28px',
                    fontWeight: '700',
                    background: 'linear-gradient(45deg, #d2691e, #b8571f)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'glow 3s ease-in-out infinite alternate'
                }}>
                    Rutika's <span style={{
                        background: 'linear-gradient(45deg, #8b4513, #a0522d)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>Bakery</span>
                </Link>

                <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`} style={{
                    animation: 'slideInRight 1s ease-out 0.3s both'
                }}>
                    <ul>
                        <li><Link to="/" onClick={() => setIsMenuOpen(false)} style={{
                            animation: 'fadeInUp 0.8s ease-out 0.5s both'
                        }}>Home</Link></li>
                        <li><Link to="/menu" onClick={() => setIsMenuOpen(false)} style={{
                            animation: 'fadeInUp 0.8s ease-out 0.7s both'
                        }}>Menu</Link></li>
                        <li><a href="#about" onClick={() => setIsMenuOpen(false)} style={{
                            animation: 'fadeInUp 0.8s ease-out 0.9s both'
                        }}>About</a></li>
                        <li><a href="#contact" onClick={() => setIsMenuOpen(false)} style={{
                            animation: 'fadeInUp 0.8s ease-out 1.1s both'
                        }}>Contact</a></li>
                    </ul>
                </nav>

                <div className="header-actions" style={{
                    animation: 'slideInLeft 1s ease-out 0.6s both'
                }}>
                    <Link to="/cart" className="cart-icon" style={{
                        animation: 'bounceIn 1s ease-out 0.8s both'
                    }}>
                        <i className="fas fa-shopping-cart"></i>
                        {getCartItemsCount() > 0 && (
                            <span className="cart-count" style={{
                                animation: 'pulse 2s ease-in-out infinite'
                            }}>{getCartItemsCount()}</span>
                        )}
                    </Link>

                    {currentUser ? (
                        <div className="user-menu" style={{
                            animation: 'zoomIn 1s ease-out 1s both'
                        }}>
                            <Link to="/profile" className="auth-btn" style={{
                                animation: 'fadeInUp 0.8s ease-out 1.2s both'
                            }}>
                                My Account
                            </Link>
                            {currentUser.role === 'admin' && (
                                <Link to="/admin" className="admin-btn" style={{
                                    animation: 'fadeInUp 0.8s ease-out 1.4s both'
                                }}>
                                    Admin
                                </Link>
                            )}
                            <button onClick={handleLogout} className="logout-btn" style={{
                                animation: 'fadeInUp 0.8s ease-out 1.6s both'
                            }}>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="auth-buttons" style={{
                            animation: 'zoomIn 1s ease-out 1s both'
                        }}>
                            <Link to="/login" className="auth-btn" style={{
                                animation: 'fadeInUp 0.8s ease-out 1.2s both'
                            }}>
                                Login
                            </Link>
                        </div>
                    )}

                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        style={{
                            animation: 'rotateIn 1s ease-out 0.9s both'
                        }}
                    >
                        <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;