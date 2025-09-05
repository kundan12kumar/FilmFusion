import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { authAPI } from '../services/api';

const SimpleLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

    try {
      const response = await authAPI.login(formData);
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed');
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
      setError(error.response?.data?.error || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed');
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
            maxWidth: '400px',
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
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
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
              Welcome Back
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Or{' '}
              <Link
                to="/register"
                style={{
                  color: 'var(--accent-primary)',
                  textDecoration: 'none',
                  fontWeight: '500',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = 'var(--accent-hover)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--accent-primary)'}
              >
                create a new account
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

            <motion.div
              style={{ marginBottom: '16px' }}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <label htmlFor="email" style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px',
                color: 'var(--text-primary)',
                transition: 'color 0.3s ease'
              }}>
                📧 Email address
              </label>
              <motion.div style={{ position: 'relative' }}>
                <motion.input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: `2px solid ${focusedField === 'email' ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  placeholder="Enter your email"
                  whileFocus={{ scale: 1.02 }}
                  animate={{
                    borderColor: focusedField === 'email' ? 'var(--accent-primary)' : 'var(--border-primary)'
                  }}
                />
                {focusedField === 'email' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--accent-primary)',
                      fontSize: '18px'
                    }}
                  >
                    ✨
                  </motion.div>
                )}
              </motion.div>
            </motion.div>

            <motion.div
              style={{ marginBottom: '24px' }}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <label htmlFor="password" style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px',
                color: 'var(--text-primary)'
              }}>
                🔒 Password
              </label>
              <motion.div style={{ position: 'relative' }}>
                <motion.input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  style={{
                    width: '100%',
                    padding: '12px 48px 12px 16px',
                    borderRadius: '8px',
                    border: `2px solid ${focusedField === 'password' ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  placeholder="Enter your password"
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '18px',
                    padding: '4px'
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </motion.button>
              </motion.div>
            </motion.div>

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
                      ⭐
                    </motion.div>
                    Signing in...
                  </motion.div>
                ) : (
                  <motion.div
                    key="signin"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    🎬 Sign in to FilmFusion
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
              text="signin_with"
              shape="rectangular"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </GoogleOAuthProvider>
  );
};

export default SimpleLogin;
