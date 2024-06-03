import {
  FaSearch,
  FaHashtag,
  FaRegBell,
  FaUserCircle,
  FaMoon,
  FaSun,
  FaBookReader,
} from "react-icons/fa";
import useDarkMode from "./useDarkMode";
import { IconButton, Tooltip, Typography } from "@material-tailwind/react";
import { CiRead, CiUnread } from "react-icons/ci";
import { useContext, useEffect, useRef, useState } from "react";
import { viewerContext } from "./viewerContext";
import { searchContext } from "./SearchContext";

const TopNavigation = () => {
  const { view, setView } = useContext(viewerContext)
  return (
    <div className="top-navigation bg-gray-300 dark:bg-[#313338]  px-7">

      <h5 className="title-text text-gray-500 dark:text-[#f2f3f5] pt-3">
        {view?.name || "Learning Resource Viewer"}
      </h5>

      <ThemeIcon />
      <Search  />
    </div>
  );
};

const ThemeIcon = () => {
  const [darkTheme, setDarkTheme] = useDarkMode();
  const handleMode = () => setDarkTheme(!darkTheme);
  const [firstClick, setFirstClick] = useState(false);
  const topicListRef = useRef();

  useEffect(() => {
    if (darkTheme && topicListRef.current) {
      topicListRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      document.body.style.overflow = "hidden";
    }

    // Re-enable scrolling when the component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [darkTheme]);
  const handleClick = () => {
    handleMode();
    setFirstClick(true)


  }



  return (
    <span onClick={handleClick} ref={topicListRef}>
      
      {darkTheme ? (
        <CiUnread size="32" className="top-navigation-icon " />
      ) : (
        <Tooltip
          placement="top"
          open={!firstClick}
          className="border border-blue-gray-50 bg-red-300 px-4 py-3 shadow-xl shadow-black/10 "
          content={
            <div className="w-80">
              <Typography color="white" className="font-medium ">
                Reading Mode
              </Typography>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal opacity-80"
              >
                To immerse yourself in reading mode, simply toggle the eye button.
              </Typography>
            </div>
          }
        >
          <div>
            <CiRead size="32" className="top-navigation-icon " />
          </div>
        </Tooltip>
      )}
    </span>
  );
};

const Search = () => {
  const { searchText, setSearchText } = useContext(searchContext);
  return (
    <div className="search mt-3">
      <input className="search-input" type="text" value={searchText} placeholder="Search..." onChange={(e) => { setSearchText(e.target.value) }} />
      <FaSearch size="18" className="text-secondary my-auto" />
    </div>)
};

const HashtagIcon = () => <FaHashtag size="20" className="title-hashtag" />;
const Title = () => <h5 className="title-text">LearningReso</h5>;

export default TopNavigation;
