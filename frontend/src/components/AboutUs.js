import React from 'react';
import { FaUsers, FaLightbulb, FaRocket } from 'react-icons/fa';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us-page">
      <div className="about-container">
        <div className="about-hero fade-in">
          <h1>About Smart Parking</h1>
          <p className="subtitle">Revolutionizing parking management in Jaipur</p>
        </div>

        <div className="about-content">
          <section className="about-section fade-in">
            <h2>Our Mission</h2>
            <p>
              Smart Parking Management System aims to simplify parking for residents and visitors 
              in Jaipur. We leverage real-time technology to provide seamless parking experiences, 
              reduce congestion, and optimize space utilization across the city.
            </p>
          </section>

          <section className="about-section fade-in">
            <h2>What We Do</h2>
            <div className="features-grid">
              <div className="feature-card">
                <FaRocket className="feature-icon" />
                <h3>Real-Time Availability</h3>
                <p>Get instant updates on parking slot availability across multiple locations</p>
              </div>
              <div className="feature-card">
                <FaLightbulb className="feature-icon" />
                <h3>Dynamic Pricing</h3>
                <p>Fair pricing based on demand ensures optimal space utilization</p>
              </div>
              <div className="feature-card">
                <FaUsers className="feature-icon" />
                <h3>User-Friendly</h3>
                <p>Simple, intuitive interface designed for everyone's convenience</p>
              </div>
            </div>
          </section>

          <section className="about-section fade-in">
            <h2>Our Technology</h2>
            <p>
              Built with modern web technologies including React.js, Node.js, Express, and MongoDB, 
              our platform ensures reliability, scalability, and an excellent user experience. 
              We continuously work on improving our system based on user feedback and technological advancements.
            </p>
          </section>

          <section className="about-section fade-in">
            <h2>Coverage Areas</h2>
            <p>
              Currently serving major locations in Jaipur including Jagatpura, Malviya Nagar, 
              Ramniwas Garden, Raja Park, and Bani Park. We're expanding our network to cover 
              more areas across the city.
            </p>
          </section>

          <section className="about-section fade-in">
            <h2>Contact Us</h2>
            <p>
              Have questions or suggestions? Feel free to reach out through our{' '}
              <a href="/contact">Contact Us</a> page. We're always happy to help!
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;


