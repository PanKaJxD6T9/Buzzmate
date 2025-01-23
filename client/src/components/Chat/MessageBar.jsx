import React from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";

function MessageBar() {
  return (
    <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative">
      <>
        <div className="flex gap-6">
          <BsEmojiSmile className="text-white cursor-pointer text-xl" title="Emoji"/>
          <ImAttachment className="text-white cursor-pointer text-xl" title="Attach File or Document"/>
        </div>
        <div className="w-full rounded-lg h-10 flex items-center">
          <input
            type="text"
            placeholder="Type a message"
            className="bg-input-background text-start focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-full"
            // onChange={(e) => console.log(e.target.value)}
          />
        </div>
        <div className="flex w-10 items-center justify-center">
          <button>
            <MdSend className="text-white cursor-pointer text-xl" title="Send"/>
            {/* <FaMicrophone className="text-white cursor-pointer text-xl" title="Record Audio"/> */}
          </button>
        </div>
        
      </>
    </div>
  );
}

export default MessageBar;
