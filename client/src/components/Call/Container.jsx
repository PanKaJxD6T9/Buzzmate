import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { GET_CALL_TOKEN_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import Image from "next/image";
import React , { useState, useEffect } from "react";
import { MdOutlineCallEnd } from "react-icons/md";
import { ZegoExpressEngine } from "zego-express-engine-webrtc";

function Container({data}) {

  const [{socket, userInfo}, dispatch] = useStateProvider();

  const [callAccepted, setcallAccepted] = useState(false);

  const [token, setToken] = useState(undefined)

  const [zgVar, setzgVar] = useState(undefined)

  const [localStream, setLocalStream] = useState(undefined)

  const [publishedStream, setPublishedStream] = useState(undefined)

  React.useEffect(()=>{
    if(data.type === "outgoing"){
      socket.current.on("accept-call", (data) => {
        setcallAccepted(true);
      })
    } else {
      setTimeout(()=>{
        setcallAccepted(true);  
      }, 1000)
    }
  }, [data])

  React.useEffect(() => {
    const getToken = async() => {
      try{
        const {data: {token: returnedToken}} = await axios.get(`${GET_CALL_TOKEN_ROUTE}/${userInfo.id}`);
        setToken(returnedToken);
      } catch(err){
        console.log(err);
      }
    }
    getToken();
  }, [callAccepted])

  React.useEffect(() => {
    const startCall = async() => {
      // Only proceed if call is accepted
      if (!callAccepted) return;

      import("zego-express-engine-webrtc").then(async({ZegoExpressEngine})=>{
        const zg = new ZegoExpressEngine(process.env.NEXT_PUBLIC_ZEGO_APP_ID, process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET);
        setzgVar(zg);
        zg.on("roomStreamUpdate", async(roomId, updateType, streamList, extendedData)=>{
          if(updateType === "ADD"){
            const rmVideo = document.getElementById("remote-video");
            if(!rmVideo) {
              console.error("Remote video container not found");
              return;
            }
            const vd = document.createElement(data.callType === "video" ? "video" : "audio");
            vd.id = streamList[0].streamID;
            vd.autoplay = true;
            vd.playsInline = true;
            vd.muted = false;
            rmVideo.appendChild(vd);
            
            try {
              const stream = await zg.startPlayingStream(streamList[0].streamID, {
                audio: true,
                video: data.callType === "video"
              });
              if(stream && vd) {
                vd.srcObject = stream;
              }
            } catch(err) {
              console.error("Failed to play stream:", err);
              // Retry once after a short delay
              setTimeout(async () => {
                try {
                  const stream = await zg.startPlayingStream(streamList[0].streamID, {
                    audio: true,
                    video: data.callType === "video"
                  });
                  if(stream && vd) {
                    vd.srcObject = stream;
                  }
                } catch(retryErr) {
                  console.error("Retry failed:", retryErr);
                }
              }, 1000);
            }
          } else if(updateType === "DELETE" && zg && localStream && streamList[0].streamID === localStream.id){
            zg.destroyStream(localStream);
            zg.stopPublishingStream(streamList[0].streamID);
            zg.logoutRoom(data.roomId.toString());
            dispatch({type: reducerCases.SET_END_CALL})
          }
        });
        try {
          await zg.loginRoom(data.roomId.toString(), token, {
            userID: userInfo.id.toString(),
            userName: userInfo.name
          }, {
            userUpdate: true
          });
          const localStream = await zg.createStream({
            camera: {
              audio: true,
              video: data.callType === "video" ? true : false
            }
          });

          // Check if local-audio container exists
          const localVideo = document.getElementById("local-audio");
          if(!localVideo) {
            console.error("Local audio container not found");
            throw new Error("Local audio container not found");
          }

          const videoElement = document.createElement(data.callType === "video" ? "video" : "audio");
          videoElement.id = "video-local-zego";
          videoElement.className = "h-28 w-32";
          videoElement.autoplay = true;
          videoElement.muted = false;
          videoElement.playsInline = true;

          localVideo.appendChild(videoElement);
          
          const td = document.getElementById("video-local-zego");
          if(td && localStream) {
            td.srcObject = localStream;
          }
          
          // Generate a more unique stream ID using userID and timestamp
          const streamID = `${userInfo.id}_${Date.now()}`;
          setPublishedStream(streamID);
          setLocalStream(localStream);
          await zg.startPublishingStream(streamID, localStream);
        } catch(err) {
          console.error("Failed to initialize call:", err);
          dispatch({type: reducerCases.SET_END_CALL});
        }
      })
    }
    if(token){
      startCall();
    }
  }, [token])

  // Add cleanup effect when component unmounts
  React.useEffect(() => {
    return () => {
      // Cleanup function that runs when component unmounts
      if(localStream) {
        try {
          const tracks = localStream.getTracks();
          tracks.forEach(track => {
            track.enabled = false;
            track.stop();
          });
        } catch (err) {
          console.error('Error stopping tracks on unmount:', err);
        }
      }
    };
  }, [localStream]);

  const endCall = () => {
    const id = data?.id;

    // Stop all media tracks first before any other cleanup
    try {
      if(localStream) {
        const tracks = localStream.getTracks();
        tracks.forEach(track => {
          track.enabled = false;
          track.stop();
        });
        localStream.getTracks().forEach(track => track.stop());
      }

      // Also stop any tracks from video elements
      ['video-local-zego', 'remote-video'].forEach(elementId => {
        const element = document.getElementById(elementId);
        if(element && element.srcObject) {
          const mediaStream = element.srcObject;
          mediaStream.getTracks().forEach(track => {
            track.enabled = false;
            track.stop();
          });
          element.srcObject = null;
        }
      });
    } catch (err) {
      console.error('Error stopping media tracks:', err);
    }

    // Now handle Zego cleanup
    if(data?.callType === "video"){
      socket.current.emit("reject-video-call", {from: id});
      if(zgVar && localStream){
        if(publishedStream) {
          zgVar.stopPublishingStream(publishedStream);
        }
        zgVar.destroyStream(localStream);
        if(data.roomId) {
          zgVar.logoutRoom(data.roomId.toString());
        }
      }
    } else {
      socket.current.emit("reject-voice-call", {from: id});
    }

    // Clean up video elements
    const localVideo = document.getElementById("video-local-zego");
    if(localVideo) {
      localVideo.remove();
    }

    // Clear local states
    setLocalStream(undefined);
    setPublishedStream(undefined);
    dispatch({type: reducerCases.SET_END_CALL})
  }

  return <div className="border-conversation-border border-1 w-full h-[100vh] bg-gray-900 flex flex-col z-10 overflow-hidden items-center justify-center text-white ">
    <div className="flex flex-col gap-3 items-center">
      <span className="text-5xl">{data?.name}</span>
      <span className="text-lg">
        {
          callAccepted && data?.callType !== "video" ? "on-going call" : "calling"
        }
      </span>
    </div>
    {
      (!callAccepted || data.callType === "audio") && 
      <div className="my-24">
        <Image src={data?.profileImage || "/user.png"} width={300} height={300} alt="user" className="rounded-full"/>
      </div>
    }
    <div className="my-5 relative" id="remote-video">
      <div className="absolute bottom-5 right-5" id="local-audio"></div>
    </div>
    <div className="h-16 w-16 bg-red-600 flex items-center justify-center rounded-full" onClick={endCall}>
      <MdOutlineCallEnd className="text-3xl cursor-pointer"/>
    </div>
  </div>;
}

export default Container;
