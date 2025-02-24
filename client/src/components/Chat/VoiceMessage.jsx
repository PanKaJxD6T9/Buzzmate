import { useStateProvider } from "@/context/StateContext";
import React, { useEffect, useRef, useState } from "react";
import WaveSurfer  from "wavesurfer.js";
import Avatar from "../common/Avatar";
import { FaPauseCircle, FaPlay, FaStop } from "react-icons/fa";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";
import { HOST } from "@/utils/ApiRoutes";

function VoiceMessage({message}) {

  const [{userInfo, currentChatUser}] = useStateProvider();
  const [audioMessage, setAudioMessage] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayBackTime, setCurrentPlayBackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const waveFormRef = useRef(null);
  const waveForm = useRef(null);

  useEffect(() => {
    if(waveForm.current === null){
      waveForm.current = WaveSurfer.create({
        container: waveFormRef.current,
        waveColor: "#fff",
        progressColor: "#fff",
        cursorColor: "#7ae3c3",
        barWidth: 2,
        height: 30,
        responsive: true
      })

      waveForm.current.on('finish', () => {
        setIsPlaying(false);
      })
    }

    return () => {
      waveForm.current.destroy();
    }
  }, [])

  useEffect(() => {
    const audioURL = `${HOST}/${message.message}`;
    console.log('Audio URL:', audioURL); // Log the audio URL
    const audio = new Audio(audioURL);
    setAudioMessage(audio);
  
    if (waveForm.current) {
      waveForm.current.on("ready", () => {
        console.log('WaveSurfer is ready to load audio.');
        waveForm.current.load(audioURL);
        waveForm.current.on("ready", () => {
          setTotalDuration(waveForm.current.getDuration());
        });
      });
    } else {
      console.error('WaveSurfer is not initialized yet.');
    }
  }, [message.message]);

  useEffect(() => {
    if (audioMessage) {
      const updatePlaybackTime = () => {
        setCurrentPlayBackTime(audioMessage.currentTime);
      };

      audioMessage.addEventListener("timeupdate", updatePlaybackTime);
      return () => {
        audioMessage.removeEventListener("timeupdate", updatePlaybackTime);
      };
    }
  }, [audioMessage]);

  const formatTime = (time) => {
    if(isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const playAudio = () => {
  
    if (waveForm.current) {
      // waveForm.current.stop();
      // waveForm.current.play();
      if (audioMessage) {
        audioMessage.play();
        setIsPlaying(true);
      } 
    } 
  };

  const pauseAudio = () => {
    // waveForm.current.stop();
    audioMessage.pause();
    setIsPlaying(false);
  }

  

  return (
    <div className={`flex items-center gap-5 text-white px-4 pr-2 py-4 text-sm rounded-md ${message.senderId === currentChatUser?.id ? "bg-[#404D61]" : "bg-[#3B4754]"}`}>
      <div>
        <Avatar type="lg" image={currentChatUser?.profileImage || "/user.png"}/>
      </div>
      <div className="cursor-pointer text-xl">
        {
          !isPlaying ? <FaPlay onClick={playAudio}/> : <FaStop onClick={pauseAudio}/>
        }
      </div>
      <div className="relative ">
        <div className="w-60" ref={waveFormRef} />
        <div className="text-bubble-meta text-[11px] pt-1 flex justify-between absolute bottom-[-22px] w-full">
          <span>
            {formatTime(isPlaying ? currentPlayBackTime : totalDuration)}
          </span>
          <div className="flex gap-1">
            <span>
              {calculateTime(message.createdAt)}
            </span>
            {
              message.senderId === userInfo?.id && <MessageStatus status={message.messageStatus} />
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoiceMessage;
