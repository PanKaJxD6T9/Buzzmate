import React from "react";
import Avatar from "../common/Avatar";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";

function ChatListItem({data, isContactsPage=false}) {
  const [{userInfo, currentChatUser}, dispatch] = useStateProvider();
  
  const handleChatClick = () => {
    dispatch({
      type: reducerCases.SET_CURRENT_CHAT_USER,
      user: {...data}
    });
    dispatch({
      type: reducerCases.SET_ALL_CONTACTS,
      contacts: false
    });
  };

  const isActive = currentChatUser?.id === data?.id;

  return (
    <div 
      className={`flex cursor-pointer items-center p-2 mx-2 rounded-xl
        hover:bg-background-default-hover transition-all duration-200 ease-in-out
        ${isActive ? 'bg-background-default-hover shadow-lg' : ''}`} 
      onClick={handleChatClick}
    >
      <div className="min-w-fit px-3 py-2 relative">
        <div className="hover:scale-105 transition-transform duration-200">
          <Avatar type="lg" image={data?.profileImage || "/user.png"}/>
        </div>
      </div>
      <div className="min-h-full flex flex-col justify-center py-2 px-2 w-full">
        <div className="flex justify-between items-center">
          <span className="text-white text-[15px] font-medium tracking-wide">{data?.name}</span>
        </div>
        <div className="flex border-b border-conversation-border pb-2 pt-1">
          <div className="flex justify-between w-full items-center">
            <span className="text-secondary text-sm opacity-70 line-clamp-1">
              {data?.about || "\u00a0"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatListItem;
