import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const technologies = [
    { name: 'React', icon: '⚛️' },
    { name: 'Node.js', icon: '🟢' },
    { name: 'PostgreSQL', icon: '🐘' },
    { name: 'Express', icon: '🚀' },
    { name: 'Framer Motion', icon: '🎭' },
    { name: 'TMDB API', icon: '🎬' }
  ];

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Discover', path: '/discover' },
    { name: 'Watchlist', path: '/watchlist' },
    { name: 'For You', path: '/recommendations' },
    { name: 'Search', path: '/search' },
    { name: 'Profile', path: '/profile' }
  ];

  return (
    <footer style={{
      backgroundColor: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-primary)',
      marginTop: '64px',
      padding: '48px 16px 24px'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto'
      }}>
        {/* Main Footer Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '48px',
          marginBottom: '32px'
        }}>
          {/* Brand Section */}
          <div>
            <Link to="/" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'var(--accent-primary)',
              marginBottom: '16px'
            }}>
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
            <p style={{
              color: 'var(--text-secondary)',
              lineHeight: '1.6',
              marginBottom: '24px'
            }}>
              Discover, rate, and organize your favorite movies with personalized recommendations 
              powered by advanced algorithms and community insights.
            </p>
            
            {/* Made with Love Section */}
            <motion.div
              style={{
                padding: '16px',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: '12px',
                border: '1px solid var(--border-secondary)'
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <p style={{
                color: 'var(--text-primary)',
                fontWeight: '600',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '18px' }}>❤️</span>
                Made with Love using:
              </p>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {technologies.map((tech, index) => (
                  <motion.span
                    key={tech.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 8px',
                      backgroundColor: 'var(--bg-primary)',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-primary)'
                    }}
                    whileHover={{
                      backgroundColor: 'var(--accent-primary)',
                      color: 'white',
                      scale: 1.05
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <span>{tech.icon}</span>
                    {tech.name}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{
              color: 'var(--text-primary)',
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px'
            }}>
              Quick Links
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px'
            }}>
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  style={{
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    padding: '8px 0',
                    transition: 'color 0.3s ease',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = 'var(--accent-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = 'var(--text-secondary)';
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* About Section */}
          <div>
            <h3 style={{
              color: 'var(--text-primary)',
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px'
            }}>
              About FilmFusion
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                🎯 Personalized movie recommendations
              </p>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                ⭐ Rate and review your favorite films
              </p>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                📚 Organize your watchlist efficiently
              </p>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                🤝 Connect with fellow movie enthusiasts
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border-primary)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: '14px'
          }}>
            © {currentYear} FilmFusion. All rights reserved. Built with passion for movie lovers.
          </p>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <span style={{
              color: 'var(--text-muted)',
              fontSize: '12px'
            }}>
              Powered by TMDB API
            </span>
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              <img
                src="/FilmFusion.png"
                alt="FilmFusion Logo"
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '4px',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
