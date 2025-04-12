import React from "react";
import dynamic from "next/dynamic";
const Container = dynamic(() => import("./Container"), { ssr: false });
import { useStateProvider } from "@/context/StateContext";


function VoiceCall() {

  const [{audioCall, socket, userInfo}, dispatch] = useStateProvider();

  React.useEffect(() => {
    if(audioCall.type === "outgoing"){
      socket.current.emit("outgoing-voice-call", {
        to: audioCall.id,
        from: {
          id: userInfo.id,
          profileImage: userInfo.profileImage,
          name: userInfo.name,
        },
        callType: audioCall.callType,
        roomId: audioCall.roomId,
      })
    }
  }, [audioCall]);

  return <Container data={audioCall} />;
}

export default VoiceCall;