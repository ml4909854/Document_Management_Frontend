import React, { useState, useEffect } from 'react';
import Spinner from '../../components/Spinner/Spinner';
import './Home.css';

const Home = () => {
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    const spinner = setTimeout(() => {
      setShowSpinner(false);
    }, 500);

    return () => {
      clearTimeout(spinner);
    };
  }, []);

  if (showSpinner) {
    return <Spinner />;
  }

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">Welcome to DocuShare</h1>
        <p className="hero-subtitle">
          Securely create, manage, and share your documents from anywhere.
        </p>
        <a href="/signup" className="cta-button">
          Get Started
        </a>
      </div>
    </div>
  );
};

export default Home;
