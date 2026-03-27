import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaKey } from 'react-icons/fa';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const result = await forgotPassword(email);
    
    if (result.success) {
      // In a real app this would just say "Email sent". 
      // For testing, we show the token or a link directly since we don't send emails.
      setMessage(result.message);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <FaKey className="auth-icon" />
            <h2>Forgot Password</h2>
            <p>Enter your email to reset your password.</p>
          </div>

          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message" style={{color: '#155724', backgroundColor: '#d4edda', padding: '10px', borderRadius: '4px', marginBottom: '15px'}}>{message}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>
                <FaEnvelope /> Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Sending...' : 'Reset Password'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Remembered your password? <Link to="/login">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
