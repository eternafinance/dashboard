import { Web3Provider } from "@ethersproject/providers";
import { InjectedConnector } from "@web3-react/injected-connector";
import { ethers } from "ethers";
import getNodeUrl from "./getRpcUrl";

export const injected = new InjectedConnector({
  supportedChainIds: [Number(process.env.REACT_APP_CHAIN_ID)],
});

export const getLibrary = (provider) => {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
};

export const accountLessProvider = new ethers.providers.JsonRpcProvider(
  getNodeUrl()
);
