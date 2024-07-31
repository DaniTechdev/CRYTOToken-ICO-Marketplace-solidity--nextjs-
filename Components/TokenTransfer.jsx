import React, { useState, useEffect } from "react";

//INTERNAL IMPORT
import Input from "./Input";
import Button from "./Button";

const TokenTransfer = ({
  address,
  transferTokens,
  connectWallet,
  setOpenTransferToken,
}) => {
  const [transferTokenData, settransferTokenData] = useState({
    address: "",
    tokenAdd: "",
    amount: "",
  });
  return (
    <div className="modal">
      <div className="modal-content">
        <span onClick={() => setOpenTransferToken(false)} className="close">
          &times;
        </span>
        <h2>Token Transfer</h2>
        <div
          className="input-Container"
          style={{
            marginTop: "1rem",
          }}
        >
          <Input
            placeholder={"To Address"}
            handleChange={(e) =>
              settransferTokenData({
                ...transferTokenData,
                address: e.target.value,
              })
            }
          />
          <Input
            placeholder={"Token Addresss"}
            handleChange={(e) =>
              settransferTokenData({
                ...transferTokenData,
                tokenAdd: e.target.value,
              })
            }
          />
          <Input
            placeholder={"Amount"}
            handleChange={(e) =>
              settransferTokenData({
                ...transferTokenData,
                amount: e.target.value,
              })
            }
          />
        </div>
        <div className="button-box" style={{ marginTop: "1rems" }}>
          {address ? (
            <Button
              name="Token Transfer"
              handleClick={() => transferTokenData(transferTokenData)}
            />
          ) : (
            <Button name="Connect Wallet" handleClick={() => connectWallet()} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenTransfer;
