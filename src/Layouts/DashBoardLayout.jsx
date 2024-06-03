import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import Cookies from "js-cookie";

const DashBoardLayout = () => {
  const { auth } = useAuth();
  useEffect(() => {
    if (auth.accessToken) {
      console.log("cookie creation started after entering dashboard");
      // Extract the token without 'bearer=' prefix
      // let tokenWithoutBearer = auth.accessToken.split("bearer=")[1];
      // let jwt = tokenWithoutBearer.split(";")[0];
      let jwt = auth.accessToken;

      console.log("auth", auth);
      console.log("jwt token", jwt);
      // Set the cookie with the given attributes
      Cookies.set("bearer", jwt);
    }
    // CampaignService.getMainDash()
  }, []);
  return (
    <main className="App">
      {/* <header>DashBoardLayout</header> */}
      <Outlet />
    </main>
  );
};

export default DashBoardLayout;
