// BatchContext.js
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { createContext, useContext, useState, useEffect } from "react";

const BatchContext = createContext();

// eslint-disable-next-line react/prop-types
export const BatchProvider = ({ children }) => {
  const [id, setId] = useState(() => {
    // Initialize with batch ID from local storage or null
    const storedBatchId = localStorage.getItem("id");
    return storedBatchId ? parseInt(storedBatchId) : null;
  });

  useEffect(() => {
    if (id) {
      localStorage.setItem("id", id); // Store batch ID in local storage
    } else {
      localStorage.removeItem("id"); // Remove batch ID from local storage if null
    }
  }, [id]);

  return (
    <BatchContext.Provider value={{ id, setId }}>
      {children}
    </BatchContext.Provider>
  );
};

export const useBatch = () => useContext(BatchContext);
