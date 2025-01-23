import React from "react";
import ChatListHeader from "./ChatListHeader";
import SearchBar from "./SearchBar";
import List from "./List";

function ChatList() {
  return (
    <div className="bg-gray-900 flex flex-col max-h-screen z-20">
      <>
        <SearchBar />
        <List />
        <ChatListHeader />
      </>
    </div>
  );
}

export default ChatList;
