import React from 'react';
import './PrivacyPolicy.css';

const TermsConditions = () => {
  return (
    <div className="terms-page">
      <div className="policy-container">
        <div className="policy-header fade-in">
          <h1>Terms & Conditions</h1>
          <p className="last-updated">Last updated: November 2024</p>
        </div>

        <div className="policy-content">
          <section className="policy-section fade-in">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using the Smart Parking Management System, you accept and agree to 
              be bound by these Terms and Conditions. If you do not agree with any part of these 
              terms, you must not use our services.
            </p>
          </section>

          <section className="policy-section fade-in">
            <h2>2. Use of Service</h2>
            <h3>2.1 Eligibility</h3>
            <p>You must be at least 18 years old to use our services. By using our platform, you 
            represent that you meet this age requirement.</p>
            
            <h3>2.2 Account Responsibility</h3>
            <ul>
              <li>You are responsible for maintaining the confidentiality of your account</li>
              <li>You must provide accurate and complete information</li>
              <li>You are responsible for all activities under your account</li>
              <li>You must notify us immediately of any unauthorized access</li>
            </ul>
          </section>

          <section className="policy-section fade-in">
            <h2>3. Booking and Payment</h2>
            <h3>3.1 Booking Process</h3>
            <ul>
              <li>Bookings are subject to availability</li>
              <li>We reserve the right to cancel bookings in case of errors or fraud</li>
              <li>Booking confirmations will be sent to your registered email</li>
            </ul>
            
            <h3>3.2 Payment Terms</h3>
            <ul>
              <li>All payments must be made through our secure payment gateway</li>
              <li>Prices are displayed in Indian Rupees (₹)</li>
              <li>Dynamic pricing may apply based on demand</li>
              <li>Refunds are subject to our cancellation policy</li>
            </ul>
          </section>

          <section className="policy-section fade-in">
            <h2>4. Cancellation and Refunds</h2>
            <ul>
              <li>Cancellations must be made before the booking start time</li>
              <li>Refunds will be processed within 5-7 business days</li>
              <li>No refunds for no-shows or expired bookings</li>
              <li>Partial refunds may apply based on cancellation timing</li>
            </ul>
          </section>

          <section className="policy-section fade-in">
            <h2>5. User Conduct</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the service for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to the system</li>
              <li>Interfere with the service's operation</li>
              <li>Use automated systems to book slots</li>
              <li>Share your account credentials with others</li>
            </ul>
          </section>

          <section className="policy-section fade-in">
            <h2>6. Limitation of Liability</h2>
            <p>
              Smart Parking Management System is provided "as is" without warranties of any kind. 
              We are not liable for any damages resulting from the use or inability to use our 
              services, including but not limited to parking violations, vehicle damage, or 
              lost opportunities.
            </p>
          </section>

          <section className="policy-section fade-in">
            <h2>7. Intellectual Property</h2>
            <p>
              All content, features, and functionality of the service are owned by Smart Parking 
              and are protected by copyright, trademark, and other intellectual property laws. 
              You may not reproduce, distribute, or create derivative works without permission.
            </p>
          </section>

          <section className="policy-section fade-in">
            <h2>8. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective 
              immediately upon posting. Your continued use of the service constitutes acceptance 
              of the modified terms.
            </p>
          </section>

          <section className="policy-section fade-in">
            <h2>9. Contact Information</h2>
            <p>
              For questions about these Terms and Conditions, please contact us at{' '}
              <a href="mailto:legal@smartparking.in">legal@smartparking.in</a> or visit our{' '}
              <a href="/contact">Contact Us</a> page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;


