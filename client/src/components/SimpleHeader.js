import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import SearchBar from './SearchBar';

const SimpleHeader = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.hamburger-button')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header style={{
        backgroundColor: 'var(--bg-primary)',
        boxShadow: '0 4px 20px var(--shadow-light)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border-primary)',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '72px'
        }}>
          {/* Logo - Always visible */}
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            fontSize: '28px',
            fontWeight: 'bold',
            color: 'var(--accent-primary)',
            transition: 'all 0.3s ease',
            transform: 'scale(1)'
          }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            <img
              src="/FilmFusion.png"
              alt="FilmFusion Logo"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
              }}
            />
            FilmFusion
          </Link>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link to="/" style={{
              color: theme === 'dark' ? '#f9fafb' : '#374151',
              textDecoration: 'none'
            }}>
              Home
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/watchlist" style={{
                  color: theme === 'dark' ? '#f9fafb' : '#374151',
                  textDecoration: 'none'
                }}>
                  Watchlist
                </Link>
                <Link to="/trending" style={{
                  color: theme === 'dark' ? '#f9fafb' : '#374151',
                  textDecoration: 'none'
                }}>
                  Trending
                </Link>
                <Link to="/recommendations" style={{
                  color: theme === 'dark' ? '#f9fafb' : '#374151',
                  textDecoration: 'none'
                }}>
                  For You
                </Link>
              </>
            )}
          </nav>

          {/* Right side controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Mobile Controls - Only visible on small screens */}
            <div className="mobile-controls" style={{
              display: 'none',
              alignItems: 'center',
              gap: '12px'
            }}>
              {/* Mobile Search Button */}
              <SearchBar
                isExpanded={isSearchExpanded}
                onToggle={() => setIsSearchExpanded(!isSearchExpanded)}
              />

              {/* Hamburger Menu Button */}
              <button
                className="hamburger-button"
                onClick={toggleMobileMenu}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--bg-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{
                  width: '24px',
                  height: '2px',
                  backgroundColor: 'var(--text-primary)',
                  transition: 'all 0.3s ease',
                  transform: isMobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
                }}></div>
                <div style={{
                  width: '24px',
                  height: '2px',
                  backgroundColor: 'var(--text-primary)',
                  margin: '4px 0',
                  transition: 'all 0.3s ease',
                  opacity: isMobileMenuOpen ? 0 : 1
                }}></div>
                <div style={{
                  width: '24px',
                  height: '2px',
                  backgroundColor: 'var(--text-primary)',
                  transition: 'all 0.3s ease',
                  transform: isMobileMenuOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none'
                }}></div>
              </button>
            </div>

            {/* Desktop Controls - Hidden on mobile */}
            <div className="desktop-controls" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Search Bar */}
              <SearchBar
                isExpanded={isSearchExpanded}
                onToggle={() => setIsSearchExpanded(!isSearchExpanded)}
              />

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)',
                  border: '2px solid var(--border-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: 'scale(1)',
                  fontSize: '18px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.1)';
                  e.target.style.backgroundColor = 'var(--bg-tertiary)';
                  e.target.style.borderColor = 'var(--accent-primary)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.backgroundColor = 'var(--bg-secondary)';
                  e.target.style.borderColor = 'var(--border-primary)';
                }}
                className="breathe"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>

              {/* User Menu */}
              {isAuthenticated ? (
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px',
                      borderRadius: '8px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                    ) : (
                      <div style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: 'var(--accent-primary)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '500'
                      }}>
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span style={{ color: theme === 'dark' ? '#f9fafb' : '#374151' }}>{user?.name}</span>
                  </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    marginTop: '8px',
                    width: '192px',
                    backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                    zIndex: 10
                  }}>
                    <Link
                      to="/profile"
                      style={{
                        display: 'block',
                        padding: '8px 16px',
                        color: theme === 'dark' ? '#f9fafb' : '#374151',
                        textDecoration: 'none'
                      }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 16px',
                        color: theme === 'dark' ? '#f9fafb' : '#374151',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Link to="/login" className="btn-secondary">
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 40,
            backdropFilter: 'blur(4px)'
          }}
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className="mobile-menu"
        style={{
          position: 'fixed',
          top: 0,
          left: isMobileMenuOpen ? 0 : '-300px',
          width: '280px',
          height: '100vh',
          backgroundColor: 'var(--bg-primary)',
          borderRight: '1px solid var(--border-primary)',
          zIndex: 50,
          transition: 'left 0.3s ease-in-out',
          boxShadow: '4px 0 20px var(--shadow-medium)',
          overflowY: 'auto'
        }}
      >
        {/* Mobile Menu Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid var(--border-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link
            to="/"
            onClick={closeMobileMenu}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'var(--accent-primary)',
              textDecoration: 'none'
            }}
          >
            <img
              src="/FilmFusion.png"
              alt="FilmFusion Logo"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
              }}
            />
            FilmFusion
          </Link>
          <button
            onClick={closeMobileMenu}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Mobile Menu Navigation */}
        <nav style={{ padding: '20px 0' }}>
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="mobile-nav-button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 20px',
              margin: '8px 16px',
              color: 'white',
              textDecoration: 'none',
              fontSize: '18px',
              fontWeight: '600',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: 'translateY(0)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
              e.target.style.background = 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
              e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            }}
            onMouseDown={(e) => {
              e.target.style.transform = 'translateY(1px) scale(0.98)';
            }}
            onMouseUp={(e) => {
              e.target.style.transform = 'translateY(-2px) scale(1)';
            }}
          >
            <span style={{ fontSize: '24px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>🏠</span>
            <span>Home</span>
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/watchlist"
                onClick={closeMobileMenu}
                className="mobile-nav-button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 20px',
                  margin: '8px 16px',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '18px',
                  fontWeight: '600',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  boxShadow: '0 4px 15px rgba(240, 147, 251, 0.4)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: 'translateY(0)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(240, 147, 251, 0.6)';
                  e.target.style.background = 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(240, 147, 251, 0.4)';
                  e.target.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
                }}
                onMouseDown={(e) => {
                  e.target.style.transform = 'translateY(1px) scale(0.98)';
                }}
                onMouseUp={(e) => {
                  e.target.style.transform = 'translateY(-2px) scale(1)';
                }}
              >
                <span style={{ fontSize: '24px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>📋</span>
                <span>Watchlist</span>
              </Link>

              <Link
                to="/trending"
                onClick={closeMobileMenu}
                className="mobile-nav-button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 20px',
                  margin: '8px 16px',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '18px',
                  fontWeight: '600',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  boxShadow: '0 4px 15px rgba(79, 172, 254, 0.4)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: 'translateY(0)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(79, 172, 254, 0.6)';
                  e.target.style.background = 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(79, 172, 254, 0.4)';
                  e.target.style.background = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
                }}
                onMouseDown={(e) => {
                  e.target.style.transform = 'translateY(1px) scale(0.98)';
                }}
                onMouseUp={(e) => {
                  e.target.style.transform = 'translateY(-2px) scale(1)';
                }}
              >
                <span style={{ fontSize: '24px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>🔥</span>
                <span>Trending</span>
              </Link>

              <Link
                to="/recommendations"
                onClick={closeMobileMenu}
                className="mobile-nav-button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 20px',
                  margin: '8px 16px',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '18px',
                  fontWeight: '600',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                  boxShadow: '0 4px 15px rgba(250, 112, 154, 0.4)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: 'translateY(0)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(250, 112, 154, 0.6)';
                  e.target.style.background = 'linear-gradient(135deg, #fee140 0%, #fa709a 100%)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(250, 112, 154, 0.4)';
                  e.target.style.background = 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)';
                }}
                onMouseDown={(e) => {
                  e.target.style.transform = 'translateY(1px) scale(0.98)';
                }}
                onMouseUp={(e) => {
                  e.target.style.transform = 'translateY(-2px) scale(1)';
                }}
              >
                <span style={{ fontSize: '24px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>⭐</span>
                <span>For You</span>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Footer */}
        <div style={{ padding: '20px', borderTop: '1px solid var(--border-primary)' }}>
          {/* Theme Toggle */}
          <button
            onClick={() => {
              toggleTheme();
              closeMobileMenu();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '16px',
              backgroundColor: 'var(--bg-secondary)',
              border: '2px solid var(--border-primary)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              color: 'var(--text-primary)',
              marginBottom: '16px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--bg-tertiary)';
              e.target.style.borderColor = 'var(--accent-primary)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'var(--bg-secondary)';
              e.target.style.borderColor = 'var(--border-primary)';
            }}
          >
            <span style={{ fontSize: '20px' }}>{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          {/* User Profile Section */}
          {isAuthenticated ? (
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '12px',
                marginBottom: '12px'
              }}>
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                ) : (
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'var(--accent-primary)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '18px'
                  }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{user?.name}</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Signed in</div>
                </div>
              </div>

              <Link
                to="/profile"
                onClick={closeMobileMenu}
                style={{
                  display: 'block',
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  marginBottom: '8px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--accent-primary)';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'var(--bg-tertiary)';
                  e.target.style.color = 'var(--text-primary)';
                }}
              >
                👤 Profile
              </Link>

              <button
                onClick={handleLogout}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#ef4444';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'var(--bg-tertiary)';
                  e.target.style.color = 'var(--text-primary)';
                }}
              >
                🚪 Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="btn-secondary"
                style={{ textAlign: 'center' }}
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={closeMobileMenu}
                className="btn-primary"
                style={{ textAlign: 'center' }}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SimpleHeader;
