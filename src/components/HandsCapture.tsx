import React, { useEffect } from 'react';
import { useContext, useState } from 'react';
import useLogic from './hands-capture/hooks/index.ts';
import RecordRTC, { RecordRTCPromisesHandler } from 'recordrtc';
import { saveAs } from 'file-saver';
import { useVideo } from "../context/VideoContext.js";
import { useNavigate } from 'react-router-dom';

function HandsCapture() {
  const { videoElement, maxVideoWidth, maxVideoHeight, canvasEl } = useLogic();
  const [recorder, setRecorder] = useState<RecordRTC | null>(); 
  const [stream, setStream] = useState<MediaStream | null>();  
  const [videoBlob, setVideoBlob] = useState<Blob | null>();
  const [isRecording, setIsRecording] = useState(false);
  const { video, setVideo } = useVideo();

  const navigate = useNavigate();

  // useEffect(() => {
  //   return () => {
  //     if (stream) {
  //       stream.getTracks().forEach((track) => {
  //       track.stop();
  //       });
  //     }
  //   };
  // }, [stream]);

  const startRecording = async() => {


    const stream: MediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });
    const recorder = new RecordRTCPromisesHandler(stream, {
      type: 'video',
    });
    await recorder.startRecording();
    setRecorder(recorder);
    setStream(stream);
    setIsRecording(true)
  }
  
  const stopRecording = async() => {
    if(recorder)
    {
      await recorder.stopRecording()
      ;(stream as any).stop()
      const blob = await recorder.getBlob();
      setVideoBlob(blob);
      setVideo(blob);
      setStream(null);
      setRecorder(null);
      setIsRecording(false);
    }
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setStream(null);
      setRecorder(null);
    }
    navigate('/');
  }


  const downloadVideo = () => {
    if(videoBlob){
      saveAs(videoBlob as Blob, `Video-${Date.now()}.mp4`);
    }
  }



  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
      className='video-capture'
    >
      <video
        style={{ display: 'none' }}
        className='video'
        playsInline
        ref={videoElement}
      />
      <canvas ref={canvasEl} width={maxVideoWidth} height={maxVideoHeight} />
        <div style={{ display: 'flex', flexDirection: 'row' }}>
        {isRecording ? (
          <button onClick={stopRecording} style={{ margin: '5px', color: 'white', border: 'none', backgroundColor: 'red' }}>
            Stop Recording
          </button>
        ) : (
          <button onClick={startRecording} style={{ margin: '5px', color: 'white', border: 'none', backgroundColor: '#5AB2FF' }}>
            Start Recording
          </button>
        )}
        {/* <button onClick={downloadVideo} style={{ margin: '5px', padding: '10px', color: 'white', border: 'none', backgroundColor: 'blue' }}>
          Download
        </button> */}
      </div>
    </div>
  );
}

export default HandsCapture;