import axios from 'axios';

const API_URL = 'http://localhost:8000/api/token/';

class AuthService {
  async login(username, password) {
    const response = await axios
      .post(API_URL, { username, password });
    if (response.data.access) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  refreshToken(token) {
    return axios
      .post(`${API_URL}/refresh`, { refresh: token })
      .then((response) => {
        if (response.data.access) {
          const user = JSON.parse(localStorage.getItem('user'));
          user.access = response.data.access;
          localStorage.setItem('user', JSON.stringify(user));
        }
        return response.data.access;
      });
  }
}

export default new AuthService();
