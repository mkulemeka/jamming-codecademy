import PropTypes from "prop-types";
import styles from "./Form/Form.module.css";

const Button = ({ buttonText, onClick }) => {
  return <button className={styles.button} onClick={onClick}>{buttonText}</button>;
};

Button.propTypes = {
  buttonText: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Button;
