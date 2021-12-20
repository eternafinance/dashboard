import { Contract } from "@ethersproject/contracts";

export const sellNFT = async (
  nftContract,
  marketPlaceContract,
  nftId,
  price
) => {
  const allowance = await nftContract.getApproved(nftId);

  const sell = () => {
    return marketPlaceContract
      .createAskOrder(nftContract.address, nftId, price)
      .then((resolve) => resolve.wait());
  };

  if (Number(allowance) === 0) {
    //nftContract.approve(marketPlaceContract.address, nftId);
    return nftContract
      .approve(marketPlaceContract.address, nftId)
      .then((resolve) => resolve.wait())
      .then(() => sell());
  } else {
    return sell();
  }
};
