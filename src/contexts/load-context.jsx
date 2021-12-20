import React, { useState } from "react";

const loadContext = React.createContext({ load: false });

const LoadProvider = ({ children }) => {
  const [load, setLoad] = useState(false);

  const { Provider } = loadContext;

  const activeLoad = () => setLoad(true);
  const disableLoad = () => setLoad(false);
  return (
    <Provider value={{ load, activeLoad, disableLoad }}>{children}</Provider>
  );
};

export { loadContext, LoadProvider };
