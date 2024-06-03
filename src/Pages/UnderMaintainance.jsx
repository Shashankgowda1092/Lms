import React, { useState } from "react";
import underMaintainance from "../Assets/SiteMaintainance.png";
import { Typography,IconButton } from "@material-tailwind/react";
import axios from "axios";
import { useEffect } from "react";
import TriviaGame from "../Components/TriviaGame"
import { FaArrowAltCircleDown } from "react-icons/fa";

const UnderMaintainance = () => {
  

 
  return (
    <div className="flex flex-col items-center justify-center p-24">
      <img className="w-1/3" src={underMaintainance} alt="Under Maintenance" />
      <Typography variant="h1" className="text-gray-700 text-4xl  mr-10">
        Site Under Maintenance
      </Typography>
      <Typography
        variant="paragraph"
        className="mt-5 text-pretty text-center text-sm text-gray-600"
      >
        Oops! A few buttons went rogue and our servers got a bit tipsy. We're on
        it, tightening screws and sobering up servers for a smoother ride ahead!
        Hang tight!
      </Typography>
      
<TriviaGame/>
    </div>
  );
};

export default UnderMaintainance;
