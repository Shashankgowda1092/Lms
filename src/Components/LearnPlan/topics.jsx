import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { myHeaders } from '../../Services/IpAddress';

export function Topics() {
  const [topics, setTopics] = useState([
    { topicName: "", duration: "", subtopics: [{ subtopicName: "" }] },
  ]);
  const location = useLocation();
  const courseId = location.state.courseId;
  const [showAlert, setShowAlert] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const navigate = useNavigate();
  const [customErrorMessage, setCustomErrorMessage] = useState("");

  const handleAddTopic = () => {
    setTopics([...topics, { topicName: "", duration: "", subtopics: [{ subtopicName: "" }] }]);
  };

  const handleDeleteTopic = (index) => {
    const newTopics = [...topics];
    newTopics.splice(index, 1);
    setTopics(newTopics);
  };

  const handleAddSubtopic = (topicIndex) => {
    const newTopics = [...topics];
    newTopics[topicIndex].subtopics.push({ subtopicName: "" });
    setTopics(newTopics);
  };

  const handleDeleteSubtopic = (topicIndex, subtopicIndex) => {
    const newTopics = [...topics];
    newTopics[topicIndex].subtopics.splice(subtopicIndex, 1);
    setTopics(newTopics);
  };

  const handleChangeTopic = (index, value) => {
    const newTopics = [...topics];
    newTopics[index].topicName = value;
    setTopics(newTopics);
  };

  const handleChangeDuration = (index, value) => {
    const newTopics = [...topics];
    newTopics[index].duration = value;
    setTopics(newTopics);
  };

  const handleChangeSubtopic = (topicIndex, subtopicIndex, value) => {
    const newTopics = [...topics];
    newTopics[topicIndex].subtopics[subtopicIndex].subtopicName = value;
    setTopics(newTopics);
  };

  const handleSubmitAllTopics = (e) => {
    e.preventDefault();

    const allTopicsData = topics.map((topicData, index) => ({
      topicId: index,
      topicName: topicData.topicName,
      duration: topicData.duration,
      subtopics: topicData.subtopics.map((subtopicData, subindex) => ({
        subtopicId: subindex,
        subtopicName: subtopicData.subtopicName,
      })),
      course: {
        courseId: courseId,
      },
    }));

    if (topics.some((topic) => topic.topicName.trim() === "" || topic.duration.trim() === "")) {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return;
    }

    if (topics.every((topic) => topic.subtopics.some((subtopic) => subtopic.subtopicName.trim() === ""))) {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return;
    }

    axios
      .post(`${import.meta.env.VITE_API_URL}/topic/multiple`, allTopicsData, {
        headers: {
          ...myHeaders,
          Authorization: `Bearer ${sessionStorage.getItem('auth')}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        console.log("Topics data posted successfully:", response.data);
        setSuccessAlert(true);
        setTimeout(() => {
          setSuccessAlert(false);
          navigate("/dashboard/admin");
        }, 2000);
      })
      .catch((error) => {
        setCustomErrorMessage(error.message);
        console.error("Error posting topics data:", error);
      });

    setTopics([{ topicName: "", duration: "", subtopics: [{ subtopicName: "" }] }]);
  };

  return (
    <div className="h-screen w-full flex justify-center items-center ">
      {successAlert && (
        <Alert
          color="green"
          className="absolute top-1 right-2 animate-fadeOut w-1/4"
        >
          Topics Added Successfully
        </Alert>
      )}
      {customErrorMessage && (
        <Alert
          color="red"
          className="absolute top-1 right-2 animate-fadeOut w-[28%]"
        >
          <svg
            style={{ display: "inline", marginRight: "10px" }}
            fill="#ffffff"
            width="24px"
            height="34px"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            stroke="#ffffff"
          >
            <g id="SVGRepo_bgCarrier"></g>
            <g id="SVGRepo_tracerCarrier"></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M12,1A11,11,0,1,0,23,12,11.013,11.013,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9.011,9.011,0,0,1,12,21Zm1-3H11V16h2Zm0-4H11V6h2Z"></path>
            </g>
          </svg>
          {customErrorMessage}
        </Alert>
      )}
      {showAlert && (
        <Alert
          color="red"
          className="absolute top-1 right-2 animate-fadeOut w-1/4"
        >
          Please fill all the Fields.
        </Alert>
      )}
      <Card className="mt-10 w-full md:w-3/4 lg:w-2/4 xl:w-2/4 mx-auto h-auto">
        <CardHeader
          variant="gradient"
          color="gray"
          className="grid h-[100px] place-items-center "
          style={{ background: "#023047" }}
        >
          <Typography variant="h5" color="white" className="mb-2">
            Add Topics
          </Typography>
        </CardHeader>
        <CardBody className="max-h-[65vh] pt-0 overflow-y-auto">
          <form
            className="container p-6 bg-white rounded-lg"
            onSubmit={handleSubmitAllTopics}
          >
            <div className="mb-4">
              {topics.map((topic, topicIndex) => (
                <div key={topicIndex} className="flex flex-col gap-1">
                  <div className="form-group mt-1">
                    <Input
                      id={`topicName${topicIndex}`}
                      name="topicName"
                      label="Topic Name"
                      value={topic.topicName}
                      onChange={(e) =>
                        handleChangeTopic(topicIndex, e.target.value)
                      }
                      variant="outlined"
                      margin="normal"
                    />
                  </div>
                  <div className="form-group mt-1">
                    <Input
                      id={`duration${topicIndex}`}
                      name="duration"
                      label="Topic Duration"
                      value={topic.duration}
                      onChange={(e) =>
                        handleChangeDuration(topicIndex, e.target.value)
                      }
                      variant="outlined"
                      margin="normal"
                    />
                  </div>
                  {topic.subtopics.map((subtopic, subtopicIndex) => (
                    <div key={subtopicIndex} className="flex flex-col gap-1">
                      <div className="form-group mt-1">
                        <Input
                          id={`subtopicName${topicIndex}-${subtopicIndex}`}
                          name="subtopicName"
                          label="Subtopic Name"
                          value={subtopic.subtopicName}
                          onChange={(e) =>
                            handleChangeSubtopic(
                              topicIndex,
                              subtopicIndex,
                              e.target.value
                            )
                          }
                          variant="outlined"
                          margin="normal"
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button
                          className="bg-red-600 text-white relative flex justify-center items-center w-1/5 custom-button"
                          onClick={() =>
                            handleDeleteSubtopic(topicIndex, subtopicIndex)
                          }
                        >
                          <svg
                            fill="#ffffff"
                            height="18px"
                            width="64px"
                            version="1.1"
                            id="Layer_1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            stroke="#ffffff"
                          >
                            <g id="SVGRepo_bgCarrier"></g>
                            <g id="SVGRepo_tracerCarrier"></g>
                            <g id="SVGRepo_iconCarrier">
                              <path d="M42.7,469.3c0,23.5,19.1,42.7,42.7,42.7h341.3c23.5,0,42.7-19.1,42.7-42.7V192H42.7V469.3z M362.7,256h42.7v192h-42.7V256z M234.7,256h42.7v192h-42.7V256z M106.7,256h42.7v192h-42.7V256z M490.7,85.3h-128V42.7C362.7,19.1,343.5,0,320,0H192 c-23.5,0-42.7,19.1-42.7,42.7v42.7h-128C9.5,85.3,0,94.9,0,106.7V128c0,11.8,9.5,21.3,21.3,21.3h469.3c11.8,0,21.3-9.5,21.3-21.3 v-21.3C512,94.9,502.5,85.3,490.7,85.3z M320,85.3H192V42.7h128V85.3z"></path>
                            </g>
                          </svg>
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="mb-4 flex flex-col md:flex-row justify-around gap-1">
                    <Button
                      className="bg-[#023047] text-white"
                      onClick={() => handleAddSubtopic(topicIndex)}
                    >
                      Add Subtopic
                    </Button>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      className="bg-red-600 text-white relative flex justify-center items-center w-1/5 custom-button"
                      onClick={() => handleDeleteTopic(topicIndex)}
                    >
                      <svg
                        fill="#ffffff"
                        height="18px"
                        width="64px"
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        stroke="#ffffff"
                      >
                        <g id="SVGRepo_bgCarrier"></g>
                        <g id="SVGRepo_tracerCarrier"></g>
                        <g id="SVGRepo_iconCarrier">
                          <path d="M42.7,469.3c0,23.5,19.1,42.7,42.7,42.7h341.3c23.5,0,42.7-19.1,42.7-42.7V192H42.7V469.3z M362.7,256h42.7v192h-42.7V256z M234.7,256h42.7v192h-42.7V256z M106.7,256h42.7v192h-42.7V256z M490.7,85.3h-128V42.7C362.7,19.1,343.5,0,320,0H192 c-23.5,0-42.7,19.1-42.7,42.7v42.7h-128C9.5,85.3,0,94.9,0,106.7V128c0,11.8,9.5,21.3,21.3,21.3h469.3c11.8,0,21.3-9.5,21.3-21.3 v-21.3C512,94.9,502.5,85.3,490.7,85.3z M320,85.3H192V42.7h128V85.3z"></path>
                        </g>
                      </svg>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mb-4 flex flex-col md:flex-row justify-around gap-1">
              <Button
                className="bg-[#023047] text-white"
                onClick={handleAddTopic}
              >
                Add Topic
              </Button>
              <Button
                type="submit"
                ripple={true}
                className="bg-[#023047] text-white"
              >
                Submit Topics and Finish
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

