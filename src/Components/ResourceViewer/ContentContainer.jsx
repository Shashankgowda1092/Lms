import TopNavigation from "./TopNavigation";
import { BsPlusCircleFill } from "react-icons/bs";
// import { useState } from 'react';
// import { resources1 } from "../../Data/Courses";
import ResourceRenderer from "./ResourceRenderer";
import { viewerContext } from "./viewerContext";
import { useContext } from "react";
const ContentContainer = ({docked}) => {
  return (
    <div className="content-container h-[870px] bg-gray-300 dark:bg-[#313338] dark:text-[#8f959e]">
      <TopNavigation  />
      <div className="flex flex-col justify-center items-center">
        <div className=" min-h-screen ">
          <ResourceRenderer docked={docked} reqResource={1} />
        </div>
      </div>
    </div>
  );
};



export default ContentContainer;
