import { Web3ReactProvider } from '@web3-react/core';
import { ToastContainer } from 'react-toastify';

import DashBoard from './components/DashBoard';
import { getLibrary } from './utils/injected';

import "react-toastify/dist/ReactToastify.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import Loader from "react-loader-spinner";

import styled from 'styled-components';
import { useContext } from 'react';
import { loadContext } from './contexts/load-context';
import './App.css';
import { DashboardProvider } from './contexts/dashboard-context';

const Load = styled.div`
  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background: rgba(0,0,0,0.3);
  z-index:9999;
  > * {
    position:absolute;
    left:50%;
    top:50%;
    transform:translate(-50%,-50%);
    z-index: 999;
  }

`
function App() {
  
  const { load } = useContext(loadContext)
  return (
    <div className="App">
      
      <Web3ReactProvider getLibrary={getLibrary} id="page-wrap">
        <DashboardProvider>
          <DashBoard/>
        </DashboardProvider>
        <div className="fixed z-50 w-full" style={{ top: "0", right: "0" }}>
          <ToastContainer className="fixed right-0 top-O z-50" />
        </div>
      {load && (
        <Load>
          <div>
            <Loader
              type="Puff"
              color="#00BFFF"
              height={100}
              width={100}
      
            />
          </div>
        </Load>
      )}
      
      </Web3ReactProvider>

    </div>
  );
}

export default App;
