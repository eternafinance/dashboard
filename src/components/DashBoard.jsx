import { BigNumber, ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { dashboardContext } from "../contexts/dashboard-context.jsx";
import useAuth from "../hooks/useAuth.js";
import {
  useReadOnlyChefContract,
  useReadOnlyTokenContract,
} from "../hooks/useContract.js";
import { approve } from "../utils/approve.js";
import StackingManager from "./StackingManager.jsx";

const Details = styled.ul`
  display: flex;
  flex-wrap: wrap;
  text-transform: uppercase;
  width: 100%;
  > li {
    text-align: center;
    padding: 1.2rem;
    width: 100%;
    > span {
      display: block;

      &:first-child {
        color: #9d9ca1;
        font-size: 0.8rem;
        margin-bottom: 0.2rem;
      }
      &:nth-child(2) {
        font-weight: bold;
      }
    }
  }
  @media screen and (min-width: 768px) {
    > li {
      width: 33.33%;
    }
  }
`;

export const Button = styled.button`
  padding: 0.4rem 3rem;
  border-radius: 15px;
  border: 2px solid #245ce7;
  color: #245ce7;
  font-weight: bold;
`;

export const BlueButton = styled.button`
  padding: 0.4rem 3rem;
  border-radius: 15px;
  background: #245ce7;
  font-weight: bold;
  transition: all 500ms;
  &:hover {
    background: #143ea6;
  }
`;

export const StackingDetails = styled.ul`
  > li {
    display: flex;
    > * {
      width: 50%;
      &:first-child {
        text-align: left;
      }
      &:nth-child(2) {
        text-align: right;
      }
    }
  }
`;

export const Separation = styled.div`
  height: 1px;
  margin: 3rem 0;
  background: #fff;
  opacity: 0.2;
`;

const DashBoard = () => {
  const contract = useReadOnlyTokenContract();
  const chef = useReadOnlyChefContract();
  const { active, account, login, logout } = useAuth();
  const accountConverted = account ? account.toString() : "";

  const {
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
  } = useContext(dashboardContext);

  return (
    <div className="p-10 relative">
      <div className="px-10 md:p-20 py-10 bg-box rounded-xl relative">
        <span className="top0 absolute right-0 p-4 text-primary">
          {!active && (
            <>
              <span
                className="cursor-pointer hover-text"
                onClick={() => login()}
              >
                Connect wallet
              </span>
            </>
          )}
          {active && (
            <>
              <span className="mr-4">
                Balance: {ERC20Balance} {ERC20Name}
              </span>
              <span className="mr-4">
                0x***
                {accountConverted.slice(
                  accountConverted.length - 4,
                  accountConverted.length
                )}
              </span>
              <span
                className="cursor-pointer hover-text"
                onClick={() => {
                  logout();
                  localStorage.removeItem("login");
                }}
              >
                Disconnect
              </span>
            </>
          )}
        </span>
        <Details>
          <li>
            <span>APY</span>
            <span>{Math.round(apy * 100) / 100}%</span>
          </li>
          <li>
            <span>Current MC</span>
            <span>${marketcap}</span>
          </li>
          <li>
            <span>Current price</span>
            <span>${price}</span>
          </li>
          <li>
            <span>Tokens deposited</span>
            <span>
              {" "}
              {userInfo?.amount
                ? ethers.utils.formatEther(userInfo?.amount)
                : 0}
            </span>
          </li>
          <li>
            <span>Tokens earned</span>
            <span>{remainingRewards} ET</span>
          </li>
          <li>
            <span>Total tokens staked</span>
            <span>{totalDeposited} ET</span>
          </li>
        </Details>
        <StackingManager />
        {!(allowance > 0) && (
          <div className="md:flex mt-10">
            <p className="mb-10 md:mb-none md:mr-10 text-left block">
              Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum
              dolor sit amet Lorem ipsum dolor sit amet
            </p>
            <div className="md:flex flex-col justify-center">
              <BlueButton onClick={() => approve(contract, chef)}>
                Approve
              </BlueButton>
            </div>
          </div>
        )}

        <Separation />
        <StackingDetails>
          <li>
            <span>Unstacked Balance</span>
            <span>{ERC20Balance}ET</span>
          </li>
          <li>
            <span>Stacked Balance</span>
            <span>
              {userInfo?.amount
                ? ethers.utils.formatEther(userInfo?.amount)
                : 0}
              ET
            </span>
          </li>
          <li>
            <span>Next reward amount</span>
            <span>{pendingReward} ET</span>
          </li>
          <li>
            <span> Next reward yield</span>
            <span>{pendingReward} ET</span>
          </li>
          <li>
            <span>Roi(5-day rate)</span>
            <span>{Math.round(roi * 100) / 100}</span>
          </li>
        </StackingDetails>
      </div>
    </div>
  );
};

export default DashBoard;
