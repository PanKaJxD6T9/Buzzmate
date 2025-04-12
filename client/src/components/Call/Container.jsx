import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import Image from "next/image";
import React , { useState } from "react";
import { MdOutlineCallEnd } from "react-icons/md";

function Container({data}) {

  const [{socket, userInfo}, dispatch] = useStateProvider();

  const [callAccepted, setcallAccepted] = useState(false);

  const endCall = () => {
    const id = data?.id;
    if(data?.callType === "video"){
      socket.current.emit("reject-video-call", {from: id});
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
    <div className="h-16 w-16 bg-red-600 flex items-center justify-center rounded-full" onClick={endCall}>
      <MdOutlineCallEnd className="text-3xl cursor-pointer"/>
    </div>
  </div>;
}

export default Container;
