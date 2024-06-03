import { createContext, useContext } from "react";



interface searchContextType {
    searchText: string;
    setSearchText: React.Dispatch<React.SetStateAction<string>>; // Define the type of 'setView'
}

const defaultContext = {
    searchText: "",
    setSearchText: (searchText: string) => { },
} as searchContextType;

export const searchContext =
    createContext<searchContextType>(defaultContext);
