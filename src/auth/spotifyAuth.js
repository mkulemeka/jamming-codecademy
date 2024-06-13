/**
 * This file contains the authentication logic for the Spotify API.
 * For more information, read
 * https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
 */

const spotifyConfig = {
  clientId: import.meta.env.VITE_REACT_APP_SPOTIFY_CLIENT_ID,
  redirectUrl: "https://jaaming-spotify.netlify.app/",
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
  scope:
    "user-read-private user-read-email playlist-modify-public playlist-modify-private",
};

const localStorageKeys = {
  accessToken: "access_token",
  refreshToken: "refresh_token",
  expiresIn: "expires_in",
  expires: "expires",
  codeVerifier: "code_verifier",
};

const spotifyAuth = {
  /**
   * Exchanges the code for an access token
    * @param {string} code The code from the Spotify authorize page
    * @returns {Promise<Object>} The response object from the token endpoint
   */
  async getToken(code) {
    const codeVerifier = localStorage.getItem(localStorageKeys.codeVerifier);

    if (!codeVerifier) throw new Error("Code verifier not found!");

    const params = new URLSearchParams({
      client_id: spotifyConfig.clientId,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: spotifyConfig.redirectUrl,
      code_verifier: codeVerifier,
    });

    const response = await fetch(spotifyConfig.tokenEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log("Error data: ", errorData);
      throw new Error(`Failed to get token: HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  },

  /**
   * Refreshes the access token using the refresh token
   * @returns {Promise<Object>} The response object from the token endpoint
   * @throws {Error} If the request fails
   */
  async refreshToken() {
    try {
      const response = await fetch(spotifyConfig.tokenEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: spotifyConfig.clientId,
          grant_type: "refresh_token",
          refresh_token: localStorage.getItem(localStorageKeys.refreshToken),
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to refresh token: HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error refreshing token: ", error);
      authService.clearTokens();
    }
  },

  /**
   * Gets the user data from the Spotify API
   * @returns {Promise<Object>} The user data object
   * @throws {Error} If the request fails
   */
  async getUserData() {
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            localStorageKeys.accessToken
          )}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to get user data: HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting user data: ", error);
    }
  },
};

const authService = {
  saveToken(response) {
    const { access_token, refresh_token, expires_in } = response;
    localStorage.setItem(localStorageKeys.accessToken, access_token);
    localStorage.setItem(localStorageKeys.refreshToken, refresh_token);
    localStorage.setItem(localStorageKeys.expiresIn, expires_in);

    const now = new Date();
    const expiry = new Date(now.getTime() + expires_in * 1000);
    localStorage.setItem(localStorageKeys.expires, expiry);
  },

  clearTokens() {
    localStorage.clear();
  },
};

const authUtils = {
  /**
   * Handles the callback from the Spotify authorize page
   * @returns {Promise<void>}
   * @throws {Error} If the token exchange fails
   */
  async handleCallback() {
    const code = new URLSearchParams(window.location.search).get("code");
    if (code) {
      try {
        const token = await spotifyAuth.getToken(code);
        authService.saveToken(token);

        const url = new URL(window.location.href);
        url.searchParams.delete("code");

        const updatedUrl = url.search ? url.href : url.href.replace("?", "");
        window.history.replaceState({}, document.title, updatedUrl);
      } catch (error) {
        console.error("Error during token exchange: ", error);
      }
    }
  },

  /**
   * Redirects the user to the Spotify authorize page
   * @returns {Promise<void>}
   * @throws {Error} If the redirect fails
   */
  async redirectToSpotifyAuthorize() {
    try {
      const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const randomValues = crypto.getRandomValues(new Uint8Array(64));
      const randomString = randomValues.reduce(
        (acc, x) => acc + possible[x % possible.length],
        ""
      );

      const codeVerifier = randomString;
      const data = new TextEncoder().encode(codeVerifier);
      const hashed = await crypto.subtle.digest("SHA-256", data);

      const codeChallengeBase64 = btoa(
        String.fromCharCode(...new Uint8Array(hashed))
      )
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");

      localStorage.setItem(localStorageKeys.codeVerifier, codeVerifier);

      const authUrl = new URL(spotifyConfig.authorizationEndpoint);
      const params = {
        response_type: "code",
        client_id: spotifyConfig.clientId,
        scope: spotifyConfig.scope,
        code_challenge_method: "S256",
        code_challenge: codeChallengeBase64,
        redirect_uri: spotifyConfig.redirectUrl,
      };

      await this.handleCallback();

      authUrl.search = new URLSearchParams(params).toString();
      window.location.href = authUrl.toString();
    } catch (error) {
      console.error("Error redirecting to Spotify authorize: ", error);
    }
  },
};

export { authService, spotifyAuth, authUtils };
