import React from "react";
import dynamic from "next/dynamic";
import { useStateProvider } from "@/context/StateContext";
const Container = dynamic(() => import("./Container"), { ssr: false });

function VideoCall() {
  
  const [{videoCall, socket, userInfo}, dispatch] = useStateProvider();
  
  React.useEffect(() => {
      if(videoCall.type === "outgoing"){
        socket.current.emit("outgoing-video-call", {
          to: videoCall.id,
          from: {
            id: userInfo.id,
            profileImage: userInfo.profileImage,
            name: userInfo.name,
          },
          callType: videoCall.callType,
          roomId: videoCall.roomId,
        })
      }
    }, [videoCall]);


  return <Container data={videoCall} />;
}

export default VideoCall;
