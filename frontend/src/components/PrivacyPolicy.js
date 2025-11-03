import React from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-page">
      <div className="policy-container">
        <div className="policy-header fade-in">
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last updated: November 2024</p>
        </div>

        <div className="policy-content">
          <section className="policy-section fade-in">
            <h2>1. Introduction</h2>
            <p>
              Welcome to Smart Parking Management System. We respect your privacy and are committed 
              to protecting your personal data. This privacy policy explains how we collect, use, 
              and safeguard your information when you use our services.
            </p>
          </section>

          <section className="policy-section fade-in">
            <h2>2. Information We Collect</h2>
            <h3>2.1 Personal Information</h3>
            <ul>
              <li>Name and contact details (email, phone number)</li>
              <li>Account credentials (username, password)</li>
              <li>Payment information (for booking transactions)</li>
              <li>Vehicle information (if provided)</li>
            </ul>
            <h3>2.2 Usage Data</h3>
            <ul>
              <li>Booking history and preferences</li>
              <li>Location data when using our services</li>
              <li>Device information and IP address</li>
              <li>Browser type and version</li>
            </ul>
          </section>

          <section className="policy-section fade-in">
            <h2>3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Provide and manage parking booking services</li>
              <li>Process payments and send booking confirmations</li>
              <li>Communicate with you about your bookings</li>
              <li>Improve our services and user experience</li>
              <li>Send important updates and notifications</li>
              <li>Ensure security and prevent fraud</li>
            </ul>
          </section>

          <section className="policy-section fade-in">
            <h2>4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal 
              data against unauthorized access, alteration, disclosure, or destruction. This includes 
              encryption, secure servers, and regular security audits.
            </p>
          </section>

          <section className="policy-section fade-in">
            <h2>5. Data Sharing</h2>
            <p>
              We do not sell your personal data. We may share your information only in the following 
              circumstances:
            </p>
            <ul>
              <li>With service providers who assist in our operations</li>
              <li>When required by law or legal process</li>
              <li>To protect our rights and safety</li>
              <li>With your explicit consent</li>
            </ul>
          </section>

          <section className="policy-section fade-in">
            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Data portability</li>
            </ul>
          </section>

          <section className="policy-section fade-in">
            <h2>7. Cookies</h2>
            <p>
              We use cookies to enhance your experience, analyze usage, and assist in our marketing 
              efforts. You can control cookies through your browser settings.
            </p>
          </section>

          <section className="policy-section fade-in">
            <h2>8. Contact Us</h2>
            <p>
              If you have questions about this privacy policy or wish to exercise your rights, 
              please contact us at <a href="mailto:privacy@smartparking.in">privacy@smartparking.in</a> 
              or visit our <a href="/contact">Contact Us</a> page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;


