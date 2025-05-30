import React from 'react';
import '../css/HeroSection.css';

const HeroSection = () => {
  const scrollToAbout = (e) => {
    e.preventDefault();
    const aboutSection = document.getElementById('about');
    aboutSection.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">Your Trusted Cancer Care Assistant</h1>
          <p className="hero-description">
            Discover personalized insights on cancer signs, stages, and treatments with our AI-powered medical assistant, built using advanced Retrieval-Augmented Generation technology.
          </p>
          <a href="#about" className="hero-cta" onClick={scrollToAbout}>Learn More</a>
        </div>
        <div className="hero-image">
          <img
            src="https://media.istockphoto.com/id/1160744377/vector/the-doctor-does-chemotherapy-for-a-cancer-patient.jpg?s=612x612&w=0&k=20&c=YQIJL4vbsHAgCOBjY4W6ONoT1tdigCa_cOVM6m4-2BQ="
            alt="Cancer care illustration"
            className="hero-img"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;