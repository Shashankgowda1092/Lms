import { createContext, useContext } from "react";

type Completion = {
  topicId: number;
  progress: number;
};

interface CompletionContextType {
  completion: Completion;
  setCompletion: React.Dispatch<React.SetStateAction<Completion>>; // Define the type of 'setView'
}

const defaultContext = {
  completion: {
    topicId: 0,
    progress: 0,
  },
  setCompletion: (completion: Completion) => {},
} as CompletionContextType;

export const CompletionContext =
  createContext<CompletionContextType>(defaultContext);
