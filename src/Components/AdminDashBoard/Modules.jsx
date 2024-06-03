import React from "react";
import { Card, CardBody, CardFooter, Typography, Button } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";

export function Modules({ CardName, url }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (url) {
      navigate(url);
    }
  };

  return (
    <Card className="mt-6 w-96">
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-2">
          {CardName}
        </Typography>
        <Typography></Typography>
      </CardBody>
      <CardFooter className="pt-0" >
        <Link to={url}>
          <Button onClick={handleClick}></Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
