import { createContext, useContext } from "react";



interface CourseIdContextType {
    courseId: number;
    setCourseId: React.Dispatch<React.SetStateAction<number>>; // Define the type of 'setView'
}

const defaultContext = {
    courseId: 0,
    setCourseId: (courseId: number) => { },
} as CourseIdContextType;

export const CourseIdContext =
    createContext<CourseIdContextType>(defaultContext);


interface CourseContextType {
    course: {};
    setCourse: React.Dispatch<React.SetStateAction<{}>>; // Define the type of 'setView'
}

const defaultContextCourse = {
    course: {},
    setCourse: (course: {}) => { },
} as CourseContextType;

export const CourseContext =
    createContext<CourseContextType>(defaultContextCourse);


