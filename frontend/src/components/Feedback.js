import React, { useState } from 'react';
import { FaStar, FaSmile, FaFrown, FaMeh, FaPaperPlane } from 'react-icons/fa';
import './Feedback.css';

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    feedbackType: 'suggestion',
    message: ''
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRatingClick = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.rating === 0) {
      alert('Please provide a rating');
      return;
    }
    console.log('Feedback submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', rating: 0, feedbackType: 'suggestion', message: '' });
    }, 3000);
  };

  const getRatingIcon = (rating) => {
    if (rating <= 2) return <FaFrown />;
    if (rating === 3) return <FaMeh />;
    return <FaSmile />;
  };

  return (
    <div className="feedback-page">
      <div className="feedback-container">
        <div className="feedback-hero fade-in">
          <h1>Your Feedback Matters</h1>
          <p className="subtitle">Help us improve Smart Parking</p>
        </div>

        {submitted ? (
          <div className="success-message fade-in">
            <FaPaperPlane /> Thank you for your feedback! We appreciate your input.
          </div>
        ) : (
          <div className="feedback-form-container fade-in">
            <form onSubmit={handleSubmit} className="feedback-form">
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
                <label>Rating</label>
                <div className="rating-container">
                  <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star ${star <= (hoveredRating || formData.rating) ? 'active' : ''}`}
                        onClick={() => handleRatingClick(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                      >
                        <FaStar />
                      </span>
                    ))}
                  </div>
                  {formData.rating > 0 && (
                    <div className="rating-text">
                      {getRatingIcon(formData.rating)} {formData.rating}/5
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Feedback Type</label>
                <select
                  name="feedbackType"
                  value={formData.feedbackType}
                  onChange={handleChange}
                  className="feedback-select"
                >
                  <option value="suggestion">Suggestion</option>
                  <option value="bug">Bug Report</option>
                  <option value="complaint">Complaint</option>
                  <option value="compliment">Compliment</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Your Feedback</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Tell us what you think..."
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                <FaPaperPlane /> Submit Feedback
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;


