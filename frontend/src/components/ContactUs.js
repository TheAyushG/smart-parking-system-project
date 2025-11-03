import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaPaperPlane } from 'react-icons/fa';
import './ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="contact-us-page">
      <div className="contact-container">
        <div className="contact-hero fade-in">
          <h1>Contact Us</h1>
          <p className="subtitle">Get in touch with our team</p>
        </div>

        <div className="contact-content">
          <div className="contact-info-section fade-in">
            <h2>Contact Information</h2>
            <div className="info-cards">
              <div className="info-card">
                <FaMapMarkerAlt className="info-icon" />
                <h3>Address</h3>
                <p>Jaipur, Rajasthan, India</p>
              </div>
              <div className="info-card">
                <FaPhone className="info-icon" />
                <h3>Phone</h3>
                <p>+91 123 456 7890</p>
              </div>
              <div className="info-card">
                <FaEnvelope className="info-icon" />
                <h3>Email</h3>
                <p>support@smartparking.in</p>
              </div>
            </div>
          </div>

          <div className="contact-form-section fade-in">
            <h2>Send us a Message</h2>
            {submitted ? (
              <div className="success-message">
                <FaPaperPlane /> Thank you for your message! We'll get back to you soon.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label>Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                  />
                </div>
                <div className="form-group">
                  <label>Your Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What is this about?"
                  />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Enter your message..."
                  ></textarea>
                </div>
                <button type="submit" className="submit-btn">
                  <FaPaperPlane /> Send Message
                </button>
              </form>
            )}
          </div>

          <div className="map-section fade-in">
            <h2>Find Us on Map</h2>
            <div className="map-container">
              <iframe
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.9539954848137!2d75.86597471434932!3d26.91285878313047!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db3f6e4b0b0b5%3A0x1c5c7e8b5f8c8c8c!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                width="100%"
                height="400"
                style={{ border: 0, borderRadius: '15px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;


