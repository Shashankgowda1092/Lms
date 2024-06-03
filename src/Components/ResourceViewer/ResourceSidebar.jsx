import { BsPlus, BsFillLightningFill, BsGearFill, BsDashCircle } from "react-icons/bs";
import { FaFire, FaPoo } from "react-icons/fa";
import { MdMenuOpen } from "react-icons/md";
import {
  RiDashboard2Fill,
  RiInboxFill,
  RiFileMarkFill,
  RiFolderVideoFill,
} from "react-icons/ri";
import { RxDividerHorizontal } from "react-icons/rx";
import { Button, Tooltip } from "@material-tailwind/react";
import { useContext, useEffect, useState } from "react";
import { CourseContext, CourseIdContext } from "./CourseContext";
import { BiSolidDockLeft } from "react-icons/bi";
import { GiQuillInk } from "react-icons/gi";
import { PiNotepadBold } from "react-icons/pi";
import { searchContext } from "./SearchContext";
import useAuth from "../../Hooks/useAuth";
import { useLocation } from "react-router-dom";

const ResourceSidebar = ({ courses, docked, setDocked, viewProgress, setViewProgress }) => {

  const { course, setCourse } = useContext(CourseContext);

  // console.log(data, "courseId in resource sidebar");


  const { setSearchText } = useContext(searchContext);
  const { courseId, setCourseId } = useContext(
    CourseIdContext
  );






  const [currentCourseIndex, setCurrentCourseIndex] = useState();

  // console.log(sessionStorage.getItem("courseIndex"),"course index")
  const [hasNext, setHasNext] = useState(true);
  const [hasPrevious, setHasPrevious] = useState(currentCourseIndex === 0 ? false : true);




  useEffect(() => {



    setHasNext(currentCourseIndex < courses.length - 1);
    setHasPrevious(currentCourseIndex > 0);
    // console.log(courseCompletion);
  }, [currentCourseIndex, courses]);

  useEffect(() => {
    setIndexToState();
    console.log("couresINdex in Resource sidebar", currentCourseIndex);
  }, [courses, courseId]); // Add courses and courseId as dependencies

  const setIndexToState = () => {
    courses.forEach((data, index) => {
      if (data.courseId === courseId) {
        console.log(index);
        setCurrentCourseIndex(index);
      }
    });
  };




  const nextCourse = () => {
    setViewProgress(false);
    setDocked(false);
    if (hasNext) {
      const nextIndex = currentCourseIndex + 1;
      if (courses[nextIndex]) {
        setCourseId(courses[nextIndex].courseId); // Set courseId here
      }
    }
  };

  const previousCourse = () => {
    setViewProgress(false);
    setDocked(false);
    if (hasPrevious) {
      const previousIndex = currentCourseIndex - 1;
      if (courses[previousIndex]) {
        setCourseId(courses[previousIndex].courseId); // Set courseId here
      }
    }
  };



  return (
    <div className="fixed left-0  w-16 h-96 justify-center  bg-[#F2F2F2] dark:bg-gray-900 z-20 ">
      <div className="flex flex-col justify-center items-center h-[50vh]">
        <SideBarIcon icon={<RiDashboard2Fill size="30" />} text="Progress" onClick={() => { setViewProgress(true); setDocked(false) }} />
        <Divider />
        <SideBarIcon icon={<RiInboxFill size="25" />} text="All Resources" onClick={() => { setViewProgress(false); setDocked(false); setSearchText("") }} />
        <SideBarIcon
          icon={<BsDashCircle size="24" />}
          text="Incomplete Resources"
          onClick={() => { setViewProgress(false); setDocked(false); setSearchText("filter:incomplete") }}
        />
        <SideBarIcon
          className="mb-0 "
          icon={<PiNotepadBold size="24" />}
          text="Notes"
        />


      </div>




      <div className="flex flex-col justify-end items-center ">

        <SideBarIcon
          icon={<BiSolidDockLeft size="25" />}
          text="Dock"
          onClick={() => setDocked(!docked)}
        />

        <Divider />
        <div className="flex flex-col justify-center mt-4 items-center ">
          <Tooltip content="Next Course" placement="right-end">
            <Button
              className="p-2 w-14 mb-2   dark:text-green-700 dark:border-green-200 hover:dark:border-gray-200 hover:dark:text-gray-100 hover:bg-green-100 hover:text-gray-100"
              variant="outlined"
              onClick={nextCourse}
              disabled={!hasNext}
            >
              {">>"}
            </Button>
          </Tooltip>
          <Tooltip content="Previous Course" placement="right-end">
            <Button
              className="p-2 w-14  dark:text-green-700 dark:border-green-200 hover:dark:border-gray-200 hover:dark:text-gray-100 hover:bg-green-100 hover:text-gray-100"
              variant="outlined"
              onClick={previousCourse}
              disabled={!hasPrevious}
            >
              {"<<"}
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

const SideBarIcon = ({ icon, text = "tooltip 💡", onClick }) => (
  <div className="sidebar-icon group" onClick={onClick}>
    {icon}
    <span class="sidebar-tooltip group-hover:scale-100">{text}</span>
  </div>
);

const Divider = () => (
  <hr className="w-7 h-px my-0 bg-green-200 border-0 dark:bg-green-700" />
);

export default ResourceSidebar;
