import React, { useState, useEffect } from "react";

//INTERNAL IMPORT
import Button from "./Button";

const Header = ({
  accountBalance,
  setAddress,
  address,
  connectWallet,
  ICO_MARKETPLACE_ADDRESS,
  shortenAddresss,
  openAllICO,
  setOpenAllICO,
  setOpenTokenCreator,
  openTokenCreator,
  setOpenTokenHistory,
  openTokenHistory,
  setOpenICOMarketplace,
  openICOMarketplace,
  shortenAddress,
  setOpenCreateICO,
  openCreateICO,
}) => {
  //since we can be changing metamassk account in creating ICO or buy, we will write a function and state that
  //can manage that using useEffect
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  useEffect(() => {
    if (!typeof window.ethereum != "undefined") {
      setIsMetaMaskInstalled(true);
      //thre are many change events in ethereum.window but we are looking at accountChange
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (typeof window.ethereum !== "undefined") {
        // window.ethereum.off("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, [address]);

  const handleAccountsChanged = (accounts) => {
    // if (accounts) setAddress(accounts[0]);
    accounts && setAddress(accounts[0]);
  };

  // console.log("balance of token", accountBalance);
  return (
    <header className="header">
      <nav>
        <div className="logo">
          <a href="/">
            ICO. <span>MARKET</span>
          </a>
        </div>

        <input type="checkbox" name="" id="menu-toggle" />
        <label htmlFor="menu-toggle" className="menu-icon">
          &#9775;
        </label>
        <ul className="menu">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a
              onClick={() =>
                openICOMarketplace
                  ? setOpenICOMarketplace(false)
                  : setOpenICOMarketplace(true)
              }
            >
              ICO Marketplace
            </a>
          </li>
          <li>
            <a
              onClick={() =>
                openAllICO ? setOpenAllICO(false) : setOpenAllICO(true)
              }
            >
              Created ICOs
            </a>
          </li>
          <li>
            <a
              onClick={() =>
                openCreateICO ? setOpenCreateICO(false) : setOpenCreateICO(true)
              }
            >
              Create ICO
            </a>
          </li>
          <li>
            <a
              onClick={() =>
                openTokenHistory
                  ? setOpenTokenHistory(false)
                  : setOpenTokenHistory(true)
              }
            >
              History
            </a>
          </li>
          <li>
            <a
              onClick={() =>
                openTokenCreator
                  ? setOpenTokenCreator(false)
                  : setOpenTokenCreator(true)
              }
            >
              Create Token
            </a>
          </li>
          {address ? (
            <li>
              <Button
                name={`${shortenAddress(address)}:
               ${accountBalance?.slice(0, 5)}`}
              />
            </li>
          ) : (
            <li>
              <Button name="Connect Wallet" handleClick={connectWallet} />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
