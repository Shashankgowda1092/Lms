import React from 'react'
import { useEffect, useState } from 'react'
import AnimatedProgressProvider from './AnimatedProgressProvider'
import ProgressService from '../Api/services/Progress/ProgressService'
import { easeQuadInOut } from 'd3-ease'
import { Progress, Typography } from '@material-tailwind/react'
import useAuth from '../Hooks/useAuth'
const ProgressCourse = ({ batchID, courseID, userID }) => {

  const [progress, setProgress] = useState(null);
  const { auth } = useAuth();
  const fetchData = async ({ userID, batchID, courseID }) => {
    let progress = null;
    if (auth.role === "USER") {
     
      progress = await ProgressService.getUserProgressOfCoursesByID({ userID, courseID, batchID })
    }
    else {
      progress = await ProgressService.getOverallCourseProgress({ courseID, batchID })
      console.log("progress of admin",progress)
    }

    setProgress(progress.courseProgress)
  }



  useEffect(() => {

    fetchData({ userID, courseID, batchID })
  }, [])
  return (
    <div>
      <div className='flex flex-row justify-between'>
        <Typography>Progress:</Typography>
        <Typography>{Math.round(progress) ? Math.round(progress) : 0}%</Typography>
      </div>

      <AnimatedProgressProvider
        valueStart={0}
        valueEnd={progress}
        duration={0.5}
        easingFunction={easeQuadInOut}
        repeat
      >
        {value => (

          <Progress className="w-[280px] bg-green-100 " value={value} color="green" />
        )}
      </AnimatedProgressProvider>
    </div>
  )
}

export default ProgressCourse