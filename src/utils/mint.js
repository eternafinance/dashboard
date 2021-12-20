import { ethers } from "ethers";
export const mintNFT = async (
  contract,
  erc20,
  numberOfMint
) => {
  const price = Number(process.env.REACT_APP_MINT_PRICE);
  const value = price * numberOfMint;
  const nonce = await contract.signer.getTransactionCount();
  const signerAddress = erc20 ? await erc20.signer.getAddress() : null;

  const mint = () => {
    if (erc20) {
      return contract.mint(numberOfMint).then((resolve) => {
        return resolve.wait();
      });
    } else {
      return contract
        .mint({
          value: ethers.utils.parseEther(value.toString()),
          nonce: ethers.BigNumber.from(nonce),
        })
        .then((resolve) => {
          return resolve.wait();
        });
    }
  };

  if (erc20) {
    const allowance = await erc20.allowance(signerAddress, contract.address);

    if (allowance < value) {
      return erc20
        .approve(
          contract.address,
          ethers.utils.parseEther((price * 1000).toString())
        )
        .then((resolve) => resolve.wait())
        .then(() => mint());
    } else {
      return mint();
    }
  } else {
    return mint();
  }
};
