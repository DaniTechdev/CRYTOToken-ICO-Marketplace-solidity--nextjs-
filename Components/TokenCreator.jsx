import React, { useState } from "react";

//INTERNAL IMPORT
import UploadLogo from "../Components/UploadLogo";
import Input from "../Components/Input";
import Button from "../Components/Button";

const TokenCreator = ({
  createERC20,
  shortenAddress,
  setOpenTokenCreator,
  setLoader,
  addresss,
  connectWallet,
  PINATA_API_KEY,
  PINATA_API_SECRET,
}) => {
  const [imageUrl, setImageUrl] = useState();
  const [token, setToken] = useState({
    name: "",
    symbol: "",
    supply: "",
  });

  return (
    <div id={"myModal"} className={"modal"}>
      <div className="modal-content">
        <span onClick={() => setOpenTokenCreator(false)} className="close">
          &times;
        </span>
        <h2 style={{ marginBottom: "1rem" }}> Create Token</h2>

        <UploadLogo
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          setLoader={setLoader}
          PINATA_API_KEY={PINATA_API_KEY}
          PINATA_API_SECRET={PINATA_API_SECRET}
        />
        <div className="input-Container">
          <Input
            placeholder={"name"}
            handleChange={(e) => setToken({ ...token, name: e.target.value })}
          />
          <Input
            placeholder={"Symbol"}
            handleChange={(e) => setToken({ ...token, symbol: e.target.value })}
          />
          <Input
            placeholder={"Supply"}
            handleChange={(e) => setToken({ ...token, supply: e.target.value })}
          />
        </div>
        <div className="button-box" style={{ marginTop: "1rems" }}>
          {addresss ? (
            <Button name="Create Token" />
          ) : (
            <Button name="Connect Wallet" handleClick={() => connectWallet()} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenCreator;
