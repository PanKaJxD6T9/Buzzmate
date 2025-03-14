import React, { useState } from "react";
import Avatar from "../common/Avatar";
import {MdCall} from "react-icons/md";
import {IoVideocam} from "react-icons/io5";
import {BiSearch} from "react-icons/bi";
import {BsThreeDotsVertical} from "react-icons/bs";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";

function ChatHeader() {
  const [{currentChatUser}, dispatch] = useStateProvider();
  const [showTooltip, setShowTooltip] = useState(null);

  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center bg-gradient-to-r from-gray-900 to-gray-800 z-10 shadow-md transition-all duration-300 border-b border-gray-700">
      <div className="flex items-center justify-center gap-6">
        <div className="transition-transform hover:scale-105">
          <Avatar type="sm" image={currentChatUser?.profileImage || "/user.png"}/>
        </div>
        <div className="flex flex-col">
          <span className="text-white font-medium hover:text-gray-300 transition-colors cursor-pointer">
            {currentChatUser?.name}
          </span>
          <span className="text-gray-400 text-sm">
           Online/Offline
          </span>
        </div>
      </div>
      <div className="flex gap-6">
        <div
          key="Call"
          className="relative"
          onMouseEnter={() => setShowTooltip("Call")}
          onMouseLeave={() => setShowTooltip(null)}
        >
          <div className="p-2 rounded-full hover:bg-[#2a2a2a] transition-all cursor-pointer">
            <MdCall 
              className="text-gray-300 hover:text-white cursor-pointer text-xl transition-colors"
              style={{ color: showTooltip === "Call" ? "#00a884" : undefined }}
            />
          </div>
          {showTooltip === "Call" && (
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
              Call
            </div>
          )}
        </div>
      
        <div
          key="Video Call"
          className="relative"
          onMouseEnter={() => setShowTooltip("Video Call")}
          onMouseLeave={() => setShowTooltip(null)}
        >
          <div className="p-2 rounded-full hover:bg-[#2a2a2a] transition-all cursor-pointer">
            <IoVideocam 
              className="text-gray-300 hover:text-white cursor-pointer text-xl transition-colors"
              style={{ color: showTooltip === "Video Call" ? "#00a884" : undefined }}
            />
          </div>
          {showTooltip === "Video Call" && (
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
              Video Call
            </div>
          )}
        </div>
      
        <div
          key="Search"
          className="relative"
          onMouseEnter={() => setShowTooltip("Search")}
          onMouseLeave={() => setShowTooltip(null)}
          onClick={() => dispatch({type: reducerCases.SET_SEARCH_MESSAGE})}
        >
          <div className="p-2 rounded-full hover:bg-[#2a2a2a] transition-all cursor-pointer">
            <BiSearch 
              className="text-gray-300 hover:text-white cursor-pointer text-xl transition-colors"
              style={{ color: showTooltip === "Search" ? "#00a884" : undefined }}
            />
          </div>
          {showTooltip === "Search" && (
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
              Search
            </div>
          )}
        </div>
      
        <div
          key="More"
          className="relative"
          onMouseEnter={() => setShowTooltip("More")}
          onMouseLeave={() => setShowTooltip(null)}
        >
          <div className="p-2 rounded-full hover:bg-[#2a2a2a] transition-all cursor-pointer">
            <BsThreeDotsVertical 
              className="text-gray-300 hover:text-white cursor-pointer text-xl transition-colors"
              style={{ color: showTooltip === "More" ? "#00a884" : undefined }}
            />
          </div>
          {showTooltip === "More" && (
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
              More
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
