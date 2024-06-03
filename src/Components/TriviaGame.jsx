import React, { useEffect, useRef, useState } from "react";
import {
  Typography,
  IconButton,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
} from "@material-tailwind/react";
import { FaArrowAltCircleDown } from "react-icons/fa";
import ReactCardFlip from "react-card-flip";
import axios from "axios";
import Confetti from "react-confetti";

const TriviaGame = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [numberOfPieces, setNumberOfPieces] = useState(10000);
  const [trivia, setTrivia] = useState(" ");
  const elementRef = useRef(null);
  const [celebrate,setCelebrate] = useState(false);
  // const [clicked, setClicked] = useState(false);
  useEffect(() => {
    if (celebrate) {
      console.log("inside effect")
      const timer = setTimeout(() => {
        if (numberOfPieces > 0) {
          setNumberOfPieces(numberOfPieces - 300); // Decrease numberOfPieces gradually
          console.log(numberOfPieces)
        }
      }, 100);
      

      return () => clearTimeout(timer);
    }
  }, [celebrate, numberOfPieces]);

  const handleClick = (e) => {
    e.stopPropagation();
    fetchFacts();

    // setTimeout(() => setClicked(false), 300); // Reset clicked state after 300ms
  };
  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const fetchFacts = async () => {
    try {
      const response = await axios.get(
        "https://api.api-ninjas.com/v1/trivia?category=general",
        {
          headers: {
            "X-Api-Key": "ABup4MXPQWm5ndwzKxyXTg==UwTUpagOhqZbF6ku",
          },
        }
      );

      // console.log(response.request.response)
      console.log(response.data[0]);
      setTrivia(response.data[0]);
    } catch (error) {
      console.error("Error fetching facts:", error);
    }
  };

  return (
    <>
      <Typography
        variant="paragraph"
        className="mt-1 text-pretty text-center text-sm text-gray-600"
      >
        While we enhance your learning experience, remember, learning never
        stops! <br />
        Here are some trivias for you:
      </Typography>

      <IconButton
        variant="outlined"
        onClick={(e) => {
          elementRef.current.scrollIntoView({ behavior: "smooth" });
          handleClick(e);
        }}
        className=" animate-bounce  mt-7 mb-[600px]"
      >
        <FaArrowAltCircleDown className="h-6 w-6 animate-pulse " />
      </IconButton>
     
      <div
        ref={elementRef}
        className=" p-56 flex flex-col items-center justify-center"
      >
          
        {!isFlipped ? (
          <Typography>Click on the card to reveal answer</Typography>
        ) : (
          <Typography>Did you guess it right?</Typography>
        )}
          {celebrate?<Confetti
                  width={1920}
                  height={2500}
                  gravity={0.1}
                  // numberOfPieces={numberOfPieces}
                  confettiSource={{ x: 500, y: 1080, w: 1, h: 1 }}
                  // initialVelocityX={ {min: 1 , max: 9}} // Set the initial velocity along the x-axis
                  // initialVelocityY={{ min: 1, max: 7 }} // Set the initial velocity along the y-axis
                />  : <></>}
        <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
          {/* front of card */}
          <Card
            className="mt-6 w-96 bg-red-500 hover:bg-red-900 shadow-2xl"
            onClick={handleCardClick}
          >
            <CardBody>
              <Typography variant="h5" color="white" className="mb-2 text">
                Trivia
              </Typography>
              <Typography color="white">{trivia.question}?</Typography>
            </CardBody>
            <CardFooter>
              <Button
                onClick={(e) => {
                  handleClick(e);
                }}
              >
                New Question
              </Button>
            </CardFooter>
          </Card>

          {/* back of card */}
          <Card
            className="mt-6 w-96 bg-green-500 hover:bg-green-400 shadow-2xl"
            onClick={handleCardClick}
          >
            <CardBody>
              <Typography variant="h5" color="white" className="mb-2">
                Answer
              </Typography>
              <Typography color="white">{trivia.answer}</Typography>
            </CardBody>
            <CardFooter>
              <div className="flex flex-col items-center">
              <Button
  onClick={(e) => {
    setNumberOfPieces(10000)
    console.log(numberOfPieces)

    e.stopPropagation();
    setCelebrate(true)
    setTimeout(
      ()=>{
        setCelebrate(false)
      },5800
    )
      
    
   
  }}
>
                  Celebrate
                </Button>
                {/* Ensure the ReactCanvasConfetti component is rendered */}
             
                 
              </div>
            </CardFooter>
          </Card>
        </ReactCardFlip>
      </div>
    </>
  );
};

export default TriviaGame;
