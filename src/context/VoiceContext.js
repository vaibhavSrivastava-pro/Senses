import React, { createContext, useState, useContext } from 'react';

const VoiceContext = createContext(null);

export const VoiceProvider = ({ children }) => {
  const [voice, setVoice] = useState(null);

  return (
    <VoiceContext.Provider value={{ voice, setVoice }}>
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => useContext(VoiceContext);