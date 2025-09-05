import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { authAPI } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.googleLogin(credentialResponse.credential);
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.error || 'Google registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google registration failed');
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 16px',
          background: theme === 'dark'
            ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
            : 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)'
        }}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            maxWidth: '450px',
            width: '100%',
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: theme === 'dark'
              ? '0 20px 40px rgba(0, 0, 0, 0.3)'
              : '0 20px 40px rgba(0, 0, 0, 0.1)',
            border: '1px solid var(--border-primary)'
          }}
        >
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ textAlign: 'center', marginBottom: '32px' }}
          >
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}
            >
              <img
                src="/FilmFusion.png"
                alt="FilmFusion Logo"
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '12px',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                }}
              />
            </motion.div>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              marginBottom: '8px',
              color: 'var(--text-primary)'
            }}>
              Join FilmFusion
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <Link
                to="/login"
                style={{
                  color: 'var(--accent-primary)',
                  textDecoration: 'none',
                  fontWeight: '500',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = 'var(--accent-hover)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--accent-primary)'}
              >
                Sign in here
              </Link>
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{ marginBottom: '24px' }}
          >
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2',
                    border: `1px solid ${theme === 'dark' ? 'rgba(239, 68, 68, 0.3)' : '#fecaca'}`,
                    color: theme === 'dark' ? '#fca5a5' : '#dc2626',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  ⚠️ {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="name" style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                marginBottom: '4px' 
              }}>
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your full name"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="email" style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                marginBottom: '4px' 
              }}>
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your email"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="password" style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                marginBottom: '4px' 
              }}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Create a password"
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label htmlFor="confirmPassword" style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                marginBottom: '4px' 
              }}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
                placeholder="Confirm your password"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: loading ? 'var(--bg-tertiary)' : 'var(--accent-primary)',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              whileHover={!loading ? {
                scale: 1.02,
                backgroundColor: 'var(--accent-hover)'
              } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      style={{ fontSize: '18px' }}
                    >
                      🎬
                    </motion.div>
                    Creating account...
                  </motion.div>
                ) : (
                  <motion.div
                    key="create"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    ✨ Create Account
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.form>

          <motion.div
            style={{ marginBottom: '24px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            <div style={{ position: 'relative', textAlign: 'center' }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center'
              }}>
                <div style={{ width: '100%', borderTop: `1px solid var(--border-primary)` }} />
              </div>
              <div style={{
                position: 'relative',
                display: 'inline-block',
                padding: '0 16px',
                backgroundColor: 'var(--bg-primary)'
              }}>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Or continue with</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.9 }}
            style={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme={theme === 'dark' ? 'filled_black' : 'outline'}
              size="large"
              width="100%"
              text="signup_with"
              shape="rectangular"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </GoogleOAuthProvider>
  );
};

export default Register;
