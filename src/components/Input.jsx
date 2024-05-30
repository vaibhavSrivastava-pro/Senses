import React, { useContext, useState, useEffect } from "react";
import Img from "../img/img.png";
import VideoIcon from "../img/video.png";
import MicIcon from "../img/microphone.png"
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useVideo } from "../context/VideoContext";
import { useVoice } from "../context/VoiceContext.js";
import { useNavigate } from "react-router-dom";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const { video, setVideo } = useVideo();

  const { voice, setVoice } = useVoice();

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const navigate = useNavigate();

  const videoCapture = () => {
    navigate('./ObjectDetection');
  };

  const audioCapture = () => {
    navigate('./VoiceCapture');
    setText(voice)
  };

  useEffect(() => {
    if (voice) {
      setText(voice);
    }
  }, [voice]);

  // console.log("Input", voice)

  // console.log("text", text)

  const handleSend = async () => {
    let file = img || video;
    if (file) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Handle progress
        },
        (error) => {
          // Handle error
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            const messageData = {
              id: uuid(),
              text,
              senderId: currentUser.uid,
              date: Timestamp.now(),
              ...(img && { img: downloadURL }),
              ...(video && { video: downloadURL }),
              ...(voice && { voice: voice })
            };
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion(messageData),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
          // ...(voice && { text: voice }),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: { text },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: { text },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
    setVideo(null);
    setVoice(null);
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          id="imageFile"
          onChange={(e) => {
            setImg(e.target.files[0]);
            setVideo(null);
            setVoice(null);
          }}
        />
        <label htmlFor="imageFile">
          <img src={Img} alt="Upload" />
        </label>
        {/* <input
          type="file"
          accept="video/*"
          style={{ display: "none" }}
          id="videoFile"
          onChange={(e) => {
            setVideo(e.target.files[0]);
            setImg(null);
          }}
        /> */}
        <label htmlFor="videoFile" onClick={videoCapture}>
          <img src={VideoIcon} alt="Upload Video" />
        </label>

        <label htmlFor="text" onClick={audioCapture}>
          <img src={MicIcon} alt="Upload Audio" />
        </label>

        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;