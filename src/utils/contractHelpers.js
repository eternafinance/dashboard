import { Contract } from "@ethersproject/contracts";
import { accountLessProvider } from "./injected";
import tokenAbi from '../config/abi/token.json';
import chefAbi from '../config/abi/chef.json';
import lpAbi from '../config/abi/lp.json';
import routerAbi from '../config/abi/swap-router.json';
export const getContract = (address, abi, web3) => {
  const provider = web3 ?? accountLessProvider;

  return new Contract(address, abi, provider);
};


export const WETH = "0xae13d989dac2f0debff460ac112a837c89baa7cd";
export const USDT = "0x78867bbeef44f2326bf8ddd1941a4439382ef2a7"

export const getTokenContract = (web3) => {
  return getContract(
    "0x65a3132c940f97D6D10E1B668bFdD82578138770",
    tokenAbi,
    web3
  );
};

export const getUniSwapRouterContract = (web3) => {
  return getContract(
    "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3",
    routerAbi,
    web3
  )
}
export const getLP = (web3) => {
  return getContract(
    "0x52A0fD20f365d0a0EEcC7614bA4fC2e1299683c9",
    lpAbi,
    web3,
  )
}
export const getChefContract = (web3) => {
  return getContract(
    "0xAaF1f11007987be5085afb1B5AD7A7aADd28d40F",
    chefAbi,
    web3
  );
};
