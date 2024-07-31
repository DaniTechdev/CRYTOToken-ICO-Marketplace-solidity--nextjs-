import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

//INTERNAL IMPORT
import { useStateContext } from "../Context/index";
import Header from "../Components/Header";
import Input from "../Components/Input";
import Button from "../Components/Button";
import Table from "../Components/Table";
import PreSaleList from "../Components/PreSaleList";
import UploadLogo from "../Components/UploadLogo";
import Loader from "../Components/Loader";
import Footer from "../Components/Footer";
import ICOMarket from "../Components/ICOMarket";
import TokenCreator from "../Components/TokenCreator";
import TokenHistory from "../Components/TokenHistory";
import Marketplace from "../Components/Marketplace";
import CreateICO from "../Components/CreateICO";
import Card from "../Components/Card";
import BuyToken from "../Components/BuyToken";
import WidthdrawToken from "../Components/WidthdrawToken";
import TokenTransfer from "../Components/TokenTransfer";

const index = () => {
  const {
    widthdrawToken,
    transferTokens,
    buyToken,
    createICOSALE,
    GET_ALL_ICOSALE_TOKEN,
    GET_ALL_USER_ICOSALE_TOKEN,
    createERC20,
    connectWallet,
    checkIfWalletConnected,
    openBuyToken,
    setOpenBuyToken,
    openWidthdrawToken,
    setOpenWidthdrawToken,
    openTransferToken,
    setOpenTransferToken,
    openTokenCreator,
    setOpenTokenCreator,
    openCreateICO,
    setOpenCreateICO,
    address,
    setAddress,
    accountBalance,
    loader,
    recall,
    setLoader,
    currency,
    PINATA_API_KEY,
    PINATA_API_SECRET,
    ICO_MARKETPLACE_ADDRESS,
    shortenAddress,
  } = useStateContext();

  // console.log(
  //   "all token, user tokens",
  //   GET_ALL_ICOSALE_TOKEN(),
  //   GET_ALL_USER_ICOSALE_TOKEN()
  // );
  const notifySuccess = (msg) => toast.success(msg, { duration: 2000 });
  const notifyError = (msg) => toast.error(msg, { duration: 2000 });

  const [allICOs, setAllICOs] = useState();
  const [allUserIcos, setAllUserIcos] = useState();

  //COMPONENT OPEN
  const [openAllICO, setOpenAllICO] = useState(false);
  const [openTokenHistory, setOpenTokenHistory] = useState(false);
  const [openICOMarketplace, setOpenICOMarketplace] = useState(false);

  console.log("allIcos, allUserIcos", allICOs, allUserIcos);
  //BUY ICO TOKEN
  const [buyIco, setBuyIco] = useState();

  //let's create a simple function to copy address to clipboard
  const copyAddress = () => {
    navigator.clipboard.writeText(ICO_MARKETPLACE_ADDRESS);
    notifySuccess("Copied successfully");
  };

  // useEffect(() => {
  //   // console.log("UseEffect ran");
  //   // console.log(
  //   //   "all token, user tokens",
  //   //   GET_ALL_ICOSALE_TOKEN(),
  //   //   GET_ALL_USER_ICOSALE_TOKEN()
  //   // );

  //   // if (address) {
  //   //   GET_ALL_ICOSALE_TOKEN().resolve((token) => {
  //   //     setAllICOs(token);
  //   //     console.log("All users tokens", token);
  //   //   });
  //   //   GET_ALL_USER_ICOSALE_TOKEN().resolve((token) => {
  //   //     setAllUserIcos(token);
  //   //     console.log("Alli individual user tokens", token);
  //   //   });
  //   // }

  //   if (address) {
  //     async function logTokens() {
  //       const allIcoSaleTokens = await GET_ALL_ICOSALE_TOKEN();
  //       const allUserIcoSaleTokens = await GET_ALL_USER_ICOSALE_TOKEN();
  //       console.log(
  //         "all token, user tokens",
  //         allIcoSaleTokens,
  //         allUserIcoSaleTokens
  //       );
  //     }

  //     logTokens();
  //   }
  // }, []);

  useEffect(() => {
    //putting the if(address) condition will make this not to run
    async function logTokens() {
      const allIcoSaleTokens = await GET_ALL_ICOSALE_TOKEN();
      const allUserIcoSaleTokens = await GET_ALL_USER_ICOSALE_TOKEN();
      setAllICOs(allIcoSaleTokens);
      setAllUserIcos(allUserIcoSaleTokens);
      console.log(
        "all token, user tokens",
        allIcoSaleTokens,
        allUserIcoSaleTokens
      );
    }
    logTokens();
  }, [address, recall]);
  //recall is used to track  the number of time a token waa created or an ICO was created

  // useEffect(() => {
  //   fetchNFTs().then((item) => {
  //     setNfts(item.reverse());
  //     setNftsCopy(item);
  //     // console.log("nft", nfts);
  //   });
  //   //   //   //Check if providing the dependency array will help the filter not to misbehave above
  // }, []);

  //[addresss, recall]
  console.log("allToken", allICOs, address);
  console.log("allUSerToken", allUserIcos, address);

  return (
    <div>
      <Header
        accountBalance={accountBalance}
        setAddress={setAddress}
        address={address}
        connectWallet={connectWallet}
        ICO_MARKETPLACE_ADDRESS={ICO_MARKETPLACE_ADDRESS}
        shortenAddress={shortenAddress}
        openAllICO={openAllICO}
        setOpenAllICO={setOpenAllICO}
        setOpenTokenCreator={setOpenTokenCreator}
        openTokenCreato={openTokenCreator}
        setOpenTokenHistory={setOpenTokenHistory}
        openTokenHistory={openTokenHistory}
        setOpenICOMarketplace={setOpenICOMarketplace}
        openICOMarketplace={openICOMarketplace}
        setOpenCreateICO={setOpenCreateICO}
        openCreateICO={openCreateICO}
      />
      {openAllICO && (
        <ICOMarket
          array={allUserIcos}
          shortenAddress={shortenAddress}
          handleClick={setOpenAllICO}
          currency={currency}
        />
      )}
      {openICOMarketplace && (
        <ICOMarket
          array={allICOs}
          shortenAddress={shortenAddress}
          handleClick={setOpenICOMarketplace}
          currency={currency}
        />
      )}
      {openTokenCreator && (
        <TokenCreator
          createERC20={createERC20}
          shortenAddress={shortenAddress}
          setOpenTokenCreator={setOpenTokenCreator}
          setLoader={setLoader}
          address={address}
          connectWallet={connectWallet}
          PINATA_API_KEY={PINATA_API_KEY}
          PINATA_API_SECRET={PINATA_API_SECRET}
        />
      )}
      {openTokenHistory && (
        <TokenHistory
          shortenAddress={shortenAddress}
          setOpenTokenHistory={setOpenTokenHistory}
        />
      )}
      {openCreateICO && (
        <CreateICO
          shortenAddress={shortenAddress}
          setOpenCreateICO={setOpenCreateICO}
          setOpenAllICO={setOpenAllICO}
          connectWallet={connectWallet}
          address={address}
          createICOSALE={createICOSALE}
        />
      )}

      <div className="create">
        <h1 style={{ fontSize: "2rem" }}> All ICOs MarketPlace</h1>

        {allICOs?.length != 0 && (
          <>
            <Marketplace
              array={allICOs}
              shortenAddress={shortenAddress}
              setBuyIco={setBuyIco}
              setOpenBuyToken={setOpenBuyToken}
              currency={currency}
            />
            <h1>ICOS SHOULD BE HERE</h1>
          </>
        )}
      </div>
      {openBuyToken && <BuyToken buyIco={buyIco} />}
      {openTransferToken && <TokenTransfer />}
      {openWidthdrawToken && <WidthdrawToken />}
      {loader && <Loader />}
      <Footer />
      {/* <Loader /> */}
      {/* <div>{openAllICO}</div> */}
    </div>
  );
};

export default index;
