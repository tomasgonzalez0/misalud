import React from 'react';
import Styles from './OptionButton.module.css';

const OptionButton = ({ text, onClick }) => {
  return (
    <button className={Styles["OptionButton"]} onClick={onClick}>
      {text}
    </button>
  );
};

export default OptionButton;
