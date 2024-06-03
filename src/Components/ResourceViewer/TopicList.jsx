import { useContext, useEffect, useState } from "react";
// import { BsHash } from "react-icons/bs";
// import { FaChevronDown, FaChevronRight, FaPlus } from "react-icons/fa";
// import { Courses, courseListDummy, pathDataDummy, resources1, resourcesDummy } from "../../Data/Courses";
import { myHeaders } from '../../Services/IpAddress';
import { easeQuadInOut } from "d3-ease";
import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import RadialSeparators from "./RadialSeperators";
import {
  RiCheckboxBlankCircleFill,
  RiCheckboxCircleFill,
} from "react-icons/ri";
import {
  Checkbox,
  Card,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Typography,
} from "@material-tailwind/react";
import TickMark from "../../../public/icons8-tick.gif";
import useDarkMode from "./useDarkMode";
import { viewerContext } from "./viewerContext";
import AnimatedProgressProvider from "../AnimatedProgressProvider";
import { CompletionContext } from "./CompletionContext";
import { data } from "autoprefixer";
import { render } from "react-dom";
import { searchContext } from "./SearchContext";
import { CourseContext, CourseIdContext } from "./CourseContext";
import { TopicIdContext } from "./TopicContext";
import axios from "axios";
import { TypeIcon } from "../TypeIcon";
import ProgressService from "../../Api/services/Progress/ProgressService";
import useAuth from "../../Hooks/useAuth";
// import topics from '../../Data/Courses'
// const topics = ['tailwind-css', 'react'];
const questions = ["jit-compilation", "purge-files", "dark-mode"];
const random = ["variants", "plugins"];

const TopicList = ({ courses, docked, setDocked, viewProgress }) => {
  const { searchText } = useContext(searchContext)
  const { courseId } = useContext(CourseIdContext)
  const { course, setCourse } = useContext(CourseContext);
  const userID = sessionStorage.getItem("empId");
  const batchID = sessionStorage.getItem("id");
  const { auth } = useAuth();

  useEffect(() => {
    console.log("value of docked is ", courses);
    console.log("value of courseId in topicList", courseId)


  }, []);

  // const course = ;


  const [darkTheme, setDarkTheme] = useDarkMode();






  return viewProgress ? (
    <div
      className={
        docked
          ? "channel-bar bg-gray-300 dark:bg-[#313338] shadow-lg w-[0px]"
          : "channel-bar bg-gray-300 dark:bg-[#313338] shadow-lg w-[800px]"
      }
    >
      {/* enter course Name here */}
      {course && <ChannelBlock CourseName={course.courseName} />}

      <div className="channel-container ">
        <Card className=" min-h-[800px] max-h-screen bg-[#D5D5D5] dark:bg-[#36373d]  pb-36 p-3">
          <Progress courseID={courseId} userID={userID} batchID={batchID} auth={auth} />
        </Card>
      </div>
    </div>
  ) : (
    <div
      className={
        docked
          ? "channel-bar bg-gray-300 dark:bg-[#313338] shadow-lg w-[0px]"
          : "channel-bar bg-gray-300 dark:bg-[#313338] shadow-lg w-[800px]"
      }
    >
      {/* enter course Name here */}
      {course && <ChannelBlock CourseName={course.courseName} />}

      <div className="channel-container">
        <Card className=" overflow-y-auto min-h-[680px] overflow-x-hidden w-[480px] max-h-screen bg-[#D5D5D5] dark:bg-[#36373d]  pb-40">
          {course?.topic?.map((topic, index) => (
            <Dropdown
              key={index}
              header={topic.topicName}
              topicId={topic.topicId}
              auth={auth}

            />
          ))}
        </Card>
      </div>
    </div>
  );
};



const Progress = ({ userID, courseID, batchID, auth }) => {
  const [loading, setLoading] = useState(true);
  const [courseProgress, setCourseProgress] = useState(0)
  const fetchData = async () => {
    try {
      let data
      if (auth.role === "USER") {
        data = await ProgressService.getUserProgressOfCoursesByID({ userID, courseID, batchID })
      } else {
        data = await ProgressService.getOverallCourseProgress({ courseID, batchID })
      }
      console.log("coursePorgress:", data.courseProgress, " of course ID", courseID);
      setCourseProgress(data.courseProgress)
      setLoading(false)
    }
    catch {
      setLoading(true)
    }
  }
  useEffect(() => {
    fetchData();
  }, [courseID])
  return (
    <div className="min-w-[455px]">
      <div className="w-52 m-4 flex flex-col justify-center items-center bg-gray-900 rounded-3xl  p-5 ">
        {loading ? "Loading..." : <CircularProgressbarWithChildren
          value={courseProgress}
          text={`${Math.round(courseProgress)}%`}
          strokeWidth={10}
          styles={buildStyles({
            strokeLinecap: "butt",
          })}
        >
          <RadialSeparators
            count={10}
            style={{
              background: "#fff",
              width: "2px",
              // This needs to be equal to props.strokeWidth
              height: `${10}%`,
            }}
          />
        </CircularProgressbarWithChildren>}
        <Typography className="mt-5 text-blue-gray-300">
          Course Progress
        </Typography>
      </div>
      OTHER METRICS COMING SOON
    </div>
  )
}

const Dropdown = ({ header, topicId, auth }) => {
  const [expanded, setExpanded] = useState(true);
  const { completion } = useContext(CompletionContext);
  const { setTopicId } = useContext(TopicIdContext);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const batchId = sessionStorage.getItem("id")
  const userId = sessionStorage.getItem("empId")

  const { courseId } = useContext(CourseIdContext)

  const { course } = useContext(CourseContext)

  const getResoruceList = async () => {
    try {

      // const response = await axios.get(`http://172.18.4.81:1111/learning-plan/dto/${sessionStorage.getItem("id")}`);
      const response = await axios.get(`${import.meta.env.VITE_PROGRESS_SERVICE_URL}/resource/batch/${batchId}/course/${courseId}/topic/${topicId}`,{
        headers:{...myHeaders,
          Authorization: `Bearer ${sessionStorage.getItem('auth')}`,
        },
      })



      return response.data
    } catch (error) {

      console.error(error);
    }
  }

  const getResourceProgress = async ({ resourceId }) => {
    try {

      // const response = await axios.get(`http://172.18.4.81:1111/learning-plan/dto/${sessionStorage.getItem("id")}`);
      const response = await axios.get(`${import.meta.env.VITE_PROGRESS_SERVICE_URL}/user-progress/${userId}/batch/${batchId}/resource/${resourceId}`,{
        headers:{...myHeaders,
          Authorization: `Bearer ${sessionStorage.getItem('auth')}`,
        },
      })



      return response.data.resourceProgress
    } catch (error) {

      console.error(error);
    }
  }

  const fetchData = async () => {
    try {
      //  const batch = await fetchBatchData();
      // const progress = await fetchProgressData();

      const resourceList = await getResoruceList();



      if (resourceList) {
        console.log("data", resourceList)
        let progressPromises;
        if (auth.role === "USER") {
          progressPromises = resourceList.map(async data => ({
            ...data,
            progress: await getResourceProgress({ resourceId: data.resourceId })
          }));
        }
        else {
          progressPromises = resourceList.map(async data => ({
            ...data,
            progress: await ProgressService.getOverallResourceProgress({ batchID: batchId, resourceId: data.resourceId })
          }));
        }

        // Wait for all progress requests to resolve
        const updatedResourceList = await Promise.all(progressPromises);
        updatedResourceList.forEach(item => {
          if (isNaN(item.progress) || item.progress === undefined) {
            item.progress = 0;
          }
        });


        console.log("data", updatedResourceList);



        setResources(updatedResourceList)

        setLoading(false)
      } else {
        setLoading(true)
        throw new Error("Couldn't fetch batch data from backend");
      }
    } catch (error) {

      // setError("Couldn't fetch Batch Data");
      console.error("Error fetching data:", error);
    }
    finally {

    }
  };

  useEffect(() => {
    fetchData();


  }, [course, completion]);
  return (

    <Accordion open={expanded} className="dropdown m-1 ">

      <AccordionHeader
        onClick={() => { setExpanded(!expanded); }}
        className={
          expanded
            ? "dropdown-header-text-selected text-blue-500 dark:text-[#f8f8f8]"
            : "dropdown-header-text text-gray-500  dark:text-[#949ba4]"
        }
      >
        {header}
      </AccordionHeader>
      <AccordionBody className="dropdown-selection  ">

        {loading ? (
          <div>Loading...</div>
        ) : resources.length > 0 ? (
          <>
            <ResourceBlock resources={resources} topicId={topicId} />

          </>
        ) : (
          <div className="flex justify-center">No resources found</div>
        )}
      </AccordionBody>
    </Accordion>

    // {/* {expanded &&
    //   selections &&
    //   selections.map((selection) => <TopicSelection selection={selection} />)} */}
  );
};

const ResourceBlock = ({ resources, topicId }) => {
  const contextValue = useContext(viewerContext);
  let view = contextValue?.view;
  let setView = contextValue?.setView;
  const { completion, setCompletion } = useContext(CompletionContext);
  const { searchText } = useContext(searchContext)
  const { course } = useContext(CourseContext)
  const { setTopicId } = useContext(TopicIdContext)
  // const [selectedItem, setSelectedItem] = useState(null);

  const handleClick = (data) => {
    setTopicId(topicId)

    // Set the view to the clicked data
    // setProgress({id:data.id,progress:data.progress})
    console.log("progress data in resource blaock", data)
    setView({
      id: data.resourceId,
      name: data.name,
      type: data.type,
      source: data.source,
      progress: data.progress,
    });
  };

  useEffect(() => {
    console.log(JSON.stringify(completion));
    console.log("resource name", (resources))
  }, [completion]);
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[a-zA-Z0-9_-]{11}/;

  return (
    <Card className="h-full w-[450px]  dark:bg-[#53555f]   bg-gray-200">

      <table className="w-full min-w-max table-auto text-left ">
        <thead></thead>
        <tbody>
          {resources.map(data => (


            {
              ...data,
              name: data.name || "UNNAMED_RESOURCE",
              type: youtubeRegex.test(data.source) ? "youtubeVideo" : data.type
            }))
            .filter((item) => {
              console.log("inside filetre", item)
              return (searchText.toLowerCase().includes("filter:incomplete")
                ? item.progress !== 100
                : item.name.toLowerCase().includes(searchText.toLowerCase()))
            })
            .map((data, index) => {
              const classes = "p-4 border-b border-blue-gray-50 ";
              // Apply conditional styling to highlight the selected item
              const rowClasses = `   hover:bg-blue-gray-100 hover:dark:bg-[#36373d]  hover:dark:text-green-200 dark:text-gray-100 rounded-lg ${view?.id === data.resourceId ? "dark:bg-[#45a049] bg-green-200" : ""
                }`;

              return (
                <tr
                  key={data.resourceId}
                  className={rowClasses}
                  onClick={() => handleClick(data)}
                >
                  <td className={classes}>
                    <Typography
                      variant="small"
                      // color="blue-gray"
                      className="font-normal"
                      style={{ minWidth: "280px", maxWidth: "280px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                      title={data.name} // This will show the full name on hover
                    >
                      {data.name}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      // color="blue-gray"
                      className="font-normal"
                    >

                      <TypeIcon type={data.type} />


                    </Typography>
                  </td>
                  <td className={classes}>
                    <CompletionMarker
                      progress={
                        data.resourceId === completion?.topicId
                          ? completion?.progress
                          : data.progress
                      }
                      type={data.type}
                      renderId={data.id}
                      viewId={view?.id}
                    />
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </Card>
  );
};

const CompletionMarker = ({ progress, type, renderId, viewId }) => {
  // const [indvidualProgress,setIndividualProgress] = useState(progress)

  // const {progress,setProgress} = useContext(CompletionContext);
  // if(renderId==viewId){
  //   setProgress({id:viewId,progress:100})
  //   //TODO-send axios request updating progress
  // }

  return (
    <div>
      {type != "youtubeVideo" ? (
        progress < 95 ? (
          <RiCheckboxBlankCircleFill size="34" className="text-gray-500/25" />
        ) : (
          <RiCheckboxCircleFill
            size="34"
            className="text-green-500 dark:text-green-200"
          />
        )
      ) : progress < 90 ? (
        <AnimatedProgressProvider
          valueStart={0}
          valueEnd={progress}
          duration={0.9}
          easingFunction={easeQuadInOut}
        >
          {(value) => {
            const roundedValue = Math.round(progress);
            return (
              <div className="w-7 h-7">
                <CircularProgressbar
                  value={progress}
                  className="ml-[0.15rem]"
                  text={`${roundedValue}`}
                  styles={buildStyles({
                    // Customize the text size
                    textSize: '35px', // Adjust the text size here
                    textColor: '#ffffff'
                    // You can also adjust other styles here if needed
                  })}
                /* This is important to include, because if you're fully managing the
          animation yourself, you'll want to disable the CSS animation. */
                />
              </div>
            );
          }}
        </AnimatedProgressProvider>
      ) : (
        <RiCheckboxCircleFill size="34" className="text-green-200 " />
      )}
    </div>
  );
};

const ChannelBlock = (props) => (
  <div className="channel-block ">
    <h5 className="channel-block-text">{props.CourseName}</h5>
  </div>
);




export default TopicList;
