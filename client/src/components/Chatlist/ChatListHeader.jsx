import React from "react";
import Avatar from "../common/Avatar";
import { useStateProvider } from "@/context/StateContext";
import {BsFillChatLeftTextFill, BsThreeDotsVertical} from "react-icons/bs";
import { reducerCases } from "@/context/constants";

function ChatListHeader() {

  const [{ userInfo }, dispatch] = useStateProvider();

  const handleAllContacts = () => {
    dispatch({
      type: reducerCases.SET_ALL_CONTACTS,
      // contacts: true
    })
  }

  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center">
      <div className="cursor-pointer flex items-center gap-6">
        <Avatar type="sm" image={userInfo?.profileImage || "/user.png"} />
        <div className="flex flex-col">
          <span className="text-primary-strong text-sm">{userInfo?.name}</span>
          <span className="text-primary-strong text-xs">{userInfo?.email}</span>
        </div>
      </div>
      <div className="flex gap-6">
        <BsFillChatLeftTextFill className="text-white cursor-pointer text-xl" title="New Chat" onClick={handleAllContacts}/>
        <>
          <BsThreeDotsVertical className="text-white cursor-pointer text-xl" title="More"/>
        </>
      </div>
    </div>
  );
}

export default ChatListHeader;
