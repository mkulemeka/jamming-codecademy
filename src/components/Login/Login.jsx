import { authUtils } from "../../auth/spotifyAuth";
import styles from "./Login.module.css";

const Login = () => {
  return (
    <main className={styles.login}>
      <button
        className={styles.button}
        onClick={() => authUtils.redirectToSpotifyAuthorize()}
      >
        Login using Spotify
      </button>
    </main>
  );
};

export default Login;
