import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { useState } from "react";

 
export function Modules({ CardName, setIsUserDialogOpen }) {
 
  const handleUserDialog = () => {
    setIsUserDialogOpen(true);
  }
 
  // Define background images for each card

 
  // Get the background image for the current card
  
 
  return (
    <Card className="mt-4 w-72 border-l-[4px]  hover:scale-90 hover:bg-blue-50 ease-in-out duration-300 border-[#4E73DF]">
      {/* Separate text above the image */}
      <Typography variant="h5" className="mt-2 mb-4 text-center">
        {CardName}
      </Typography>
     
      {/* Image background */}
      <div className="relative" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "50%", backgroundPosition: "center", backgroundRepeat: "no-repeat", paddingTop: "65%" }} onClick={handleUserDialog}>
        {/* Transparent div to contain the image and text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Text content */}
          <CardBody className="text-center -bold">
            <Typography>{/* Additional content */}</Typography>
          </CardBody>
          <CardFooter>
            {/* <Button onClick={handleUserDialog} ></Button> */}
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}