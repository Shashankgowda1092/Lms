import React, { useEffect, useState } from "react";
import MailVerificationForgotPassword from "../Components/MailVerificationForgotPassword";
import EnterNewPassword from "./EnterNewPassword";
import { useNavigate } from "react-router-dom";
import { Typography } from "@material-tailwind/react";
import outlook from "../Assets/outlook.png";

const ForgotPassword = () => {
  const [enterEmailVisible, setEnterEmailVisible] = useState(false);

  return (
    <div>
      {!enterEmailVisible ? (
        <MailVerificationForgotPassword
          setEnterEmailVisible={setEnterEmailVisible}
        />
      ) : (
        <div className="flex justify-center items-center h-screen flex-col ">
          <a href="https://outlook.office.com/mail/">
            <img src={outlook} alt="outlook" className="w-1/2" />
          </a>
          <Typography type="h1">
            Verification mail has been sent to your mailId, click on the logo to
            redirect to Outlook
          </Typography>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
