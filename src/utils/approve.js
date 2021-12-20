import { ethers } from "ethers";
import { MaxUint256 } from '@ethersproject/constants'
export const approve = async (contract,chef) => {
  console.log('ok')
  return contract
    .approve(
      chef.address,
      MaxUint256
    )
    .then((resolve) => resolve.wait())
    .catch(err => console.error(err))
    
}