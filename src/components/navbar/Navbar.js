import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Make sure to install jwt-decode package
import './Navbar.css';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import api from '../../services/apiService';
import { RefreshContext } from '../../contexts/RefreshContext';

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
  const { refreshNavbar, setRefreshNavbar } = useContext(RefreshContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('user/information/');
        setUser(prevState => ({
          ...prevState,
          username: response.data.username,
          level: response.data.level,
          completion: `${Math.round(response.data.completion)}%`
        }));
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    document.body.style.paddingTop = '40px';
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      const decoded = jwtDecode(authToken);
      const isAdmin = decoded.is_staff || decoded.is_superuser;
      setUser(prevState => ({ ...prevState, isAdmin }));
    }

    fetchUserData();

    return () => {
      document.body.style.paddingTop = '0px'; // Reset padding when the component is unmounted
    };
  }, []);

  useEffect(() => {
    if (refreshNavbar) {
      const fetchUserData = async () => {
        try {
          const response = await api.get('user/information/');
          setUser(prevState => ({
            ...prevState,
            username: response.data.username,
            level: response.data.level,
            completion: `${Math.round(response.data.completion)}%`
          }));
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        } finally {
          setRefreshNavbar(false); // Reset the refresh state
        }
      };

      fetchUserData();
    }
  }, [refreshNavbar, setRefreshNavbar]);

  const handleLogout = async () => {
    try {
      await api.post('token/blacklist/', {
        refresh: localStorage.getItem('refreshToken')
      });
      localStorage.clear();
      sessionStorage.clear(); // Clear session storage
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (paths) => {
    return paths.includes(location.pathname);
  };

  return (
    <header className="navbar">
      {loading ? <CircularProgress /> : (
        <>
          <div className="navbar__logo">
            <Link to="/introduction/orca">
              <img src="/logo-orca-white.png" alt="Logo" />
            </Link>
          </div>
          <nav className="navbar__nav">
            {user.isAdmin ? (
              <Link to="/admin/user-management" className={isActive(['/admin/user-management']) ? 'active' : ''}>User Management</Link>
            ) : (
              <>
                <Link to="/introduction/orca" className={isActive(['/introduction/orca', '/introduction/5g-overview', '/introduction/lab-guidance', '/introduction/behind-the-technology', '/introduction/monitoring-and-logging']) ? 'active' : ''}>Introduction</Link>
                <Link to="/dashboard" className={isActive(['/dashboard']) ? 'active' : ''}>Dashboard</Link>
                <Link to="/monitoring" className={isActive(['/monitoring']) ? 'active' : ''}>Monitoring</Link>
              </>
            )}
          </nav>
          <div className="navbar__user-info">
            {!user.isAdmin && (
              <div className="navbar__user-details">
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
