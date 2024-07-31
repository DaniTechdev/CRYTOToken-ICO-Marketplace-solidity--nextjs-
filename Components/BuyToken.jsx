import React, { useState, useEffect } from "react";

//INTERNAL IMPORT
import Input from "./Input";
import Button from "./Button";

const BuyToken = ({
  address,
  connectWallet,
  buyIco,
  setOpenBuyToken,
  currency,
  buyToken,
}) => {
  const [tokenQuantity, settokenQuantity] = useState();
  return (
    <div className="modal">
      <div className="modal-content">
        <span onClick={() => setOpenBuyToken(false)} className="close">
          &times;
        </span>
        <h2>Buy Token</h2>
        <div
          className="input-Container"
          style={{
            marginTop: "1rem",
          }}
        >
          <Input
            placeholder={"Quanitity"}
            handleChange={(e) => settokenQuantity(e.target.value)}
          />
          <Input
            placeholder={
              tokenQuantity
                ? `${tokenQuantity * Number(buyIco?.price)}${currency}`
                : "Output"
            }
          />
        </div>
        <div className="button-box" style={{ marginTop: "1rems" }}>
          {address ? (
            <Button
              name="Token Transfer"
              handleClick={() => buyToken(buyIco?.token, tokenQuantity)}
            />
          ) : (
            <Button name="Connect Wallet" handleClick={() => connectWallet()} />
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyToken;
