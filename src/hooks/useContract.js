import { useMemo } from "react";

import { getChefContract, getLP, getTokenContract, getUniSwapRouterContract } from "../utils/contractHelpers";
import { accountLessProvider } from "../utils/injected";
import useWeb3 from "./useWeb3";

export const useTokenContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getTokenContract(web3), [web3]);
};

export const useReadOnlyTokenContract = () => {
  return useMemo(() => getTokenContract(accountLessProvider), []);
};
export const useReadOnlyChefContract = () => {
  return useMemo(() => getChefContract(accountLessProvider), []);
};
export const useReadOnlyLPContract = () => {
  return useMemo(() => getLP(accountLessProvider),[])
}
export const useReadOnlyUniswapRouterContract = () => {
  return useMemo(() => getUniSwapRouterContract(accountLessProvider),[])
}

export const useChefContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getChefContract(web3), [web3]);
};
