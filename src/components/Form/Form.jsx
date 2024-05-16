import { Button, SearchBar } from "..";

import PropTypes from "prop-types";
import styles from "./Form.module.css";

const Form = ({ search, handleSearch, setSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <SearchBar
        search={search}
        onChange={({ target }) => setSearch(target.value)}
      />
      <Button onClick={handleSearch} buttonText="Search" />
    </form>
  );
};

Form.propTypes = {
  search: PropTypes.string,
  setSearch: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
};

export default Form;
