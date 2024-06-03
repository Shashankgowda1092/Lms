import { createContext, useContext } from "react";

type View = {
  id: number ,
  type: "pptx" | "ppt" | "pdf" | "youtubeVideo" | "video" | "docx" | "link" | undefined,
  name: string,
  source: string,
  progress: number

}
interface ViewerContextType {
  view: View // Define the type of 'view'
  setView: React.Dispatch<React.SetStateAction<View>>; // Define the type of 'setView'
}

const defaultView = {
  view: {
    id: 0,
    type: undefined,
    name: "Welcome to Learning Dashboard",
    source: "www.google.com",
    progress: 0
  },
  setView: (view: View) => { }
} as ViewerContextType;


export const viewerContext = createContext<ViewerContextType>(defaultView);

