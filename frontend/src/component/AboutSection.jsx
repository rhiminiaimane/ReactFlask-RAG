import React from 'react';
import '../css/AboutSection.css';

const AboutSection = () => {
  return (
    <section className="about" id="about">
      <div className="about-container">
        <h2 className="about-title">How Our Cancer Care Assistant Helps You</h2>
        
        <div className="about-features">
          <div className="about-feature">
            <div className="feature-icon">🔍</div>
            <h3>Comprehensive Cancer Information</h3>
            <p>
              Get detailed explanations about different cancer types, stages, 
              and treatment options using our advanced medical knowledge base.
            </p>
          </div>
          
          <div className="about-feature">
            <div className="feature-icon">👨‍⚕️</div>
            <h3>Dual-Mode Assistance</h3>
            <p>
              Designed for both healthcare professionals needing quick references and 
              patients seeking understandable explanations.
            </p>
          </div>

          <div className="about-feature">
            <div className="feature-icon">⚠️</div>
            <h3>Symptom Assessment</h3>
            <p>
              Get guidance on when symptoms might warrant immediate medical attention 
              and how to manage treatment side effects.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;