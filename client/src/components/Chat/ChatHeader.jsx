import React from "react";
import Avatar from "../common/Avatar";
import {MdCall} from "react-icons/md";
import {IoVideocam} from "react-icons/io5";
import {BiSearch} from "react-icons/bi";
import {BsThreeDotsVertical} from "react-icons/bs";

function ChatHeader() {
  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center bg-panel-header-background z-10">
      <div className="flex items-center justify-center gap-6">
        <Avatar type="sm" image="/user.png"/>
        <div className="flex flex-col">
          <span className="text-primary-strong">Demo</span>
          <span className="text-secondary text-sm">Online/Offline</span>
        </div>
      </div>
      <div className="flex gap-6">
        <MdCall className="text-white cursor-pointer text-xl" title="Call"/>
        <IoVideocam className="text-white cursor-pointer text-xl" title="Video Call"/>
        <BiSearch className="text-white cursor-pointer text-xl" title="Search"/>
        <BsThreeDotsVertical className="text-white cursor-pointer text-xl" title="More"/>
      </div>
    </div>
  );
}

export default ChatHeader;
