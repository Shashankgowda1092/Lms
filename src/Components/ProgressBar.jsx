import React from 'react';
import { Progress } from "@material-tailwind/react";
import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";

const ProgressBar = ({ progressValue }) => {
  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between gap-4">
        <Typography color="blue-gray" variant="h6">
          Completed
        </Typography>
        <Typography color="blue-gray" variant="h6">
          {progressValue}%
        </Typography>
      </div>
      <Progress value={progressValue} color="green" size="sm" />
    </div>
  );
};
export default ProgressBar;
ProgressBar.propTypes = {
  progressValue: PropTypes.number,
};
