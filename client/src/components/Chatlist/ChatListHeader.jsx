import React, { useState } from "react";
import Avatar from "../common/Avatar";
import { useStateProvider } from "@/context/StateContext";
import {BsFillChatLeftTextFill, BsThreeDotsVertical} from "react-icons/bs";
import { reducerCases } from "@/context/constants";

function ChatListHeader() {
  const [{ userInfo }, dispatch] = useStateProvider();
  const [showTooltip, setShowTooltip] = useState(null);

  const handleAllContacts = () => {
    dispatch({
      type: reducerCases.SET_ALL_CONTACTS,
    })
  }

  return (
    <div className="h-20 px-4 py-3 flex justify-between items-center border-t border-gray-700 bg-gradient-to-r from-gray-900 to-gray-800">
      <div className="cursor-pointer flex items-center gap-6">
        <div className="transition-transform hover:scale-105">
          <Avatar type="sm" image={userInfo?.profileImage || "/user.png"} />
        </div>
        <div className="flex flex-col">
          <span className="text-white font-medium hover:text-gray-300 transition-colors cursor-pointer">
            {userInfo?.name}
          </span>
          <span className="text-gray-400 text-sm hover:text-gray-300 transition-colors">
            {userInfo?.email}
          </span>
        </div>
      </div>
      <div className="flex gap-6">
        {[
          { Icon: BsFillChatLeftTextFill, title: "New Chat", onClick: handleAllContacts, color: "#00a884" },
          { Icon: BsThreeDotsVertical, title: "More", color: "#00a884" }
        ].map(({ Icon, title, onClick, color }) => (
          <div
            key={title}
            className="relative"
            onMouseEnter={() => setShowTooltip(title)}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <div className="p-2 rounded-full hover:bg-[#2a2a2a] transition-all cursor-pointer">
              <Icon 
                className="text-gray-300 hover:text-white cursor-pointer text-xl transition-colors"
                style={{ color: showTooltip === title ? color : undefined }}
                onClick={onClick}
              />
            </div>
            {showTooltip === title && (
              <div className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-50">
                {title}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatListHeader;
