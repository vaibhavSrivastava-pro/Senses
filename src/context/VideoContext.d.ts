     // src/context/VideoContext.d.ts
     import React from 'react';

     interface VideoContextType {
       video: Blob | null;
       setVideo: React.Dispatch<React.SetStateAction<Blob | null>>;
     }

     declare module '../context/VideoContext' {
       export function useVideo(): VideoContextType;
     }