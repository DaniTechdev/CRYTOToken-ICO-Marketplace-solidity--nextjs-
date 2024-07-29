import React from "react";

const Input = ({ placeholder, handleChange }) => {
  return (
    <>
      <input
        type="text"
        placeholder={placeholder}
        className={"input-style"}
        onChange={handleChange}
      />
    </>
  );
};

export default Input;
