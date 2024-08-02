import React, {
  useState,
  useContext,
  createContext,
  useEffect,
  Children,
} from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
//toaster to display the notification
import toast from "react-hot-toast";

//INTERNAL IMPORT

import {
  ERC20Generator,
  ERC20Generator_BYTECODE,
  handleNetworkSwitch,
  shortenAddress,
  ICO_MARKETPLACE_ADDRESS,
  ICO_MARKETPLACE_CONTRACT,
  TOKEN_CONTRACT,
  PINATA_API_KEY,
  PINATA_API_SECRET,
  ERC20Generator_ABI,
} from "./constants";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  //STATE VARIABLE
  const [address, setAddress] = useState();
  const [accountBalance, setAccountBalance] = useState("");
  const [loader, setLoader] = useState(false);
  const [recall, setRecall] = useState(0);
  const [currency, setCurrency] = useState("MATIC");

  //COMPONENT
  const [openBuyToken, setOpenBuyToken] = useState(false);
  const [openWidthdrawToken, setOpenWidthdrawToken] = useState(false);
  const [openTransferToken, setOpenTransferToken] = useState(false);
  const [openTokenCreator, setOpenTokenCreator] = useState(false);
  const [openCreateICO, setOpenCreateICO] = useState(false);

  //let write notification function which takes two argumen, msg, duration it will last

  const notifySuccess = (msg) => toast.success(msg, { duration: 2000 });
  const notifyError = (msg) => toast.error(msg, { duration: 2000 });

  //FUNCTIONS
  //CHECK IF WALLET IS CONNECTED
  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum) return notifyError("No account found");
      //here immediately the metamask is called, the handlwswitch function will check if
      //we are connected with our defined network, if not, it wwill use the one defined default by metamask or choosen by user in metamask
      await handleNetworkSwitch();

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setAddress(accounts[0]);

        //lets get the balance of the account immediately it is connected
        //and the account addresss found
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        //on the provider, we have method called get balance
        const getbalance = await provider.getBalance(accounts[0]);
        //format the balance from ether to readable form
        const bal = ethers.utils.formatEther(getbalance);
        setAccountBalance(bal);
        // setAddresss(accounts[0]);

        return accounts[0];
      } else {
        notifyError("No account found");
      }
    } catch (error) {
      notifyError("No account found");
    }
  };

  useEffect(() => {
    checkIfWalletConnected();
  }, [address]);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) return notifyError("No account found");
      //here immediately the metamask is called, the handlwswitch function will check if
      //we are connected with our defined network, if not, it wwill use the one defined default by metamask or choosen by user in metamask
      await handleNetworkSwitch();
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        //on the provider, we have method called get balance
        const getbalance = await provider.getBalance(accounts[0]);
        //format the balance from ether to readable form
        const bal = ethers.utils.formatEther(getbalance);
        console.log("balance of token", bal);
        setAccountBalance(bal);
        setAddress(accounts[0]);

        // const web3modal = new Web3Modal();
        // const connection = await web3modal.connect();
        // const provider = new ethers.providers.Web3Provider(connection);
        //lets get the balance of the account immediately it is connected and the account addresss found

        return accounts[0];
      } else {
        notifyError("No account found");
      }
    } catch (error) {
      console.log(error);
      notifyError("No account found");
    }
  };

  //TOKEN Creation will have two functions, internal and the one to attach on the front end
  //MAIN FUNCTION
  const _deployContract = async (
    signer,
    account,
    name,
    symbol,
    supply,
    imageUrl
  ) => {
    try {
      const factory = new ethers.ContractFactory(
        ERC20Generator_ABI,
        ERC20Generator_BYTECODE,
        signer
      );

      const totalSupply = Number(supply);

      const _initialSupply = ethers.utils.parseEther(
        totalSupply.toString(),
        "ether"
      );

      let contract = await factory.deploy(_initialSupply, name, symbol);

      const transaction = await contract.deployed();

      if (contract.address) {
        const today = Date.now();
        //format the date
        let date = new Date(today);
        const _tokenCreatedDate = date.toLocaleDateString("en-US");

        //now let's build our token object
        //this will be stored in the local storage
        const _token = {
          account: account,
          supply: supply.toString(),
          name: name,
          symbol: symbol,
          tokenAddresss: contract.address,
          transactionHash: contract.deployTransaction.hash,
          createdAt: _tokenCreatedDate,
          logo: imageUrl,
        };
        //since one user can create more than one token,
        //we will check the local storage to check if the token exist in local storage and get it and update, else we will update
        //straight away to new one to the local storage

        let tokenHistory = [];

        const history = localStorage.getItem("TOKEN_HISTORY");
        if (history) {
          tokenHistory = JSON.parse(localStorage.getItem("TOKEN_HISTORY"));
          tokenHistory.push(_token);
          localStorage.setItem("TOKEN_HISTORY", JSON.stringify(tokenHistory));
          setLoader(false);
          setRecall(recall + 1); //this will call all the fetching
          //funcion internally that we don't need to reload the page
          setOpenTokenCreator(false); //we have to close the component of token creator
        } else {
          tokenHistory.push(_token);
          localStorage.setItem("TOKEN_HISTORY", JSON.stringify(tokenHistory));
          setLoader(false);
          setRecall(recall + 1); //this will call all the fetching
          //funcion internally that we don't need to reload the page
          setOpenTokenCreator(false);
        }
      }
    } catch (error) {
      setLoader(false);
      notifyError("Something went wrong, try later");
      console.log(error);
      console.log(error);
    }
  };

  const createERC20 = async (token, account, imageUrl) => {
    const { name, symbol, supply } = token;

    try {
      setLoader(true);
      notifySuccess("Creating token ...");
      if (!name || !symbol || !supply) {
        notifyError("Please fill all the fields");
      } else {
        const web3modal = new Web3Modal();
        const connection = await web3modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);

        const signer = provider.getSigner();

        _deployContract(signer, account, name, symbol, supply, imageUrl);
      }
    } catch (error) {
      setLoader(false);
      notifyError("Something went wrong, try later");
      console.log(error);
    }
  };
  const GET_ALL_USER_ICOSALE_TOKEN = async () => {
    try {
      setLoader(true);
      const address = await connectWallet();
      const contract = await ICO_MARKETPLACE_CONTRACT();

      if (address) {
        const allICOSaleToken = await contract.getTokenCreatedBy(address);

        const _tokenArray = await Promise.all(
          allICOSaleToken.map(async (token) => {
            const tokenContract = await TOKEN_CONTRACT(token?.token);
            const balance = await tokenContract.balanceOf(
              ICO_MARKETPLACE_ADDRESS
            );

            //lets check if the token the user wants to buy is available in out
            // ICO_MARKETPLACE for the user to purshase or not

            return {
              creator: token.creator,
              token: token.token, //this for the token address in this context
              name: token.name,
              symbol: token.symbol,
              supported: token.supported,
              price: ethers.utils.formatEther(token?.price.toString()),
              icoSaleBal: ethers.utils.formatEther(balance.toString()),
            };
          })
        );

        setLoader(false);
        return _tokenArray;
      }
    } catch (error) {
      notifyError("Something went wrong");
      console.log(error);
    }
  };
  const GET_ALL_ICOSALE_TOKEN = async () => {
    try {
      setLoader(true);
      const address = await connectWallet();
      //   const contract = await ICO_MARKETPLACE_CONTRACT();

      if (address) {
        const allICOSaleToken = await contract.getAllTokens();

        const _tokenArray = await Promise.all(
          allICOSaleToken.map(async (token) => {
            const tokenContract = await TOKEN_CONTRACT(token?.token);
            const balance = await tokenContract.balanceOf(
              ICO_MARKETPLACE_ADDRESS
            );

            // console.log("balance ICO", balance);

            return {
              creator: token.creator,
              token: token.token,
              name: token.name,
              symbol: token.symbol,
              supported: token.supported,
              price: ethers.utils.formatEther(token?.price.toString()),
              icoSaleBal: ethers.utils.formatEther(balance.toString()),
            };
          })
        );

        setLoader(false);
        return _tokenArray;
      }
    } catch (error) {
      notifyError("Something went wrong");
      console.log(error);
    }
  };
  const createICOSALE = async (icoSale) => {
    try {
      const { address, price } = icoSale;
      // console.log("address,price", address, price);

      if (!address || !price) return notifyError("Data is Misssing");

      setLoader(true);

      notifySuccess("Creating icoSale...");
      // notifySuccess("Creating icoSale...");
      await connectWallet();

      const contract = await ICO_MARKETPLACE_CONTRACT();

      const payAmount = ethers.utils.parseUnits(price.toString(), "ether");

      console.log("payAmount", payAmount);

      const transaction = await contract.createICOSale(address, payAmount, {
        gasLimit: ethers.utils.hexlify(800000),
      });

      await transaction.wait();

      if (transaction.hash) {
        setLoader(false);
        setOpenCreateICO(false);
        setRecall(recall + 1);
      }
    } catch (error) {
      setLoader(false);
      setOpenCreateICO(false);
      notifyError("Something went wrong");
      console.log(error);
    }
  };

  const buyToken = async (tokenAddresss, tokenQuantity) => {
    try {
      setLoader(true);
      notifySuccess("Purchasing token ...");

      if (!tokenQuantity || tokenAddresss) return notifyError("Data Missing");

      const address = await connectWallet();
      const contract = await ICO_MARKETPLACE_ADDRESS();

      //lets check if the token the user wants to buy is available in out
      // ICO_MARKETPLACE for the user to purshase or not

      const _tokenBal = await contract.getBalance(tokenAddresss);
      const _tokenDetails = await contract.getTokenDetails(tokenAddresss);

      //converting the tokenBalance
      const availableToken = ethers.utils.formatEther(_tokenBal.toString());

      if (availableToken > 0) {
        //total price the buyer will pay
        const price =
          ethers.utils.formatEther(_tokenDetails.price.toString()) *
          Number(tokenQuantity);

        const payAmount = ethers.utils.parseUnits(price.toString(), "ether");

        const transaction = await contract.buyToken(
          tokenAddresss,
          Number(tokenQuantity),
          {
            value: payAmount.toString(),
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();
        setLoader(false);
        setRecall(recall + 1);
        setOpenBuyToken(false);
        notifySuccess("Transaction completed successfully");
      } else {
        setLoader(false);
        setOpenBuyToken(false);
        notifyError("Your token balance is 0");
      }
    } catch (error) {
      setLoader(false);
      setOpenBuyToken(false);
      notifyError("Something went wrong");
      console.log(error);
    }
  };
  const transferTokens = async (transferTokenData) => {
    console.log("transferTokenData Context", transferTokenData);
    try {
      if (
        !transferTokenData.address ||
        !transferTokenData.amount ||
        !transferTokenData.tokenAdd
      )
        return notifyError("Data is Missing");

      setLoader(true);
      notifySuccess("transaction is processing");
      const address = await connectWallet();

      console.log("address transfer context", address);
      const contract = await ICO_MARKETPLACE_CONTRACT();

      const _availableBal = await contract.balanceOf(address); //to check if the user has any balance of the token the user wants to transfer
      console.log("_availableBal", _availableBal);
      const availableToken = ethers.utils.formatEther(_availableBal.toString());
      console.log("availableToken", availableToken);
      if (availableToken > 1) {
        const payAmount = ethers.utils.parseUnits(
          transferTokenData.amount.toString(),
          "ether"
        ); //amount of token to transfer
        console.log("payAmount", payAmount);
        const transaction = await contract.transfer(
          transferTokenData.address,
          payAmount,
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();
        console.log("transaction hash", transaction.hash);
        setLoader(false);
        setRecall(recall + 1);
        setOpenTransferToken(false);
        notifySuccess("Transaction completed successfully");
      } else {
        setLoader(false);
        setRecall(recall + 1);
        setOpenTransferToken(false);
        notifySuccess("Your balance is 0");
      }
    } catch (error) {
      setLoader(false);
      setRecall(recall + 1);
      setOpenTransferToken(false);
      notifySuccess("Something went wrong");
      console.log(error);
    }
  };

  const widthdrawToken = async (widthdrawQuantity) => {
    try {
      if (!widthdrawQuantity.account || !widthdrawQuantity.token)
        return notifyError("Data is Missing");

      setLoader(true);
      notifySuccess("transaction is processing");

      const address = await connectWallet();
      const contract = await ICO_MARKETPLACE_CONTRACT();

      const payAmount = ethers.utils.parseUnits(
        widthdrawQuantity.amount.toString(),
        "ether"
      );
      const transaction = await contract.withdrawToken(
        widthdrawQuantity.token,
        payAmount,
        {
          gasLimit: ethers.utils.hexlify(8000000),
        }
      );

      await transaction.wait();
      setLoader(false);
      notifySuccess("Transaction completed successfully");
      setOpenWidthdrawToken(false);
      setRecall(recall + 1);
    } catch (error) {
      await transaction.wait();
      setLoader(false);
      notifyError("Something went wrong");
      setOpenWidthdrawToken(false);
      setRecall(recall + 1);
      console.log(error);
    }
  };
  return (
    <StateContext.Provider
      value={{
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
        setOpenTransferToken,
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
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
