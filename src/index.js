import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";
import { VideoProvider } from "./context/VideoContext";
import { VoiceProvider } from "./context/VoiceContext"; 

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthContextProvider>
    <ChatContextProvider>
      <React.StrictMode>
      <VideoProvider>
        <VoiceProvider>
          <App />
        </VoiceProvider>
      </VideoProvider>
      </React.StrictMode>
    </ChatContextProvider>
  </AuthContextProvider>
);
