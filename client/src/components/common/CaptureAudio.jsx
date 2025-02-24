import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { ADD_AUDIO_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaMicrophone, FaPauseCircle, FaPlay, FaStop, FaTrash } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import WaveSurfer from 'wavesurfer.js';

function CaptureAudio({ hide }) {

  const [{userInfo, currentChatUser, socket}, dispatch] = useStateProvider();

  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [waveForm, setWaveForm] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentPlayBackTime, setCurrentPlayBackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [renderedAudio, setRenderedAudio] = useState(null);

  const audioRef = React.useRef(null);
  const mediaRecorderRef = React.useRef(null);
  const waveFormRef = React.useRef(null);

  useEffect(()=>{
    let interval;
    if(isRecording){
      interval = setInterval(() => {
        setRecordingDuration((prevDuration) => {
          setTotalDuration(prevDuration + 1);
          return prevDuration + 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRecording])

  useEffect(() => {
    const waveSurfer = WaveSurfer.create({
      container: waveFormRef.current,
      waveColor: "#fff",
      progressColor: "#fff",
      cursorColor: "#7ae3c3",
      barWidth: 2,
      height: 30,
      responsive: true
    })

    setWaveForm(waveSurfer);

    waveSurfer.on('finish', () => {
      setIsPlaying(false);
    })

    return () => {
      waveSurfer.destroy();
    }
  }, [])

  useEffect(() => {
    if(waveForm){
      startRecordingHandler();
    }
  }, [waveForm])

  const startRecordingHandler = () => {
    setRecordingDuration(0);
    setCurrentPlayBackTime(0);
    setTotalDuration(0);
    setRecordedAudio(null);
    setIsRecording(true);
    
    navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioRef.current.srcObject = stream;


      const chunks = [];
      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      }
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, {type: "audio/ogg; codecs=opus"});
        const audioURL = URL.createObjectURL(blob);
        const audio = new Audio(audioURL);
        setRecordedAudio(audio);
        
        waveForm.load(audioURL);
      }
      mediaRecorder.start();
    }).catch((err)=>{
      console.log("Error occured while accessing user media: " + err);
    })
  }

  const stopRecordingHandler = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      waveForm.stop();
    }

    const audioChunks = [];
    mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
      audioChunks.push(event.data);
    });

    mediaRecorderRef.current.addEventListener("stop", () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
      const audioFile = new File([audioBlob], "recording.mp3");
      setRenderedAudio(audioFile);
    });
  }

  useEffect(() => {
    if (recordedAudio) {
      const updatePlaybackTime = () => {
        setCurrentPlayBackTime(recordedAudio.currentTime);
      };

      recordedAudio.addEventListener("timeupdate", updatePlaybackTime);
      return () => {
        recordedAudio.removeEventListener("timeupdate", updatePlaybackTime);
      };
    }
  }, [recordedAudio]);


  const playRecording = () => {
    if(recordedAudio){
      waveForm.stop();
      waveForm.play();
      recordedAudio.play();
      setIsPlaying(true);
    }
  }

  const pauseRecording = () => {
    waveForm.stop();
    recordedAudio.pause();
    setIsPlaying(false);
  }

  const sendRecording = async() => {
    try{
      const formData = new FormData();
      formData.append("audio", renderedAudio);
      const response = await axios.post(ADD_AUDIO_MESSAGE_ROUTE, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        params: {
          from: userInfo?.id,
          to: currentChatUser?.id
        },
      });
      if (response.status === 201) {
        socket.current.emit("send-message", {
          message: response.data.message,
          from: userInfo?.id,
          to: currentChatUser?.id
        });
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: {
            ...response.data.message
          },
          fromSelf: true
        });
      }
    }catch(err){
      console.log(err);
    }
  }

  const formatTime = (time) => {
    if(isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex text-2xl w-full justify-end items-center">
      <div className="p-1">
        <FaTrash className="text-white cursor-pointer" onClick={() => hide()} />
      </div>
      <div className="mx-4 py-2 px-4 text-white text-lg flex gap-3 justify-center items-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 drop-shadow-lg">
        {
          isRecording ? (
            <div className="text-black animate-pulse w-60 text-center">
              <span>Recording...</span>
              <span>
                {recordingDuration}s
              </span>
            </div>
          ) : (
            <div className="">
              {
                recordedAudio && (
                  <>
                    {!isPlaying ? (
                      <FaPlay onClick={playRecording}/>
                    ) : (
                      <FaStop onClick={pauseRecording}/>
                    )}
                  </>
                )
              }
            </div>
          )
        }
        <div className="w-60" ref={waveFormRef} hidden={isRecording} />
        {
          recordedAudio && isPlaying && <span>{formatTime(currentPlayBackTime)}</span>
        }
        {
          recordedAudio && !isPlaying && <span>{formatTime(totalDuration)}</span>
        }
        <audio ref={audioRef} hidden />
      </div>
        <div className="mr-4">
          {!isRecording ? <FaMicrophone className="text-red-500" onClick={startRecordingHandler}/> : <FaPauseCircle className="text-red-500"  onClick={stopRecordingHandler}/>}
        </div>
        <div>
          <MdSend
            className={`cursor-pointer text-xl`}
            title="Send"
            onClick={sendRecording}
          />
        </div>
    </div>
  );
}

export default CaptureAudio;
