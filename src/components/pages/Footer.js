import React from "react";
import "../CSSFiles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <p>© 2025 Rahul Wadhekar</p>
      <div className="footer-links">
        <a href="mailto:rahulwadhekar.dev@gmail.com" target="_blank" rel="noopener noreferrer">
          📧 wadhekarrahul1818@gmail.com
        </a>
        <a href="https://github.com/rahulwadhekar" target="_blank" rel="noopener noreferrer">
          🌐 GitHub
        </a>
      </div>
    </footer>
  );
}

export default Footer;
