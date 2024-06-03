import { createContext, useContext } from "react";



interface TopicIdContextType {
    topicId: number;
    setTopicId: React.Dispatch<React.SetStateAction<number>>; // Define the type of 'setView'
}

const defaultContext = {
    topicId: 0,
    setTopicId: (topicId: number) => { },
} as TopicIdContextType;

export const TopicIdContext =
    createContext<TopicIdContextType>(defaultContext);


interface TopicContextType {
    topic: {};
    setTopic: React.Dispatch<React.SetStateAction<{}>>; // Define the type of 'setView'
}

const defaultContextTopic = {
    topic: {},
    setTopic: (topic: {}) => { },
} as TopicContextType;

export const TopicContext =
    createContext<TopicContextType>(defaultContextTopic);


