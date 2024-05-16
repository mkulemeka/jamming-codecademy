import "./App.css";

import { Form, Login, Playlist, SearchResults } from "./components";
import { useEffect, useState } from "react";

import { logout } from "./auth/auth";
import useFetch from "./hooks/useFetch";

const App = () => {
  const [search, setSearch] = useState("");
  const [playlist, setPlaylist] = useState([]);
  const { searchResults, fetchData, loading, setSearchResults } = useFetch();

  useEffect(() => {
    const tokenExpiration = localStorage.getItem("expires");
    if (tokenExpiration) {
      const expirationTime = new Date(tokenExpiration).getTime();
      const currentTime = new Date().getTime();
      const timeDifference = expirationTime - currentTime;

      const logOutTimer = setTimeout(() => {
        logout();
      }, timeDifference);

      return () => clearTimeout(logOutTimer);
    }
  }, []);

  const handleSearch = () => {
    if (!search) setSearchResults([]);
    fetchData(search);
  };

  const token = localStorage.getItem("access_token");
  if (!token) return <Login />;

  return (
    <main className="app">
      <h1>Jamming</h1>
      <Form search={search} setSearch={setSearch} handleSearch={handleSearch} />
      <section className="container">
        <SearchResults
          searchResults={searchResults}
          playlist={playlist}
          setPlaylist={setPlaylist}
          loading={loading}
        />
        <Playlist playlist={playlist} setPlaylist={setPlaylist} />
      </section>
    </main>
  );
};

export default App;
