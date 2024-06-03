
import React from "react";

import AppRoutes from "./Routes/AppRoutes";
import { NavbarWithMegaMenu } from "./Components/Navbar";
import Routes from "./Routes/Routes";
// eslint-disable-next-line no-unused-vars
import { BatchProvider } from "./Context/BatchContext";
function App() {
  return (
 
     <BatchProvider>
           <AppRoutes/>
       <Routes />
   </BatchProvider>
   
  );
}

export default App;
