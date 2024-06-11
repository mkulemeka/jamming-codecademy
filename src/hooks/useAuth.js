import { authService, authUtils } from "../auth/spotifyAuth";
import { useEffect, useState } from "react";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("access_token"));

  useEffect(() => {
    const authorize = async () => {
      try {
        await authUtils.handleCallback();
        const token = localStorage.getItem("access_token");
        const tokenExpiration = localStorage.getItem("expires");
        const { currentTime, expirationTime } = sessionTime(tokenExpiration);

        if (token && tokenExpiration && expirationTime > currentTime) {
          setIsAuthenticated(true);
          setToken(token);
        } else {
          authService.clearTokens();
        }
      } catch (error) {
        console.error(error);
        authService.clearTokens();
      }
    };

    authorize();
  }, []);

  useEffect(() => {
    const tokenExpiration = localStorage.getItem("expires");
    if (tokenExpiration) {
      const { timeDifference } = sessionTime(tokenExpiration);

      if (timeDifference > 0) {
        const logOutTimer = setTimeout(() => {
          authService.clearTokens();
          setIsAuthenticated(false);
          setToken(null);
        }, timeDifference);

        return () => clearTimeout(logOutTimer);
      } else {
        authService.clearTokens();
        setIsAuthenticated(false);
        setToken(null);
      }
    }
  }, [token]);

  return { isAuthenticated, setIsAuthenticated, token };
};

const sessionTime = (tokenExpiration = "") => {
  const expirationTime = new Date(tokenExpiration).getTime();
  const currentTime = new Date().getTime();
  const timeDifference = expirationTime - currentTime;

  return { expirationTime, currentTime, timeDifference };
};

export default useAuth;
