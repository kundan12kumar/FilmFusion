import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { moviesAPI } from '../services/api';

const SearchBar = ({ isExpanded, onToggle }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (query.trim() && query.length > 2) {
        fetchSuggestions(query);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [query]);

  const fetchSuggestions = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await moviesAPI.search(searchQuery, 1);
      setSuggestions(response.data.results.slice(0, 5));
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
      onToggle();
    }
  };

  const handleSuggestionClick = (movie) => {
    navigate(`/movie/${movie.id}`);
    setQuery('');
    setShowSuggestions(false);
    onToggle();
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Search Button */}
      {!isExpanded && (
        <motion.button
          onClick={onToggle}
          style={{
            padding: '12px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-secondary)',
            border: '2px solid var(--border-primary)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '18px'
          }}
          whileHover={{
            backgroundColor: 'var(--bg-tertiary)',
            borderColor: 'var(--accent-primary)',
            scale: 1.05
          }}
          whileTap={{ scale: 0.95 }}
        >
          🔍
        </motion.button>
      )}

      {/* Expanded Search Form */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              zIndex: 1000
            }}
          >
            <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--bg-primary)',
                border: '2px solid var(--border-primary)',
                borderRadius: '12px',
                padding: '8px',
                boxShadow: '0 8px 32px var(--shadow-medium)'
              }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Search movies..."
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    color: 'var(--text-primary)',
                    fontSize: '16px',
                    padding: '8px 12px'
                  }}
                />
                
                <motion.button
                  type="submit"
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'var(--accent-primary)',
                    color: 'white',
                    cursor: 'pointer',
                    marginRight: '4px'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🔍
                </motion.button>
                
                <motion.button
                  type="button"
                  onClick={onToggle}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ✕
                </motion.button>
              </div>

              {/* Search Suggestions */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '12px',
                      marginTop: '8px',
                      boxShadow: '0 8px 32px var(--shadow-medium)',
                      zIndex: 1001,
                      overflow: 'hidden'
                    }}
                  >
                    {suggestions.map((movie, index) => (
                      <motion.div
                        key={movie.id}
                        onClick={() => handleSuggestionClick(movie)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '12px',
                          cursor: 'pointer',
                          borderBottom: index < suggestions.length - 1 ? '1px solid var(--border-primary)' : 'none',
                          transition: 'background-color 0.2s ease'
                        }}
                        whileHover={{
                          backgroundColor: 'var(--bg-secondary)'
                        }}
                      >
                        <img
                          src={movie.poster_path 
                            ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                            : '/placeholder-movie.jpg'
                          }
                          alt={movie.title}
                          style={{
                            width: '40px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            marginRight: '12px'
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <h4 style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            marginBottom: '4px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {movie.title}
                          </h4>
                          <p style={{
                            fontSize: '12px',
                            color: 'var(--text-secondary)',
                            margin: 0
                          }}>
                            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown'} • ⭐ {movie.vote_average?.toFixed(1) || 'N/A'}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                    
                    {query.trim() && (
                      <motion.div
                        onClick={() => {
                          navigate(`/search?q=${encodeURIComponent(query.trim())}`);
                          setShowSuggestions(false);
                          onToggle();
                        }}
                        style={{
                          padding: '12px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          backgroundColor: 'var(--bg-tertiary)',
                          color: 'var(--accent-primary)',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}
                        whileHover={{
                          backgroundColor: 'var(--accent-primary)',
                          color: 'white'
                        }}
                      >
                        See all results for "{query}"
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Loading indicator */}
              {loading && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '12px',
                  marginTop: '8px',
                  padding: '16px',
                  textAlign: 'center',
                  color: 'var(--text-secondary)',
                  fontSize: '14px'
                }}>
                  Searching...
                </div>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
