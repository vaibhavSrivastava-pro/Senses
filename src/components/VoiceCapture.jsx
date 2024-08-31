
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import useClipboard from "react-use-clipboard";
import { useState, useEffect } from "react";
import axios from "axios"
// import { div } from '@tensorflow/tfjs';
import { useNavigate } from 'react-router-dom';
// import * as textgears from 'textgears-api'
// import lamejs from 'lamejs';

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
            const prompt = `Correct the following text gramatically. Strictly just return the corrected sentence and nothing else. The sentect is ${textToCorrect}`
            if (textToCorrect) {
                try {
                    const response = await axios({
                        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBh0pgV-O6iO-FPYCH7hjDwIzKYBepk4Z8`,
                        method: "post",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        data: {
                            contents: [{ parts: [{ text: prompt }] }],
                        },
                    });
    
                    const correctedText = response.data.candidates[0].content.parts[0].text;
                    setVoice(correctedText);
                
                    // const playhtRequestData = {
                    //     quality: 'medium',
                    //     output_format: 'mp3',
                    //     speed: 1,
                    //     sample_rate: 24000,
                    //     text: correctedText,
                    //     voice: "s3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0ef-dd630f59414e/female-cs/manifest.json"
                    // };
    
                    // const audioResponse = await axios.post(
                    //     'https://senses-a1ca7d3zr-vaibhav-srivastavas-projects.vercel.app/api/ttsProxy',
                    //     playhtRequestData,
                    //     { responseType: 'arraybuffer' }
                    // );
                    
                    // const audioBlob = new Blob([audioResponse.data], { type: 'audio/mpeg' });
                    // const audioUrl = URL.createObjectURL(audioBlob);
                    // setVoice(audioUrl);

                    // setVoice(audioUrl); // Set the voice state to the audio URL
                } catch (error) {
                    console.error("Error:", (error.response ? error.response.data : error.message));
                    setVoice("Sorry - Something went wrong. Please try again!");
                }
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










