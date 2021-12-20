import { useContext, useState } from "react";
import { Button } from "./DashBoard";
import styled from "styled-components";
import { useChefContract, useTokenContract } from "../hooks/useContract";
import useAuth from "../hooks/useAuth";

import { approve } from "../utils/approve";
import { toast } from "react-toastify";
import { deposit, withdraw } from "../utils/poolUtils";
import { loadContext } from "../contexts/load-context";
import { dashboardContext } from "../contexts/dashboard-context";

export const Input = styled.input`
  padding: 0.3rem;
  background: transparent;
  border: 2px solid #245ce7;
  border-radius: 15px;
  //width: 10rem;

  position: relative;
  + span {
    display: block;
    position: absolute;
    top: 50%;
    right: 0;
    padding: 1rem;
    font-size: 1rem;
    transform: translate(0, -50%);
  }
`;
const StackingManager = () => {
  const { activeLoad, disableLoad } = useContext(loadContext);

  const [depositMode, setDepositMode] = useState(false);
  const [unstackMode, setUnstackMode] = useState(false);
  const [value, setValue] = useState(null);
  const { account } = useAuth();

  const [locked, setLocked] = useState(false);

  const contract = useTokenContract();
  const chef = useChefContract();
  const { ERC20Balance, totalDeposited } = useContext(dashboardContext);

  return (
    <div className=" text-xl mt-8">
      {!depositMode && !unstackMode && (
        <div className="flex justify-center flex-wrap">
          <Button
            onClick={() => {
              setDepositMode(true);
              setUnstackMode(false);
            }}
            className="mx-4 hover-text hover-border mb-2"
          >
            Stake
          </Button>
          <button
            onClick={() => {
              setUnstackMode(true);
              setDepositMode(false);
            }}
            className="text-primary mx-4 hover-text hover-border"
          >
            Unstake
          </button>
        </div>
      )}
      {depositMode && (
        <form
          className="block sm:flex mb-8 justify-center flex-wrap"
          onSubmit={async (e) => {
            e.preventDefault();
            if (locked) return;
            setLocked(true);

            const allowance = await contract.allowance(account, chef.address);
            activeLoad();
            if (!(allowance > 0)) {
              approve(contract, chef)
                .then(() => {
                  setLocked(false);
                  setDepositMode(false);
                  return deposit(chef, value).then((resolve) => {
                    return resolve.wait();
                  });
                })
                .then(() => {
                  disableLoad();
                  toast.success("You deposit has ben success");
                })
                .catch((err) => {
                  console.error(err);
                  setLocked(false);
                  disableLoad();
                });
            } else {
              deposit(chef, value)
                .then((resolve) => {
                  setLocked(false);
                  setDepositMode(false);

                  return resolve.wait();
                })
                .then(() => {
                  disableLoad();
                  toast.success("You deposit has ben success");
                })
                .catch((err) => {
                  console.error(err);
                  setLocked(false);
                  disableLoad();
                });
            }
          }}
        >
          <div className="relative mx-2 inline-block">
            <Input
              required
              value={value}
              onChange={({ target }) => {
                const formated = target.value
                  .replace(" ", "")
                  .replace(",", ".")
                  .replace("..", ".")
                  .replace(/[^0-9.]/, "");
                setValue(formated);
              }}
              placeholder="1.0"
              type="text"
              name="deposit"
            />
            <span>ET</span>
            <span
              className="block w-full cursor-pointer text-xs text-right pr-2 absolute"
              onClick={() => {
                setValue(ERC20Balance);
              }}
            >
              max
            </span>
          </div>
          <Button className="hover-border hover-text mx-2 mt-8 sm:mt-0">
            Deposit
          </Button>
        </form>
      )}
      {unstackMode && (
        <form
          className="block sm:flex mb-8 justify-center flex-wrap"
          onSubmit={async (e) => {
            e.preventDefault();
            if (locked) return;
            setLocked(true);

            const allowance = await contract.allowance(account, chef.address);
            activeLoad();
            if (!(allowance > 0)) {
              approve(contract, chef)
                .then(() => {
                  setLocked(false);
                  setDepositMode(false);
                  return withdraw(chef, value).then((resolve) => {
                    return resolve.wait();
                  });
                })
                .then(() => {
                  disableLoad();
                  toast.success("You deposit has ben success");
                })
                .catch((err) => {
                  console.error(err);
                  setLocked(false);
                  disableLoad();
                });
            } else {
              withdraw(chef, value)
                .then((resolve) => {
                  setLocked(false);
                  setDepositMode(false);

                  return resolve.wait();
                })
                .then(() => {
                  disableLoad();
                  toast.success("You deposit has ben success");
                })
                .catch((err) => {
                  console.error(err);
                  setLocked(false);
                  disableLoad();
                });
            }
          }}
        >
          <div className="relative mx-2 inline-block">
            <Input
              required
              value={value}
              onChange={({ target }) => {
                const formated = target.value
                  .replace(" ", "")
                  .replace(",", ".")
                  .replace("..", ".")
                  .replace(/[^0-9.]/, "");
                setValue(formated);
              }}
              placeholder="1.0"
              type="text"
              name="deposit"
            />
            <span>ET</span>
            <span
              className="block w-full cursor-pointer text-xs text-right pr-2 absolute"
              onClick={() => {
                contract
                  .decimals()
                  .then((decimals) => {
                    return decimals;
                  })
                  .then((decimals) => {
                    setValue(totalDeposited);
                  });
              }}
            >
              max
            </span>
          </div>
          <Button className="hover-border hover-text mx-2 mt-8 sm:mt-0">
            Withdraw
          </Button>
        </form>
      )}
      {(depositMode || unstackMode) && (
        <span
          className="text-primary cursor-pointer"
          onClick={() => {
            setDepositMode(false);
            setUnstackMode(false);
            setValue(null);
          }}
        >
          cancel
        </span>
      )}
    </div>
  );
};
export default StackingManager;
