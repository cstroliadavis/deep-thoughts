import decode from 'jwt-decode';

export const getProfile = () => decode(getToken());

export const getToken = () => localStorage.getItem('id_token');

export const isTokenExpired = (token) => {
  try {
    const decoded = decode(token);

    return decoded.exp < (Date.now() / 1000);
  } catch (err) {
    console.log(err);
    return false;
  }
}

export const loggedIn = () => {
  const token = getToken();

  return !! token && !isTokenExpired(token);
}

export const login = (idToken) => {
  localStorage.setItem('id_token', idToken);

  window.location.assign('/');
};

export const logout = () => {
  localStorage.removeItem('id_token');

  window.location.assign('/');
}

export default {
  getProfile,
  getToken,
  isTokenExpired,
  loggedIn,
  login,
  logout,
};
