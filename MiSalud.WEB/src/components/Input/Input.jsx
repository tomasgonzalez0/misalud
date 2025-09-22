import React from 'react';
import Styles from './Input.module.css';

const Input = ({ nameTag, label, value, onChange, type, errorMessage, placeholder, className }) => {
    return (
      <div className={`${Styles["container"]} ${className || ""}`}>
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
            placeholder={placeholder}
          />
        </div>
        {label && <label className={Styles["label"]}>{label}</label>}
      </div>
    );
  };
  

export default Input;
