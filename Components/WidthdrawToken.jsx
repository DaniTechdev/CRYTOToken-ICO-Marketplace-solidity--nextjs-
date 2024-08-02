import React, { useState, useEffect } from "react";

//INTERNAL IMPORT
import Input from "./Input";
import Button from "./Button";

const WidthdrawToken = ({
  address,
  connectWallet,
  widthdrawToken,
  setOpenWidthdrawToken,
}) => {
  const [widthdrawQuantity, setWidthdrawQuantity] = useState({
    token: "",
    amount: "",
  });
  return (
    <div className="modal">
      <div className="modal-content">
        <span onClick={() => setOpenWidthdrawToken(false)} className="close">
          &times;
        </span>
        <h2>Widthdraw Token</h2>
        <div
          className="input-Container"
          style={{
            marginTop: "1rem",
          }}
        >
          <Input
            placeholder={"Token Address"}
            handleChange={(e) =>
              setWidthdrawQuantity({
                ...widthdrawQuantity,
                token: e.target.value,
              })
            }
          />
          <Input
            placeholder={"Quanity"}
            handleChange={(e) =>
              setWidthdrawQuantity({
                ...widthdrawQuantity,
                amount: e.target.value,
              })
            }
          />
        </div>
        <div className="button-box" style={{ marginTop: "1rems" }}>
          {address ? (
            <Button
              name="Widthdraw Token"
              handleClick={() => widthdrawToken(widthdrawQuantity)}
            />
          ) : (
            <Button name="Connect Wallet" handleClick={() => connectWallet()} />
          )}
        </div>
      </div>
    </div>
  );
};

export default WidthdrawToken;
