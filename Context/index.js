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
  shortenAddresss,
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
  const [addresss, setAddresss] = useState();
  const [accountBalance, setAccountBalance] = useState(null);
  const [loader, setLoader] = useState(false);
  const [recall, setRecall] = useState(0);
  const [currency, setCurrency] = useState("MATIC");

  //COMPONENT
  const [openBuyToken, setOpenBuyToken] = useState(false);
  const [openWidthdrawToken, setOpenWidthdrawToken] = useState(false);
  const [openTransferToken, setOpenTransferToken] = useState(false);
  const [openTokenCreator, setOpenTokenCreator] = useState(false);
  const [openCreatedICO, setOpenCreatedICO] = useState(false);

  //let write notification function which takes two argumen, msg, duration it will last

  const notifySuccess = (msg) => toast.success(msg, { duration: 200 });
  const notifyError = (msg) => toast.error(msg, { duration: 200 });

  //FUNCTIONS
  //CHECK IF WALLET IS CONNECTED
  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum) return notifyError("No account found");
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setAddresss(accounts[0]);

        //lets get the balance of the account immediately it is connected and the account addresss found
        const provider = new ethers.providers.Web3Provider(connection);
        //on the provider, we have method called get balance
        const getbalance = await provider.getBalance(accounts[0]);
        //format the balance from ether to readable form
        const bal = ethers.utils.formatEther(getbalance);
        setAccountBalance(bal);

        return accounts[0];
      } else {
        notifyError("No account found");
      }
    } catch (error) {
      console.log(error);
      notifyError("No account found");
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) return notifyError("No account found");
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length) {
        setAddresss(accounts[0]);

        //lets get the balance of the account immediately it is connected and the account addresss found
        const provider = new ethers.providers.Web3Provider(connection);
        //on the provider, we have method called get balance
        const getbalance = await provider.getBalance(accounts[0]);
        //format the balance from ether to readable form
        const bal = ethers.utils.formatEther(getbalance);
        setAccountBalance(bal);

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
          localStorage.setItem("TOKEN_HISTORY", tokenHistory);
          setLoader(false);
          setRecall(recall + 1); //this will call all the fetching
          //funcion internally that we don't need to reload the page
          setOpenTokenCreator(false); //we have to close the component of token creator
        } else {
          tokenHistory.push(_token);
          localStorage.setItem("TOKEN_HISTORY", tokenHistory);
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
      notifyError("Creating token ...");
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
  const GET_ALL_ICOSALE_TOKEN = async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };
  const GET_ALL_USER_ICOSALE_TOKEN = async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };
  const createICOSALE = async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };
  const buyToken = async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };
  const transferTokens = async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };
  const widthdrawToken = async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };
  return <StateContext.Provider value={{}}>{children}</StateContext.Provider>;
};
