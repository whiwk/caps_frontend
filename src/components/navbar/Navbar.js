import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Navbar.css';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import api from '../../services/apiService';

const Navbar = () => {
  const [user, setUser] = useState({
    username: 'Loading...',
    level: 'N/A',
    completion: '-%',
    isAdmin: false
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    document.body.style.paddingTop = '40px';
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      const decoded = jwtDecode(authToken);
      const isAdmin = decoded.is_staff || decoded.is_superuser;
      setUser(prevState => ({ ...prevState, isAdmin }));
    }

    const fetchUserData = async () => {
      try {
        const response = await api.get('user/information/');
        setUser(prevState => ({
          ...prevState,
          username: response.data.username,
          level: response.data.level,
          completion: `${response.data.completion}%`
        }));
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    return () => {
      document.body.style.paddingTop = '0px'; // Reset padding when the component is unmounted
    };
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('token/blacklist/', {
        refresh: localStorage.getItem('refreshToken')
      });
      localStorage.clear();
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="navbar">
      {loading ? <CircularProgress /> : (
      <>
        <div className="navbar__logo">
          <Link to="/">
            <img src="/logo-orca-white.png" alt="Logo" />
          </Link>
        </div>
        <nav className="navbar__nav">
          {user.isAdmin ? (
            <Link to="/user-management" className={isActive('/user-management') ? 'active' : ''}>User Management</Link>
          ) : (
            <>
              <Link to="/introduction" className={isActive('/introduction') ? 'active' : ''}>Introduction</Link>
              <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>Dashboard</Link>
              <Link to="/monitoring" className={isActive('/monitoring') ? 'active' : ''}>Monitoring</Link>
            </>
          )}
        </nav>
        <div className="navbar__user-info">
          {!user.isAdmin && (
            <div className="navbar__user-details">
              <span className="navbar__level">Level: {user.level}</span>
              <span className="navbar__completion">Completion: {user.completion}</span>
            </div>
          )}
          <img src="/login-bright.png" alt="User Avatar" className="navbar__avatar" />
          <span className="navbar__username">{user.username}</span>
          <Tooltip title="Logout" placement="bottom">
            <button className="navbar__logout" onClick={handleLogout}>
              <ExitToAppIcon />
            </button>
          </Tooltip>
        </div>
      </>
      )}
    </header>
  );
};

export default Navbar;
