import React from 'react';
import Styles from './Input.module.css';

const Input = ({ nameTag, label, value, onChange, type, errorMessage }) => {
    return (
      <div className={Styles["container"]}>
        <div className={Styles["inputWrapper"]}>
          <div className={Styles["nameTagWrapper"]}>
            <span className={Styles["nameTag"]}>{nameTag}</span>
            <p className={Styles["errorMessage"]}>{errorMessage}</p>
          </div>
        
          <input 
            className={Styles["input"]}
            value={value}
            onChange={onChange}
            type={type}
          />
        </div>
        {label && <label className={Styles["label"]}>{label}</label>}
      </div>
    );
  };
  

export default Input;
