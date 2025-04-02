import React from "react";
import Avatar from "../common/Avatar";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";
import { FaCamera, FaMicrophone, FaVideo } from "react-icons/fa";

function ChatListItem({data, isContactPage=false}) {
  const [{userInfo, currentChatUser}, dispatch] = useStateProvider();
  
  const handleChatClick = () => {

    if(!isContactPage){
      dispatch({
        type: reducerCases.SET_CURRENT_CHAT_USER,
        user: {...data}
      });
    } else {
      dispatch({
        type: reducerCases.SET_CURRENT_CHAT_USER,
        user: {...data}
      });
      dispatch({
        type: reducerCases.SET_ALL_CONTACTS,
        contacts: false
      });
    }
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
          {!isContactPage && (
            <div className="flex justify-end items-center">
              <span className={`${!data.totalUnreadMessages > 0 ? "text-secondary" : "text-icon-green"} text-sm`}>
                {calculateTime(data.createdAt)}
              </span>
            </div>
          )}
        </div>
        <div className="flex border-b border-conversation-border pb-2 pt-1">
          <div className="flex justify-between w-full items-center">
            <span className="text-secondary text-sm opacity-70 line-clamp-1">
              {isContactPage ? data?.about || "\u00a0" : 
              <div className="flex items-center gap-1 max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[200px] xl:max-w-[300px]">
                {data.senderId === userInfo.id && <MessageStatus status={data.messageStatus} />}
                {data.type === "text" && <span className="truncate">{data.message}</span>}
                {data.type === "image" && <span className="truncate flex items-center gap-2"><FaCamera /> Image</span>}
                {data.type === "audio" && <span className="truncate flex items-center gap-2"><FaMicrophone /> Audio</span>}
                {data.type === "video" && <span className="truncate flex items-center gap-2"><FaVideo /> Video</span>}
              </div>}       
            </span>
            {
              data.totalUnreadMessages > 0 && 
              <span>
                {data.totalUnreadMessages > 0 && <span className="bg-gray-600 px-[5px] rounded-full text-sm">{data.totalUnreadMessages}</span>}
              </span>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatListItem;