import { accountLessProvider } from "../utils/injected";
import useAuth from "./useAuth";

/**
 * Provides a web3 instance using the provider provided by useWallet
 * with a fallback of an httpProver
 * Recreate web3 instance only if the provider change
 */
const useWeb3 = () => {
  const { web3: library } = useAuth();

  return library ? library.getSigner() : accountLessProvider;
};

export default useWeb3;
