
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import useClipboard from "react-use-clipboard";
import { useState, useEffect } from "react";
import { div } from '@tensorflow/tfjs';
import { useNavigate } from 'react-router-dom';
import * as textgears from 'textgears-api'
import lamejs from 'lamejs';

import { useVoice } from "../context/VoiceContext.js";

const VoiceCapture = () => {
    const [textToCopy, setTextToCopy] = useState("");
    const [isCopied, setCopied] = useClipboard(textToCopy, {
        successDuration: 1000
    });

    const [isListening, setIsListening] = useState(false);

    const [data, setData] = useState(null);

    const { voice, setVoice } = useVoice();

    const navigate = useNavigate();


    const { transcript, browserSupportsSpeechRecognition, finalTranscript } = useSpeechRecognition();


    if (!browserSupportsSpeechRecognition) {
        console.error("Browser does not support speech recognition");
        return <p>Browser does not support speech recognition.</p>;
    }

    
    

    const startListening = () => {
    
        SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
        setIsListening(!isListening);
    }

    const stopListening = async() => {
        SpeechRecognition.stopListening();
        console.log("Transcript:", transcript)
        if (transcript) {
            const textToCorrect = transcript.trim();
            if (textToCorrect) {
                const encodedText = encodeURIComponent(textToCorrect);
                const apiUrl = `https://api.textgears.com/correct?text=${encodedText}&language=en-GB&key=9hM7bfbvh7Mvbrxg`;

                fetch(apiUrl)
                    .then(response => response.json())
                    .then(data => {
                        console.log('TextGears API Response:', data.response.corrected);
                        setVoice(data.response.corrected)
                    })
                    .catch(error => {
                        console.error('Error fetching from TextGears API:', error);
                    });
            } else {
                console.log('No text to correct.');
            }
        }

        // convertTextToSpeechAndGenerateMP3(data)

        navigate('/')
    }

    // console.log("Transcript:", transcript)

    const handleCopy = () => {
        setTextToCopy(transcript);
        setCopied();
    };

    console.log(transcript)

    
    // const convertTextToSpeechAndGenerateMP3 = (text) => {
    //     if ('speechSynthesis' in window) {
    //         const synth = window.speechSynthesis;
    //         const utterance = new SpeechSynthesisUtterance(text);
    //         utterance.lang = 'en-GB';
    //         utterance.rate = 1;
    //         utterance.pitch = 1;
    //         const voices = synth.getVoices();
    //         utterance.voice = voices.find(voice => voice.lang === 'en-GB');

    //         const handleSpeechEnd = () => {
    //             const synthUtterance = new SpeechSynthesisUtterance();
    //             synthUtterance.text = "";
    //             synth.speak(synthUtterance);
    //         };

    //         utterance.addEventListener('end', handleSpeechEnd);

    //         const encodeSpeechToMP3 = (audioBuffer) => {
    //             const mp3Encoder = new lamejs.Mp3Encoder(1, audioBuffer.length, 16000);
    //             const mp3Array = mp3Encoder.encodeBuffer(audioBuffer);
    //             const mp3Blob = new Blob([mp3Array], { type: 'audio/mp3' });
    //             setVoice(mp3Blob);
    //         };

    //         utterance.addEventListener('audioavailable', (event) => {
    //             const audioBuffer = event.bufferData.getChannelData(0);
    //             encodeSpeechToMP3(audioBuffer);
    //         });

    //         synth.speak(utterance);
    //     } else {
    //         console.error('Speech synthesis not supported in this browser.');
    //     }
    // };

    return (
        <div className="voice-capture">
            <div className="container">
                <h2>Speak what your heart says</h2>
                <p></p>
                <div className="main-content" onClick={handleCopy}>
                    {transcript || "Click 'Start Listening' and begin speaking."}
                </div>
                <div className="btn-style">
                    {/* <button onClick={handleCopy}>
                        {isCopied ? 'Copied!' : 'Copy to clipboard'}
                    </button> */}
                    {/* <button onClick={startListening}>Start Listening</button> */}
                    <button onClick={startListening} style={{ backgroundColor: isListening ? 'blue' : '#5AB2FF' }}>
                        {isListening ? 'Stop Listening' : 'Start Listening'}
                    </button>
                    <button onClick={stopListening}>Return to Chat</button>
                </div>
            </div>
        </div>
    );
};

export default VoiceCapture;










