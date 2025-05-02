import React from 'react';
import styles from './FormButton.module.css';

const FormButton = ({ text, onClick, type = "button" }) => {
  return (
    <button
      type={type}
      className={styles.button}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default FormButton;
