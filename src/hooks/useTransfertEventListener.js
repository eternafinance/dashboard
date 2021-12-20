import { utils } from "ethers";

export const useTransfertEventListener = (
  contract,
  provider,
  callBack
) => {
  const filter = {
    address: contract.address,
    topics: [
      // the name of the event, parnetheses containing the data type of each event, no spaces
      utils.id("Transfer(address,address,uint256)"),
    ],
  };
  provider.on(filter, callBack);
};
