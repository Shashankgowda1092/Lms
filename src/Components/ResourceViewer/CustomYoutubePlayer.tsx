import React, { useState, useEffect, useRef, useContext } from "react";


import YouTube from "react-youtube";
// import { Options } from 'youtube-player/dist/types';
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Popover,
  PopoverContent,
  PopoverHandler,
  Progress,
  Slider,
  Typography,
} from "@material-tailwind/react";

import { CiWarning } from "react-icons/ci";
import {

  FaFastBackward,
  FaFastForward,
  FaPause,
  FaPlay,
} from "react-icons/fa";

import { HiMiniSpeakerWave } from "react-icons/hi2";
import { RiCheckboxCircleFill } from "react-icons/ri";
import { viewerContext } from "./viewerContext";
import { CompletionContext } from "./CompletionContext";
import axios from "axios";


interface YouTubePlayerProps {
  vidId: string;
}






const CustomYouTubePlayer: React.FC<YouTubePlayerProps> = (props) => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [completionProgress, setCompletionProgress] =
    useState<number>(progress);
  const playerRef = useRef<any>(null);
  const playArea = useRef<any>(null);
  const visibilityStateRef = useRef<any>(null);
  const [forwardQuota, setForwardQuota] = useState<number>(0);
  const [forwardSeekState, setForwardSeekState] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playerReady, setPlayerReady] = useState<boolean>(false);
  const [audioLevel, setAudioLevel] = useState<number>(50);
  const [completed, setCompleted] = useState<boolean>(false);


  const [open, setOpen] = useState<boolean>(false);
  const contextValue = useContext(viewerContext);
  let view = contextValue?.view;

  const { completion, setCompletion } = useContext(CompletionContext);

  const handleOpen = () => {
    playerRef.current.getPlayerState() === 1 && !completed && setOpen(true);

    console.log("Inside handle Open" + open);

    // handlePause(); // Pause the player
  };

  const handleVisibilityChange = () => {
    visibilityStateRef.current = document.visibilityState;
    console.log("Visibility State:", visibilityStateRef.current);
    if (playerReady && visibilityStateRef.current === "hidden") {
      console.log("Inside handleVisibilityChange if");
      handleOpen();
      !completed && handlePause();
    }
  };

  // Add event listener for visibilitychange when component mounts
  useEffect(() => {
    console.log("Adding event listener for visibilitychange");
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Remove event listener when component unmounts
    return () => {
      console.log("Removing event listener for visibilitychange");
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [playerReady]); // Add playerReady to the dependency array

  // Options for the YouTube player
  const opts = {
    playerVars: {
      controls: completed ? 1 : 0, // Hide controls
      disablekb: 1, // Disable keyboard controls
      autoplay: 0,
      playsinline: 1,
      enablejsapi: 1,
      rel: 0, // Don't show related videos
    },
  }
  const userID = sessionStorage.getItem("empId")
  const batchID = sessionStorage.getItem("id")
  const patchProgress = async ({ userID, resourceID, progress, batchID }) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_PROGRESS_SERVICE_URL}/user-progress/${userID}/batch/${batchID}/resource/${resourceID}/update/${progress}`,
        {},  // Payload, if needed you can put data here
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('auth')}`,
            'Content-Type': 'application/json',
            // Add other headers if necessary
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };
  
  const updateProgress = async (progressValue) => {
    // setCompletion({ topicId: view.id, progress: completionProgress })
    await patchProgress({ userID, resourceID: view.id, progress: progressValue, batchID })
  }

  useEffect(() => {
    const progressValue = completed ? 100 : completionProgress;

    // Set the completion progress in the context
    setCompletion({ topicId: view.id, progress: progressValue });

    //TODO send axios completion progess to backed


    updateProgress(progressValue);






  }, [completionProgress])


  useEffect(() => {
    if (completionProgress < progress) {
      setCompletionProgress(progress);


    }
  }, [progress]);



  useEffect(() => {
    // Calculate progress percentage

    if (playerReady) {
      playerRef.current.getPlayerState() === 1
        ? setIsPlaying(true)
        : setIsPlaying(false);
      // console.log(isPlaying);
    }

    if (duration > 0) {
      const percentage = (currentTime / duration) * 100;
      // console.log(isPlaying)
      setProgress(percentage);
    }
    if (progress > 90) {
      setCompleted(true);
      setForwardSeekState(true);
      //TODO send axios request saying video completed
    }
  }, [currentTime, duration]);
  const handleStateChange = (event: any) => {
    if (event.data === YouTube.PlayerState.PLAYING) {
      // Video started playing, start tracking progress
      const interval = setInterval(() => {
        setCurrentTime(playerRef.current?.getCurrentTime() || 0);
      }, 1000); // Update every second
      return () => clearInterval(interval); // Cleanup
    } else if (event.data === YouTube.PlayerState.ENDED) {
      // Video ended, reset progress
      setCurrentTime(0);
    }
  };
  const handleReady = (event: any) => {
    // Add event listener to playArea.current to flip isPlaying state when pressed

    playerRef.current = event.target;
    setAudioLevel(playerRef.current.getVolume());
    setCompletionProgress(view?.progress)
    console.log(playerRef.current)
    // setProgress(completionProgress)
    setDuration(event.target.getDuration());
    // console.log(JSON.stringify(playerRef.current))
    if (view.progress && !completed) {
      playerRef.current.seekTo(view.progress * duration / 100)
      setForwardQuota(999)
    } else {
      // playerRef.current.seekTo( duration -6 )
    }
    // setCurrentTime((view?.progress*duration)/100)
    setPlayerReady(true);
  };

  const handleSeekBackward = () => {
    handleSeekState();
    const newTime = currentTime - 5; // Subtract 5 seconds from the current time
    if (newTime < 0) {
      // Ensure new time is not negative
      playerRef.current.seekTo(0);
      setCurrentTime(0);
    } else {
      playerRef.current.seekTo(newTime);
      setCurrentTime(newTime);
    }
  };
  const handleSeekState = () => {
    if (view?.progress === 0) {
      setForwardQuota((forwardQuota) => {
        return forwardQuota + 1;
      });
    }
    if (forwardQuota < duration / 5 / 4) {
      setForwardSeekState(true);
    } else if (!completed) {
      setForwardSeekState(false);
      if (progress + 10 < completionProgress) {
        setForwardSeekState(true);
      }
    }
  };
  const handleSeekForward = () => {
    handleSeekState();
    if (forwardSeekState) {
      const newTime = currentTime + 5;
      if (newTime > duration) {
        playerRef.current.seekTo(duration);
        setCurrentTime(duration);
      } else {
        playerRef.current.seekTo(newTime);
        setCurrentTime(newTime);
      }
    }
  };

  const handlePlay = () => {
    if (!isPlaying) {
      playerRef.current.playVideo();
      // setIsPlaying(true);
    }
    playerRef.current.playVideo();
  };
  const handlePause = () => {
    if (isPlaying) {
      playerRef.current.pauseVideo();
      // setIsPlaying(false);
    }
    playerRef.current.pauseVideo();
  };
  const handleVolume = (volume: any) => {
    setAudioLevel(volume);

    playerRef.current.setVolume(audioLevel);
    console.log(playerRef.current);
  };



  return (
    <>
      <div className="flex flex-col items-center  ">
        <span>
          <YouTube
            iframeClassName="w-[906px] h-[78vh]"
            videoId={props.vidId}
            opts={opts}
            onStateChange={handleStateChange}
            onReady={handleReady}
          />

          {!completed && (
            <div className="relative">

              <Progress

                value={completionProgress}
                size="md"
                className="bg-[#eeeeee]"
                color="blue-gray"
              />
              <Progress

                value={progress}
                color="blue"
                size="md"
                className="absolute bg-transparent -mt-[0.62rem]  z-10"
              />

            </div>
          )}
        </span>
        <span
          ref={playArea}
          className="relative flex flex-row space-x-10 justify-center mt-4"
        >
          <IconButton
            id="seek_backward"
            variant="text"
            color="black"
            onClick={handleSeekBackward}
          >
            <FaFastBackward style={{ fontSize: "1.5rem" }} />
          </IconButton>
          <IconButton
            id="play"
            variant="text"
            onClick={handlePlay}
            color={isPlaying ? "blue-gray" : "green"}
            ripple={isPlaying ? false : true}
          >
            <FaPlay style={{ fontSize: "1.5rem" }} />
          </IconButton>
          <IconButton
            id="pause"
            variant="text"
            color={isPlaying ? "red" : "blue-gray"}
            ripple={isPlaying ? true : false}
            onClick={handlePause}
          >
            <FaPause style={{ fontSize: "1.5rem" }} />
          </IconButton>
          <IconButton
            id="seek_forward"
            variant="text"
            color={forwardSeekState ? "black" : "blue-gray"}
            ripple={forwardSeekState}
            onClick={handleSeekForward}
          >
            <FaFastForward style={{ fontSize: "1.5rem" }} />
          </IconButton>
          <Popover placement="bottom-start">
            <PopoverHandler>
              <IconButton id="volume" variant="text" color={"black"}>
                <HiMiniSpeakerWave style={{ fontSize: "1.5rem" }} />
              </IconButton>
            </PopoverHandler>
            <PopoverContent className="bg-gray-800">
              <Slider
                size="md"
                min={0}
                max={100}
                step={0.02}
                value={audioLevel}
                onChange={(event) => {
                  handleVolume(event.target.valueAsNumber);
                }}
              />
            </PopoverContent>
          </Popover>
        </span>
        <Dialog open={open} handler={handleOpen}>
          <DialogHeader>
            <div className="flex flex-row  text-red-700">
              <CiWarning className="text-red-700 font-bold size-16" />
              <Typography variant="h6" className="text-2xl font-bold pl-3 pt-5">
                You Seem To Have Wandered Off
              </Typography>
            </div>
          </DialogHeader>

          <DialogBody>
            It appears that you are not looking at the video. This behavior is
            not encouraged. Your Progress was not tracked
          </DialogBody>
          <DialogFooter>
            <Button
              variant="gradient"
              color="red"
              onClick={() => {
                setOpen(false);
              }}
            >
              <span>Take me back to the video</span>
            </Button>
          </DialogFooter>
        </Dialog>

        {completed && (
          <div className="flex flex-col items-center justify-center mt-5">
            <Typography
              className="text-green-500 font-extrabold"
              color="blue-gray"
              variant="h6"
            >
              Video Completed
            </Typography>
            <RiCheckboxCircleFill size="100" className="text-green-800 dark:text-green-400" />
          </div>
        )}
      </div>
    </>
  );
};
export default CustomYouTubePlayer;
