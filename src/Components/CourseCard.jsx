import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Chip,
} from "@material-tailwind/react";
import "../styles/ButtonStyle.css";
import ProgressBar from "./ProgressBar";
import PropTypes from "prop-types";
import { useBatch } from "../Context/BatchContext";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import React from "react";
import Yell from "../Assets/Yell.svg";
import useAuth from "../Hooks/useAuth";
export function CourseCard({
  online,
  progressValue,
  name,
  description,
  date,
  batchId,
  change,
  realBatchId,
}) {
  const navigate = useNavigate();
  const { setId } = useBatch();
  const { auth } = useAuth();
  const batchHandler = () => {
    setId(batchId);
    auth.role === "TRAINER"
      ? sessionStorage.setItem("id", realBatchId)
      : sessionStorage.setItem("id", batchId);
    console.log(auth.role);
    auth.role === "ADMIN"
      ? navigate("/lms/batches/batchDetails")
      : auth.role === "TRAINER"
      ? navigate("/courses/learningPlan")
      : navigate("/lms/batch/learningPlan");
  };

  const width = change ? "w-full" : "w-96 m-5";

  return (
    <div onClick={batchHandler} style={{ cursor: "pointer" }}>
      <Card
        className={`mt-6  h-72 inline-block m-5 ${width}`}
        style={{ background: `url(${Yell})` }}
      >
        <CardBody>
          <div className="flex space-x-4 justify-end inline-block">
            <div className="w-max">
              <Chip
                variant="ghost"
                size="sm"
                value={online ? "Active" : "Non-Active"}
                color={online ? "green" : "blue-gray"}
              />
            </div>
            <div className="w-max">
              <Chip
                variant="ghost"
                size="sm"
                value={date}
                color={online ? "green" : "blue-gray"}
              />
            </div>
          </div>
          <img
            width="50"
            height="50"
            src="https://img.icons8.com/ios-glyphs/60/layers.png"
            alt="layers"
          />
          <Typography variant="h5" color="blue-gray" className="mb-2">
            {name}
          </Typography>
          <Typography>{description}</Typography>
        </CardBody>
        <CardFooter className="pt-0 mb-0">
          {auth.role === "ADMIN" ? (
            <button className="button learn-more">
              <span className="circle" aria-hidden="true">
                <span className="icon arrow"></span>
              </span>
              <span className="button-text">Batch Details</span>
            </button>
          ) : (
            <div className="button learn-more"></div>
          )}
          <ProgressBar progressValue={progressValue} />
        </CardFooter>
      </Card>
    </div>
  );
}

CourseCard.propTypes = {
  online: PropTypes.bool.isRequired,
  progressValue: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  batchId: PropTypes.number.isRequired,
  change: PropTypes.bool.isRequired,
};
