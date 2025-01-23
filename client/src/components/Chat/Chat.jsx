import React from "react";
import ChatHeader from "./ChatHeader";
import ChatContainer from "./ChatContainer";
import MessageBar from "./MessageBar";

function Chat() {
  return (
    <div className="border-l border-white bg-gray-900 w-full flex flex-col h-[100vh] z-10">
      <ChatHeader />
      <ChatContainer />
      <MessageBar />
    </div>
  );
}

export default Chat;
