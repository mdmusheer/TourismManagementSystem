import React from 'react';
import './Footer.css';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa'; // Import social media icons

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="row">
          <div className="col-md-4">
            <div className="footer-title">Contact Details</div>
            <div className="footer-info">TourVista</div>
            <div className="footer-info">Mobile: 8916530126</div>
            <div className="footer-info">
              <a href="mailto:info@journeyjive.com" className="footer-link">Email: info@TourVista.com</a>
            </div>
          </div>
          <div className="col-md-4">
            <div className="footer-title">Address</div>
            <div className="footer-info">Hyderabad</div>
            <div className="footer-info">Telangana</div>
          </div>
          <div className="col-md-4">
            <div className="footer-title">Follow Us</div>
            <div className="social-media-icons">
              <a href="https://facebook.com/TourVista" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-media-facebook">
                <FaFacebookF />
                <span className="d-none d-md-inline ms-2">Facebook</span>
              </a>
              <a href="https://twitter.com/TourVista" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="social-media-twitter">
                <FaTwitter />
                <span className="d-none d-md-inline ms-2">Twitter</span>
              </a>
              <a href="https://instagram.com/TourVista" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-media-instagram">
                <FaInstagram />
                <span className="d-none d-md-inline ms-2">Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
