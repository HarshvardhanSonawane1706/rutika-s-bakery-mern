import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home">
            <section className="hero">
                <div className="hero-content">
                    <h1 className="bakery-name" style={{
                        fontFamily: "'Dancing Script', cursive",
                        fontWeight: '700',
                        fontSize: '5rem',
                        textShadow: '3px 3px 6px rgba(0,0,0,0.7), 0 0 20px rgba(210, 105, 30, 0.5)',
                        background: 'linear-gradient(45deg, #FFD700, #FFA500, #FF6347)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        animation: 'fadeInUp 1s ease-out, glow 2s ease-in-out infinite alternate'
                    }}>
                        Rutika's Bakery
                    </h1>
                    <p className="hero-tagline" style={{
                        fontSize: '1.8rem',
                        fontWeight: '300',
                        fontStyle: 'italic',
                        animation: 'fadeInUp 1s ease-out 0.3s both, pulse 3s ease-in-out infinite'
                    }}>
                        Freshly baked delights delivered to your doorstep
                    </p>
                    <Link to="/menu" className="cta-button" style={{
                        animation: 'fadeInUp 1s ease-out 0.6s both, float 3s ease-in-out infinite'
                    }}>
                        Order Now
                    </Link>
                </div>
            </section>

            <section className="features">
                <div className="container">
                    <div className="feature-grid">
                        <div className="feature-card" style={{
                            animation: 'slideInLeft 1s ease-out 0.8s both, float 4s ease-in-out infinite 1s'
                        }}>
                            <i className="fas fa-bread-slice" style={{
                                animation: 'rotateIn 1s ease-out 1.5s both'
                            }}></i>
                            <h3>Fresh Daily</h3>
                            <p>Baked fresh every morning with the finest ingredients</p>
                        </div>
                        <div className="feature-card" style={{
                            animation: 'bounceIn 1s ease-out 1s both, pulse 3s ease-in-out infinite 2s'
                        }}>
                            <i className="fas fa-truck" style={{
                                animation: 'zoomIn 1s ease-out 1.7s both'
                            }}></i>
                            <h3>Free Delivery</h3>
                            <p>Free delivery on orders over $25 within the city</p>
                        </div>
                        <div className="feature-card" style={{
                            animation: 'slideInRight 1s ease-out 1.2s both, float 4s ease-in-out infinite 1.5s'
                        }}>
                            <i className="fas fa-heart" style={{
                                animation: 'rotateIn 1s ease-out 1.9s both'
                            }}></i>
                            <h3>Made with Love</h3>
                            <p>Every product is crafted with passion and care</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;