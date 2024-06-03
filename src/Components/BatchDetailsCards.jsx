import { motion } from "framer-motion";
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CourseCard } from "./CourseCard";
import useAuth from "../Hooks/useAuth";

// import { useState } from "react";
import PropTypes from "prop-types";
const BatchDetailsCards = ({
  status,
  searchQuery,
  batchData,
  progressData,
  change,
}) => {
  let filteredTable = batchData;
  // const [carousel, setCarousel] = useState(false);
  // Filter table data based on status
  if (status === "Active") {
    filteredTable = batchData.filter(({ online }) => online);
  } else if (status === "Non-Active") {
    filteredTable = batchData.filter(({ online }) => !online);
  }
  const { auth } = useAuth();
  const progressHandler = (batchId) => {
    const res = progressData.find((data) => data.batchId === batchId);
    console.log(res,"ressssss")
    return res ? res.batchProgress : 0;
  };

  const progressHandlerUser = (batchId) => {
    const res = progressData.find((data) => data.batchID === batchId);
    console.log(batchId,"ressssss")
    return res ? res.overallProgress : 0;
  };
  const trainerProgressHandler = (courseId) => {
    let res = null
    res = progressData?.find((data) => {
      if (data && typeof data.courseId !== 'undefined') {
        
        return data.courseId === courseId;
      }
      return false;
    });
    return res ? Math.round(res.courseProgress) : 0;
  }


  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredTable = filteredTable.filter(({ batchName }) =>
      batchName.toLowerCase().includes(query)
    );
    batchData = batchData.filter(({ batchName }) =>
      batchName.toLowerCase().includes(query)
    );
  }
  const width = change ? "w-full mr-10" : "";
  const scale = change ? { scale: 1.04 } : { scale: 1.1 };

  return (
    <div className="flex flex-wrap justify-center sm:justify-start space-evenly ml-4 sm:ml-12">
      {status === "All"
        ? batchData.map(
            ({ batchId, batchName, batchDescription, online, startDate, courseId,realBatchId }) => (
              <motion.div
              key={courseId || batchId}
                whileHover={scale}
                className={`course-card-wrapper ${width}`}
                style={{ zIndex: 1 }}
              >
                <CourseCard
                online={online}
                progressValue={auth.role === "TRAINER" ? trainerProgressHandler(courseId) : auth.role === "USER" ? progressHandlerUser(batchId) :progressHandler(batchId)}
                name={batchName}
                description={batchDescription}
                date={startDate}
                batchId={courseId || batchId}
                change={change}
                realBatchId={realBatchId}
              />

              </motion.div>
            )
          )
        : filteredTable.map(
          ({ batchId, batchName, batchDescription, online, startDate, courseId }) => (
              <motion.div
              key={courseId || batchId}
              whileHover={scale}
              className={`course-card-wrapper ${width}`}
              style={{ zIndex: 1 }}
              >
                <CourseCard
                 online={online}
                 progressValue={auth.role === "TRAINER" ? trainerProgressHandler(courseId) : progressHandler(batchId)}
                 name={batchName}
                 description={batchDescription}
                 date={startDate}
                 batchId={courseId || batchId}
                 change={change}
                />
              </motion.div>
            )
          )}
    </div>
  );
};

BatchDetailsCards.propTypes = {
  status: PropTypes.string.isRequired,
  searchQuery: PropTypes.string.isRequired,
  batchData: PropTypes.array.isRequired,
  progressData: PropTypes.array.isRequired,
  change: PropTypes.bool.isRequired,
};

export default BatchDetailsCards;
