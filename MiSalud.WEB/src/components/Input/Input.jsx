import React from 'react';
import Styles from './Input.module.css';

const Input = ({ nameTag, label, value, onChange }) => {
    return (
      <div className={Styles["container"]}>
        <div className={Styles["inputWrapper"]}>
          <span className={Styles["nameTag"]}>{nameTag}</span>
          <input 
            className={Styles["input"]}
            type="text"
            value={value}
            onChange={onChange}
          />
        </div>
        {label && <label className={Styles["label"]}>{label}</label>}
      </div>
    );
  };
  

export default Input;
