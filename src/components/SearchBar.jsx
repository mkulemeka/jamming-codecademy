import PropTypes from "prop-types";
import styles from "./Form/Form.module.css";

const SearchBar = ({ search, onChange }) => {
  return (
    <section>
      <input
        placeholder="Enter A Song, Album, or Artist"
        value={search}
        onChange={onChange}
        className={styles.searchBar}
      />
    </section>
  );
};

SearchBar.propTypes = {
  search: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SearchBar;
