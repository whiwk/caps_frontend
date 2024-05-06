import { useEffect, useState } from 'react';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = token ? JSON.parse(localStorage.getItem('userData')) : null;
    setIsAuthenticated(!!token);
    setUser(userData);
  }, []);

  return { isAuthenticated, user };
};

export default useAuth;
