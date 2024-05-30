import React, { createContext, useState, useContext } from 'react';

const VideoContext = createContext(null);

export const VideoProvider = ({ children }) => {
  const [video, setVideo] = useState(null);

  return (
    <VideoContext.Provider value={{ video, setVideo }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => useContext(VideoContext);