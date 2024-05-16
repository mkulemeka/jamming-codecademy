import { loginWithSpotifyClick } from "../../auth/auth";
import styles from "./Login.module.css";

const Login = () => {
  return (
    <section className={styles.login}>
      <button className={styles.button} onClick={loginWithSpotifyClick}>
        Login using Spotify
      </button>
    </section>
  );
};

export default Login;
