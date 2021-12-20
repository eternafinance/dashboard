/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect } from "react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector,
} from "@web3-react/walletconnect-connector";
import { injected } from "../utils/injected";
import { toast } from "react-toastify";
import { setupNetwork } from "../utils/wallet";

const useAuth = () => {
  const { activate, deactivate, account, active, library } = useWeb3React();

  useEffect(() => {
    if (active) {
      localStorage.setItem("login", account);
    } else {
      if (localStorage.getItem("login")) {
        login();
      }
    }
  }, []);

  const login = useCallback(() => {
    const connector = injected;
    if (connector) {
      activate(connector, async (error) => {
        if (error instanceof UnsupportedChainIdError) {
          const hasSetup = await setupNetwork();
          if (hasSetup) {
            activate(connector);
          }
        } else {
          if (error instanceof NoEthereumProviderError) {
            toast("Provider Error : No provider was found");
          } else if (
            error instanceof UserRejectedRequestErrorInjected ||
            error instanceof UserRejectedRequestErrorWalletConnect
          ) {
            if (connector instanceof WalletConnectConnector) {
              const walletConnector = connector;
              walletConnector.walletConnectProvider = null;
            }
            toast(
              "Authorization Error : Please authorize to access your account"
            );
          } else {
            toast(error.name + " : " + error.message);
          }
        }
      });
    } else {
      toast("Can't find connector : The connector config is wrong");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { login, logout: deactivate, account, active, web3: library };
};

export default useAuth;
