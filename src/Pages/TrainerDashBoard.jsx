import React from "react";
import useAuth from "../Hooks/useAuth";
import { Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import Dashboardview from "../Components/TrainerDashBoard/Dashboardview";
import Sidebar from "../Components/TrainerDashBoard/Sidebar";
import Page from "../Components/TrainerDashBoard/Page";

const TraineeDashBoard = () => {
  return (
    <>
      <div>
        <div className="">
          <div className="flex  ">
            <div className="basis-[12%] h-[100vh]">
              <Sidebar />
            </div>
            <div className="basis-[88%] border  h-[100vh]">
              <Dashboardview />
              <div>
                <Page />
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </>
  );
};

export default TraineeDashBoard;
