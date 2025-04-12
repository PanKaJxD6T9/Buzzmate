import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { GET_CALL_TOKEN_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import Image from "next/image";
import React , { useState } from "react";
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
      import("zego-express-engine-webrtc").then(async({ZegoExpressEngine})=>{
        const zg = new ZegoExpressEngine(process.env.NEXT_PUBLIC_ZEGO_APP_ID, process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET);
        setzgVar(zg);
        zg.on("roomStreamUpdate", async(roomId, updateType, streamList, extendedData)=>{
          if(updateType === "ADD"){
            const rmVideo = document.getElementById("remote-video");
            const vd = document.createElement(data.callType === "video" ? "video" : "audio");
            vd.id = streamList[0].streamID;
            vd.autoplay = true;
            vd.playsInline = true;
            vd.muted = false;
            if(rmVideo){
              rmVideo.appendChild(vd);
            }
            zg.startPlayingStream(streamList[0].streamID, {
              audio: true,
              video: true
            }).then((stream)=>{
              vd.srcObject = stream
            });
          } else if(updateType === "DELETE" && zg && localStream && streamList[0].streamID === localStream.id){
            zg.destroyStream(localStream);
            zg.stopPublishingStream(streamList[0].streamID);
            zg.logoutRoom(data.roomId.toString());
            dispatch({type: reducerCases.SET_END_CALL})
          }
        });
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
        const localVideo = document.getElementById("local-audio");
        const videoElement = document.createElement(data.callType === "video" ? "video" : "audio");
        videoElement.id = "video-local-zego";
        videoElement.className = "h-28 w-32";
        videoElement.autoplay = true;
        videoElement.muted = false;
        videoElement.playsInline = true;

        localVideo.appendChild(videoElement);
        const td = document.getElementById("video-local-zego");
        td.srcObject = localStream;
        const streamID = '123' + Date.now();
        setPublishedStream(streamID);
        setLocalStream(localStream);
        zg.startPublishingStream(streamID, localStream);
      })
    }
    if(token){
      startCall();
    }
  }, [token])

  const endCall = () => {
    const id = data?.id;
    if(data?.callType === "video"){
      socket.current.emit("reject-video-call", {from: id});
      if(zgVar && publishedStream && localStream){
        zgVar.destroyStream(localStream);
        zgVar.stopPublishingStream(publishedStream);
        zgVar.logoutRoom(data.roomId.toString());
      }
    } else {
      socket.current.emit("reject-voice-call", {from: id});
    }
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
