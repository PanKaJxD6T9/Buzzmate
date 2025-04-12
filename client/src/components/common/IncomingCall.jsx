import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import Image from "next/image";
import React from "react";

function IncomingCall() {
  const [{incomingAudioCall, socket}, dispatch] = useStateProvider();
  
    const acceptCall = () => {
      dispatch({
        type: reducerCases.SET_AUDIO_CALL,
        audioCall: {
          ...incomingAudioCall,
          type: "incoming",
        }
      });
  
      socket.current.emit("accept-incoming-call", {id: incomingAudioCall.id});
  
      dispatch({
        type: reducerCases.SET_INCOMING_AUDIO_CALL,
        incomingAudioCall: undefined
      });
  
    }
  
    const rejectCall = () => {
      socket.current.emit("reject-voice-call", {from: incomingAudioCall.id});
      dispatch({type: reducerCases.SET_END_CALL})
    }
    
    return <div className="h-24 w-80 fixed bottom-8 mb-0 right-6 z-50 rounded-sm flex gap-5 items-center justify-start p-4 bg-conversation-panel-background text-white drop-shadow-2xl border-icon-green border-2 py-14">
      <div>
        <Image src={incomingAudioCall?.profileImage || "/user.png"} width={70} height={70} alt="user" className="rounded-full"/>
      </div>
      <div>
        <div>{incomingAudioCall?.name}</div>
        <div className="text-sm">Incoming Audio Call</div>
        <div className="flex gap-2 mt-2">
          <button className="bg-red-500 p-1 px-3 text-sm rounded-full" onClick={rejectCall}>Reject</button>
          <button className="bg-green-500 p-1 px-3 text-sm rounded-full" onClick={acceptCall}>Accept</button>
        </div>
      </div>
    </div>;
}

export default IncomingCall;
