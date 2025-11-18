import React from 'react';

const Footer = () => {
  return (
    <footer className="footer" style={{
      animation: 'fadeInUp 1s ease-out'
    }}>
      <div className="footer-content">
        <h3 style={{
          fontFamily: "'Dancing Script', cursive",
          fontSize: '2rem',
          background: 'linear-gradient(45deg, #FFD700, #FFA500)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'glow 3s ease-in-out infinite alternate'
        }}>Rutika's Bakery</h3>
        <div className="footer-links" style={{
          animation: 'zoomIn 1s ease-out 0.3s both'
        }}>
          <a href="#about" style={{
            animation: 'fadeInUp 0.6s ease-out 0.5s both'
          }}>About Us</a>
          <a href="#contact" style={{
            animation: 'fadeInUp 0.6s ease-out 0.7s both'
          }}>Contact</a>
          <a href="#privacy" style={{
            animation: 'fadeInUp 0.6s ease-out 0.9s both'
          }}>Privacy Policy</a>
          <a href="#terms" style={{
            animation: 'fadeInUp 0.6s ease-out 1.1s both'
          }}>Terms of Service</a>
        </div>
        <div className="footer-bottom" style={{
          animation: 'fadeInUp 1s ease-out 0.8s both'
        }}>
          <p>&copy; 2024 Rutika's Bakery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
