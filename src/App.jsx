import "./App.css";

import { Form, Login, Playlist, SearchResults } from "./components";

import useAuth from "./hooks/useAuth";
import useFetch from "./hooks/useFetch";
import { useState } from "react";

const App = () => {
  const [search, setSearch] = useState("");
  const [playlist, setPlaylist] = useState([]);
  const { isAuthenticated } = useAuth();
  const { searchResults, fetchData, loading, setSearchResults } = useFetch();

  const handleSearch = () => {
    if (!search) setSearchResults([]);
    fetchData(search);
  };

  if (!isAuthenticated) return <Login />;

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
