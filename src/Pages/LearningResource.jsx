import React, { useEffect, useRef, useState } from "react";
import ResourceSidebar from "../Components/ResourceViewer/ResourceSidebar";
import ContentContainer from "../Components/ResourceViewer/ContentContainer";
import TopicList from "../Components/ResourceViewer/TopicList";
import "../Components/ResourceViewer/index.css";
// import useDarkMode from "../Components/ResourceViewer/useDarkMode";
import { viewerContext } from "../Components/ResourceViewer/viewerContext";
import { CompletionContext } from "../Components/ResourceViewer/CompletionContext";
import {
  CourseContext,
  CourseIdContext,
} from "../Components/ResourceViewer/CourseContext";
import {
  TopicContext,
  TopicIdContext,
} from "../Components/ResourceViewer/TopicContext";
import { searchContext } from "../Components/ResourceViewer/SearchContext";
import axios from "axios";
import {myHeaders} from "../Services/IpAddress"

// import { courseListDummy, pathDataDummy } from "../Data/Courses";
import { useLocation } from "react-router-dom";
const LearningResource = () => {
  // const [darkTheme, setDarkTheme] = useDarkMode();
  // const courseId = "1";
  const location = useLocation();
  const { fromHome } = location.state;
  let data = fromHome.courseId;

  const batchId = sessionStorage.getItem("id");
  // const topicsId = "2";
  const [view, setView] = useState();
  const [completion, setCompletion] = useState();
  const [courseId, setCourseId] = useState(data);
  const [loading, setLoading] = useState(true);
  const [docked, setDocked] = useState(false);
  const [viewProgress, setViewProgress] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [courseList, setCourseList] = useState([]);
  const [course, setCourse] = useState();
  const [topicId, setTopicId] = useState();
  const [topic, setTopic] = useState();

  //TODO axios call to get courses list and course completion
  const getCourseList = async () => {
    try {
      // const response = await axios.get(`http://172.18.4.81:1111/learning-plan/dto/${sessionStorage.getItem("id")}`);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/batch-course/view-dto/${batchId}`,
        {
          headers: {
            ...myHeaders,
            Authorization: `Bearer ${sessionStorage.getItem("auth")}`,
          },
        }
      );
      // const response = await axios.get(`http://172.18.4.108:1111/learning-plan/dto/1`);
      // console.log("testing console", response.data);
      console.log("Error");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    try {
      //  const batch = await fetchBatchData();
      // const progress = await fetchProgressData();

      const courseListData = await getCourseList();
      console.log("data", courseListData);
      //progress data

      if (courseListData) {
        console.log("data", courseListData);

        //CHANGEEEEEEEEEEE to courseList Data
        setCourseList(courseListData.batchCourses);
        setLoading(false);
      } else {
        setLoading(true);
        throw new Error("Couldn't fetch batch data from backend");
      }
    } catch (error) {
      // setError("Couldn't fetch Batch Data");
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log("state updated", courseList);
  }, [courseList]);

  useEffect(() => {
    setCourse(courseList.find((course) => course.courseId === courseId));
    console.log("course shown", course);
  }, [courseId, courseList]);

  // useEffect(()=>{
  //   setCourseCompletion(courseProgress)
  // },[courseProgress])

  console.log(searchText);
  return (
    <div className="flex bg-[#F2F2F2] dark:bg-gray-900 ">
      <CourseIdContext.Provider value={{ courseId, setCourseId }}>
        <CourseContext.Provider value={{ course, setCourse }}>
          <TopicIdContext.Provider value={{ topicId, setTopicId }}>
            <TopicContext.Provider value={{ topic, setTopic }}>
              <viewerContext.Provider value={{ view, setView }}>
                <CompletionContext.Provider
                  value={{ completion, setCompletion }}
                >
                  <searchContext.Provider value={{ searchText, setSearchText }}>
                    {loading ? (
                      <div>loading.....</div>
                    ) : (
                      <>
                        {" "}
                        <ResourceSidebar
                          courses={courseList}
                          docked={docked}
                          setDocked={setDocked}
                          viewProgress={viewProgress}
                          setViewProgress={setViewProgress}
                        />
                        <TopicList
                          courses={courseList}
                          docked={docked}
                          setDocked={setDocked}
                          viewProgress={viewProgress}
                        />
                        <ContentContainer docked={docked} batch={batchId} />
                      </>
                    )}
                  </searchContext.Provider>
                </CompletionContext.Provider>
              </viewerContext.Provider>
            </TopicContext.Provider>
          </TopicIdContext.Provider>
        </CourseContext.Provider>
      </CourseIdContext.Provider>
    </div>
  );
};

export default LearningResource;
