import { ethers } from "ethers";

export const  deposit = (contract,value) => {
  return contract.deposit(
    ethers.utils.parseEther(value).toString()
  )
};

export const  withdraw = (contract,value) => {
  return contract.withdraw(
    ethers.utils.parseEther(value).toString()
  )
};