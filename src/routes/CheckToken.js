import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Ensure this import is correct

const CheckToken = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Get current time in seconds

        if (decoded.exp < currentTime) {
          // Token has expired
          localStorage.removeItem('authToken');
          navigate('/auth/login'); // Redirect to login on token expiration
        } else {
          // Check if the decoded token has the is_staff property and redirect accordingly
          if (decoded.is_staff) {
            navigate('/user-management'); // Redirect admin users to the user management page
          } else {
            navigate('/introduction'); // Redirect common users to the introduction page
          }
        }
      } catch (error) {
        console.error('Failed to decode token:', error);
        localStorage.removeItem('authToken'); // Clean up local storage on decode failure
        navigate('/auth/login'); // Redirect to login on token decode failure
      }
    } else {
      navigate('/auth/login'); // Redirect to login if no token is found
    }
  }, [navigate]);

  return null; 
};

export default CheckToken;
