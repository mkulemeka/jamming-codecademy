import { loginWithSpotifyClick } from "../../auth/auth";

const Login = () => {
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={loginWithSpotifyClick}>Login to Spotify</button>
      </header>
    </div>
  );
};

export default Login;
