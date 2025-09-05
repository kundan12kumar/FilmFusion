import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import SimpleHeader from './components/SimpleHeader';
import Footer from './components/Footer';
import NewHome from './pages/NewHome';
import SimpleLogin from './components/SimpleLogin';
import Register from './components/Register';
import MovieDetails from './pages/MovieDetails';
import Watchlist from './pages/Watchlist';
import ForYou from './pages/ForYou';
import Trending from './pages/Trending';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Category from './pages/Category';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <SimpleHeader />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<NewHome />} />
                <Route path="/login" element={<SimpleLogin />} />
                <Route path="/register" element={<Register />} />
                <Route path="/discover" element={<div>Discover Page Coming Soon</div>} />
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="/trending" element={<Trending />} />
                <Route path="/recommendations" element={<ForYou />} />
                <Route path="/for-you" element={<ForYou />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/tv/:id" element={<MovieDetails />} />
                <Route path="/category/:category" element={<Category />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/search" element={<Search />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
