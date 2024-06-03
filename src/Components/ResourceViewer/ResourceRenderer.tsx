import React, { useContext, useEffect, useState } from "react";

import { viewerContext } from "./viewerContext";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import useAuth from "../../Hooks/useAuth";
import { SiMicrosoftsharepoint } from "react-icons/si";
import axios from "axios"
// import ProgressService from '../../Api/services/Progress/ProgressService'
import CustomYouTubePlayer from "./CustomYoutubePlayer";
import { CompletionContext } from "./CompletionContext";
import { RiFilePdf2Fill, RiFilePpt2Fill, RiFileWord2Fill, RiLinkM, RiVideoFill, RiYoutubeFill } from "react-icons/ri";
import { GiQuillInk } from "react-icons/gi";
import { ImNewTab } from "react-icons/im";

interface Props {
  // Define props interface here
  docked: any
}

const ResourceRenderer: React.FC<Props> = (
  {
    docked
    /* Destructure props here */
  }
) => {
  const contextValue = useContext(viewerContext);
  let view = contextValue?.view;
  let setView = contextValue?.setView;
  const {auth} = useAuth();
  
  const { completion, setCompletion } = useContext(CompletionContext);
  // console.log(JSON.stringify(view))
  const userID = sessionStorage.getItem("empId")
  const batchID=sessionStorage.getItem("id")
  const patchProgress = async ({ userID, resourceID, progress, batchID }) => {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_PROGRESS_SERVICE_URL}/user-progress/${userID}/batch/${batchID}/resource/${resourceID}/update/${progress}`, 
      {  },  // Sending progress in the body
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('auth')}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response.data); // Log the response data
  } catch (error) {
    console.error('Error updating progress:', error); // More informative error logging
  }
};



  const handleClick = async () => {
    setCompletion({ topicId: view.id, progress: 100 })
    await patchProgress({ userID , resourceID:view.id , progress:100 ,batchID })



  }
  return (
    <div >
       {/* {JSON.stringify(view)} */}
      {view?.type === "link" ? (
        <ExternalTab auth={auth} source={view.source} handleClick={handleClick} name={view.name} progress={view.progress} docked={docked} />
      )
        :
        view?.type === "pptx" || view?.type === "ppt"? (
          <ExternalTab auth={auth} source={view.source} handleClick={handleClick} name={view.name} progress={view.progress} docked={docked} />
        ) : view?.type === "docx" ? (
          <DocxRenderer auth={auth} source={view.source} handleClick={handleClick} progress={view.progress} docked={docked} />
        ) : view?.type === "pdf" ? (
          <PdfRenderer auth={auth} source={view.source} handleClick={handleClick} progress={view.progress} docked={docked} />
        ) : view?.type === "video" ? (
          <VideoRenderer auth={auth} source={view.source} handleClick={handleClick} progress={view.progress} docked={docked} />
        ) : view?.type === "youtubeVideo"  ? (
          <CustomYoutubeRenderer auth={auth} source={view.source} handleClick={handleClick} progress={view.progress} docked={docked} />
        ) : (
          <Welcome docked={docked} />
        )}

     
    </div>
  );
};

const IconCycle: React.FC<{ size: string }> = ({ size }) => {
  const icons = [<RiFilePpt2Fill size={size} className="animate-ping" />, <RiFilePdf2Fill size={size} className="animate-ping" />, <RiFileWord2Fill size={size} className="animate-ping" />
    , <RiLinkM size={size} className="animate-ping" />, <RiYoutubeFill size={size} className="animate-ping" />, <RiVideoFill size={size} className="animate-ping" />];
  const [currentIconIndex, setCurrentIconIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIconIndex((prevIndex) => (prevIndex + 1) % icons.length);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [icons.length]);

  return <div >{icons[currentIconIndex]}</div>;
};


const Welcome: React.FC<{ docked: boolean }> = ({ docked }) => {
  return (
    <Card className={docked ?
      "mx-2 my-2  bg-gray-50 dark:bg-gray-600 h-[91vh] max-w-[1000px] overflow-auto"
      : "mx-2 my-2  bg-gray-50 dark:bg-gray-600 h-[91vh] max-w-[845px] overflow-auto"}>
      <CardHeader shadow={false} floated={false} className="min-h-[500px] flex justify-center items-center mx-5 bg-gray-200 dark:bg-[#666666]">
        <IconCycle size="300" />
      </CardHeader>
      <CardBody className="animate-pulse">

        <Typography
          as="div"
          variant="h1"
          className="mb-2 h-2 w-full flex text-gray-500 justify-center"

        >
          THIS - Learning Management System
        </Typography>

      </CardBody>
      <CardFooter className="pt-12 flex justify-end animate-pulse">
        {/* <Button
          disabled
          tabIndex={-1}
          className="h-8 w-20 bg-gray-300 shadow-none  hover:shadow-none"
        >
          &nbsp;
        </Button> */}
      </CardFooter>
    </Card>
  )
}


const CustomYoutubeRenderer: React.FC<{ auth:any, source: string,docked:boolean,handleClick:()=>{},progress:number }> = ({auth, source,docked ,handleClick,progress}) => {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  // Extracting the video ID using match method
  const match = source.match(regex);
  // If match is found, return the video ID, otherwise return null
  const vidId = match ? match[1] : " k1BneeJTDcU";
  
  





  return (
    <Card className={docked ? "mx-52 my-2  bg-gray-50 dark:bg-gray-600 h-[91vh] max-w-[1000px] overflow-auto"
    : "mx-52 my-2  bg-gray-50 dark:bg-gray-600 h-[91vh]  max-w-[845px] overflow-auto"
  }>

      <CardHeader shadow={false} floated={false} className="min-h-[90vh] mx-5 bg-gray-200 dark:bg-[#666666]">
        <div>
          <CustomYouTubePlayer vidId={vidId} />
        </div>
      </CardHeader>
      <CardBody className="flex justify-between ">
        <div className="flex justify-start">
          <div className="w-[100px] flex justify-between">
            <Tooltip content="Add Notes" >
              <IconButton className="dark:text-gray-700" variant="outlined">
                <GiQuillInk size="24" className="text-gray-900" />
              </IconButton>
            </Tooltip>
            <Tooltip content="Open in New Tab" >
              <a href={source} target="_blank">
                <IconButton className="dark:text-gray-700" variant="outlined">
                  <ImNewTab size="20" className="text-gray-900" />
                </IconButton>
              </a>
            </Tooltip>
          </div>
        </div>
        {/* <Button onClick={handleClick} disabled={progress === 100} className="dark:text-gray-900  dark:bg-green-500 bg-green-400" >Mark as Complete</Button> */}
      </CardBody>
      <CardFooter className="pt-0"></CardFooter>
    </Card>
  );
};
const ExternalTab: React.FC<{auth:any, source: string, handleClick: () => void, name: string, docked: boolean, progress: number }> = ({auth, source, handleClick, name, docked, progress }) => {
  // console.log(renderToString())
  console.log(name)

  return (
    <Card className={docked ? "mx-52 my-2  bg-gray-50 dark:bg-gray-600 h-[91vh] max-w-[1000px] overflow-auto"
      : "mx-52 my-2  bg-gray-50 dark:bg-gray-600 h-[91vh]  max-w-[845px] overflow-auto"
    }>

      <CardHeader shadow={false} floated={false} className="bg-gray-200 dark:bg-[#666666] flex justify-center items-center  h-[742px]">
        <a href={source} target="_blank" className="w-[906px] h-[742px] flex justify-center flex-col items-center  ">
          <SiMicrosoftsharepoint size={200} className="mb-10" />
          <Typography variant="h3" className="text-gray-500 ">Click to safely open "{name}" in a new tab</Typography>
        </a>
      </CardHeader>
      <CardBody className="flex justify-between ">
        <div className="flex justify-start">
          <div className="w-[100px] flex justify-between">
            <Tooltip content="Add Notes" >
              <IconButton className="dark:text-gray-700" variant="outlined">
                <GiQuillInk size="24" className="text-gray-900" />
              </IconButton>
            </Tooltip>
            <Tooltip content="Open in New Tab" >
              <a href={source} target="_blank">
                <IconButton className="dark:text-gray-700" variant="outlined">
                  <ImNewTab size="20" className="text-gray-900" />
                </IconButton>
              </a>
            </Tooltip>
          </div>
        </div>
        {auth.role === "USER" && <Button onClick={handleClick} disabled={progress === 100} className="dark:text-gray-900  dark:bg-green-500 bg-green-400" >Mark as Complete</Button>}
      </CardBody>
      <CardFooter className="pt-0"></CardFooter>
    </Card>
  )
};
const convertToEmbedLink = (fileLink: string): string => {
  // Extract the user-specific part of the SharePoint link
  const userPartMatch = fileLink.match(/\/personal\/([^\/]+)/);
  const userPart = userPartMatch ? userPartMatch[1] : "";

  // Extract the document ID from the SharePoint link
  const regex = /d=([^&]+)/;
  const match = fileLink.match(regex);
  const formattedDocId = match ? match[1] : null;

  // Format the document ID with hyphens
  const formattedId = formattedDocId
    ? formattedDocId
      .substring(1)
      .replace(/(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/, "$1-$2-$3-$4-$5")
    : "";

  // Construct the embed link with the user-specific part and formatted document ID
  return `https://thisisthbs-my.sharepoint.com/personal/${userPart}/_layouts/15/Doc.aspx?sourcedoc={${formattedId}}&action=embedview&wdAr=1.7777777777777777`;
};

const IframeCustom: React.FC<{ source: string }> = ({ source }) => {
  console.log(source);
  const embedLink = convertToEmbedLink(source);
  console.log(embedLink);
  console.log(typeof embedLink);
  return (
    <iframe
      src={embedLink}
      width="800px"
      height="581px"
    // frameborder="0"
    >
      <p>view outside</p>
    </iframe>
  );
};

const PptRenderer: React.FC<{auth:any, source: string, handleClick: () => void, progress: number, docked: boolean }> = ({auth, source, handleClick, progress, docked }) => {
  return (
    <Card className={docked ? "mx-52 my-2  bg-gray-50 dark:bg-gray-600 h-[91vh] max-w-[1000px] overflow-auto"
      : "mx-52 my-2  bg-gray-50 dark:bg-gray-600 h-[91vh]  max-w-[845px] overflow-auto"
    }>
      <CardHeader shadow={false} floated={false} className=" mx-5 bg-gray-200 dark:bg-[#666666] flex justify-center">
        <div>
          <object
            data={source}
            type="application/pptx"
            width="800"
            height="742 "
          >
              <iframe
              src={source}
              width="800"
              height="742"
              >

              </iframe>
            {/* <IframeCustom source={source} /> */}
          </object>
        </div>
      </CardHeader>
      <CardBody className="flex justify-between ">
        <div className="flex justify-start">
          <div className="w-[100px] flex justify-between">
            <Tooltip content="Add Notes" >
              <IconButton className="dark:text-gray-700" variant="outlined">
                <GiQuillInk size="24" className="text-gray-900" />
              </IconButton>
            </Tooltip>
            <Tooltip content="Open in New Tab" >
              <a href={source} target="_blank">
                <IconButton className="dark:text-gray-700" variant="outlined">
                  <ImNewTab size="20" className="text-gray-900" />
                </IconButton>
              </a>
            </Tooltip>
          </div>
        </div>
        {auth.role === "USER" && <Button onClick={handleClick} disabled={progress === 100} className="dark:text-gray-900  dark:bg-green-500 bg-green-400" >Mark as Complete</Button>}
      </CardBody>
      <CardFooter className="pt-0">

      </CardFooter>
    </Card>
  );
};

const DocxRenderer: React.FC<{auth:any, source: string, handleClick: () => void, docked: boolean, progress: number }> = ({auth, source, handleClick, docked, progress }) => {
  console.log("docx link", source)
  return (
    <Card className={docked ? "mx-52 my-2  bg-gray-50 dark:bg-gray-600 h-[91vh] max-w-[1000px] overflow-auto"
      : "mx-52 my-2  bg-gray-50 dark:bg-gray-600 h-[91vh]  max-w-[845px] overflow-auto"
    }>
      <CardHeader
        shadow={false}
        floated={false}
        className=" mx-5 bg-gray-200 dark:bg-[#666666] flex justify-center"
      >
        <div>
          <object
            data={source}
            type="application/doc"
            width="800"
            height="550 "
          >
            <iframe
              src={source}
              width="800"
              height="525"
            >
              <p>This browser does not support PDF!</p>
            </iframe>
          </object>
        </div>
      </CardHeader>
      <CardBody className="flex justify-between ">
        <div className="flex justify-start">
          <div className="w-[100px] flex justify-between">
            <Tooltip content="Add Notes" >
              <IconButton className="dark:text-gray-700" variant="outlined">
                <GiQuillInk size="24" className="text-gray-900" />
              </IconButton>
            </Tooltip>
            <Tooltip content="Open in New Tab" >
              <a href={source} target="_blank">
                <IconButton className="dark:text-gray-700" variant="outlined">
                  <ImNewTab size="20" className="text-gray-900" />
                </IconButton>
              </a>
            </Tooltip>
          </div>
        </div>
        {auth.role === "USER" && <Button onClick={handleClick} disabled={progress === 100} className="dark:text-gray-900  dark:bg-green-500 bg-green-400" >Mark as Complete</Button>}
      </CardBody>

    </Card>
  );
};
const VideoRenderer: React.FC<{auth:any, source: string, handleClick: () => void, docked: boolean, progress: number }> = ({auth, source, handleClick, docked, progress }) => {
  return (<div>
    <Card className={docked ? "mx-52 my-2  bg-gray-50 dark:bg-gray-600 h-[91vh] max-w-[1000px] overflow-auto"
      : "mx-52 my-2  bg-gray-50 dark:bg-gray-600 h-[91vh]  max-w-[845px] overflow-auto"
    }>
      <CardHeader shadow={false} floated={false} className=" mx-5 bg-gray-200 dark:bg-[#666666] flex justify-center">
        <div>
          <iframe
            src="https://thisisthbs-my.sharepoint.com/personal/shrivatsa_koulgi_thbs_com/_layouts/15/embed.aspx?UniqueId=b9b3471b-6ff1-479d-9c94-46385d29d30b&embed=%7B%22ust%22%3Atrue%2C%22hv%22%3A%22CopyEmbedCode%22%7D&referrer=StreamWebApp&referrerScenario=EmbedDialog.Create"
            width="800"
            height="581"
            frameborder="0"
            scrolling="no"
            allowfullscreen
            title="Git Repo demonstration meeting-20240404_151549-Meeting Recording 1.mp4">
          </iframe>
        </div>
      </CardHeader>
      <CardBody className="flex justify-between ">
        <div className="flex justify-start">
          <div className="w-[100px] flex justify-between">
            <Tooltip content="Add Notes" >
              <IconButton className="dark:text-gray-700" variant="outlined">
                <GiQuillInk size="24" className="text-gray-900" />
              </IconButton>
            </Tooltip>
            <Tooltip content="Open in New Tab" >
              <a href={source} target="_blank">
                <IconButton className="dark:text-gray-700" variant="outlined">
                  <ImNewTab size="20" className="text-gray-900" />
                </IconButton>
              </a>
            </Tooltip>
          </div>
        </div>
        {auth.role === "USER" && <Button onClick={handleClick} disabled={progress === 100} className="dark:text-gray-900  dark:bg-green-500 bg-green-400" >Mark as Complete</Button>}
      </CardBody>
      <CardFooter className="pt-0">
        <Button
          ripple={false}
          fullWidth={true}
          className="bg-blue-gray-900/10 text-blue-gray-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
        >
          Notes
        </Button>
      </CardFooter>
    </Card>
  </div>);
};
const PdfRenderer: React.FC<{auth:any, source: string, handleClick: () => void, progress: number, docked: any }> = ({auth, source, handleClick, progress, docked }) => {
  return (
    <Card className={docked ?
      "mx-2 my-2  bg-gray-50 dark:bg-gray-600 h-[91vh] max-w-[1000px] overflow-auto"
      : "mx-2 my-2  bg-gray-50 dark:bg-gray-600 h-[91vh] max-w-[845px] overflow-auto"}>
      <CardHeader
        shadow={false}
        floated={false}
        className=" mx-5 bg-gray-200 dark:bg-[#666666] flex justify-center "
      >
        <div >
          <object
            data={source}
            type="application/pdf"
            width="800"
            height="742 "
          >
            <iframe
              src={source}
              width="800"
              height="742"
            >
              <p>This browser does not support PDF!</p>
            </iframe>
          </object>
        </div>
      </CardHeader>
      <CardBody className="flex justify-between ">
        <div className="flex justify-start">
          <div className="w-[100px] flex justify-between">
            <Tooltip content="Add Notes" >
              <IconButton className="dark:text-gray-700" variant="outlined">
                <GiQuillInk size="24" className="text-gray-900" />
              </IconButton>
            </Tooltip>
            <Tooltip content="Open in New Tab" >
              <a href={source} target="_blank">
                <IconButton className="dark:text-gray-700" variant="outlined">
                  <ImNewTab size="20" className="text-gray-900" />
                </IconButton>
              </a>
            </Tooltip>
          </div>
        </div>
{       auth.role === "USER" && <Button onClick={handleClick} disabled={progress === 100} className="dark:text-gray-900  dark:bg-green-500 bg-green-400" >Mark as Complete</Button>
}      </CardBody>
      <CardFooter className="pt-0 ">

      </CardFooter>
    </Card>
  );
};

export default ResourceRenderer;
