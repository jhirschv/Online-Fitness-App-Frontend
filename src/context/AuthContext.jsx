import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient'; // Adjust the path as necessary

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  let [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null);
  let [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
  let [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  let loginUser = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('api/token/', {
        username: e.target.username.value,
        password: e.target.password.value
      });

      const data = response.data;
      if (data) {
        localStorage.setItem('authTokens', JSON.stringify(data));
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        navigate('/');
      } else {
        alert('Something went wrong!');
      }
    } catch (error) {
      alert('Login failed!');
    }
  };

  let logoutUser = () => {
    localStorage.removeItem('authTokens');
    setAuthTokens(null);
    setUser(null);
    navigate('/login');
  };

  const updateToken = async () => {
    try {
      const response = await apiClient.post('api/token/refresh/', {
        refresh: authTokens.refresh,
      });
    
      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem('authTokens', JSON.stringify(data));
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
      } else {
        logoutUser();
      }
    } catch (error) {
      logoutUser(); // Logs out the user on any error, enhancing security
    } finally {
      if (loading) {
        setLoading(false); // Always ensure the loading state is managed correctly
      }
    }
  }

  let contextData = {
    user,
    authTokens,
    loginUser,
    logoutUser,
  };

  /* useEffect(()=>{
    if(!authTokens){
      setUser(null)
    }
  }, []) */

  useEffect(() => {
    if (loading) {
      updateToken();
    }

    const fourMinutes = 1000 * 60 * 4;
    let interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, fourMinutes);

    return () => clearInterval(interval);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;