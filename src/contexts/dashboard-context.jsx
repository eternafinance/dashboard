/* eslint-disable react-hooks/exhaustive-deps */
import { BigNumber, ethers } from "ethers";
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import {
  useReadOnlyChefContract,
  useReadOnlyTokenContract,
  useReadOnlyUniswapRouterContract,
} from "../hooks/useContract";
import { USDT, WETH } from "../utils/contractHelpers";

const dashboardContext = React.createContext({
  ERC20Name: null,
  ERC20Balance: null,
  apy: null,
  totalDeposited: null,
  userInfo: {},
  remainingRewards: null,
});

const DashboardProvider = ({ children }) => {
  const { active, account } = useAuth();

  const contract = useReadOnlyTokenContract();
  const chef = useReadOnlyChefContract();

  const router = useReadOnlyUniswapRouterContract();

  const [ERC20Name, setERC20Name] = useState(null);
  const [ERC20Balance, setERC20Balance] = useState(null);
  const [allowance, setAllowance] = useState(0);
  const [apy, setApy] = useState(null);
  const [totalDeposited, setTotalDeposited] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [remainingRewards, setRemainingRewards] = useState(0);
  const [interval, setIntervalKey] = useState(0);
  const [pendingReward, setPendingReward] = useState(null);
  const [marketcap, setMarketcap] = useState(null);
  const [price, setPrice] = useState(null);
  const [roi, setRoi] = useState(null);

  const { Provider } = dashboardContext;

  const formatAmount = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const calcPriceAndMarketcap = async () => {
    const usdtPair = await router.getAmountsOut(ethers.utils.parseEther("1"), [
      WETH,
      USDT,
    ]);

    const tokenPair = await router.getAmountsOut(ethers.utils.parseEther("1"), [
      WETH,
      contract.address,
    ]);

    const totalSupply = await contract.totalSupply();

    //const ethPrice = ethers.utils.formatEther(usdtPair[1]);

    const completPrice =
      ethers.utils.formatEther(usdtPair[1]) /
      ethers.utils.formatEther(tokenPair[1]);

    const price = Math.round(completPrice * 100) / 100;
    const marketcap = formatAmount(
      Math.round(price * ethers.utils.formatEther(totalSupply))
    );
    setPrice(price);
    setMarketcap(marketcap);
  };
  useEffect(() => {
    if (interval) {
      clearInterval(interval);
    }
    setIntervalKey(
      setInterval(() => {
        let rewardPerBlock = 0;
        chef
          .rewardsPerBlock()
          .then((reward) => {
            rewardPerBlock = reward;
            return chef.poolInfo(0);
          })
          .then((poolInfo) => {
            let deposited = poolInfo.currentDepositAmount;
            if (deposited.eq(BigNumber.from(0))) deposited = 1;

            setTotalDeposited(
              ethers.utils.formatEther(poolInfo.currentDepositAmount)
            );
            setApy((rewardPerBlock * 5760) / deposited);
            setRoi(
              (rewardPerBlock * 6350 * 365) / poolInfo.currentDepositAmount
            );
            return chef.remainingRewards();
          })
          .then((rewards) => {
            setRemainingRewards(ethers.utils.formatEther(rewards));
          });

        if (account) {
          contract
            .allowance(account, chef.address)
            .then((allowance) => {
              setAllowance(allowance);
              return chef.userInfo(account);
            })
            .then((userInfo) => {
              setUserInfo(userInfo);
            });
          chef.pendingRewards(account).then((peding) => {
            setPendingReward(
              Math.round(ethers.utils.formatEther(peding) * 100) / 100
            );
          });
        }

        calcPriceAndMarketcap();

        if (active) {
          contract.symbol().then(setERC20Name);
          contract
            .decimals()
            .then((decimals) => {
              return decimals;
            })
            .then((decimals) => {
              contract.balanceOf(account).then((balance) => {
                const div = ethers.BigNumber.from(10);
                setERC20Balance(balance.div(div.pow(decimals)).toString());
              });
            });
        }
      }, 5000)
    );
  }, [chef, account, contract, active]);

  return (
    <Provider
      value={{
        ERC20Name,
        ERC20Balance,
        allowance,
        apy,
        totalDeposited,
        userInfo,
        remainingRewards,
        pendingReward,
        price,
        marketcap,
        roi,
      }}
    >
      {children}
    </Provider>
  );
};

export { dashboardContext, DashboardProvider };
