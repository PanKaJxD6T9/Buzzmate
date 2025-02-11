import { useStateProvider } from "@/context/StateContext";
import { HOST } from "@/utils/ApiRoutes";
import { calculateTime } from "@/utils/CalculateTime";
import Image from "next/image";
import React from "react";
import MessageStatus from "../common/MessageStatus";
import { IoIosArrowDown } from "react-icons/io";
import { useState } from "react";

function ImageMessage({message}) {

  const [{currentChatUser, userInfo}] = useStateProvider();

  const [dialogVisible, setDialogVisible] = useState(false);

    const handleOpenDialog = () => {
        setDialogVisible(!dialogVisible);
    };

    const handleOpenImage = () => {
        window.open(`${HOST}/${message.message}`, '_blank');
        setDialogVisible(!dialogVisible);
    };

    const handleDownloadImage = async () => {
        try {
            const response = await fetch(`${HOST}/${message.message}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${message.message}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setDialogVisible(!dialogVisible);
            // Clean up the URL object
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading image:', error);
        }
    };


  return (
    <div className={`p-1 rounded-lg ${message.senderId === currentChatUser?.id ? "bg-[#404D61]" : "bg-[#3B4754]"}`}>
      <div className="relative">
        <Image src={`${HOST}/${message.message}`} className="rounded-lg" alt="image" width={400} height={400} />
        <div className="absolute top-1 right-1 flex items-end gap-1">
        <IoIosArrowDown className="text-purple-500 cursor-pointer" size={24} onClick={handleOpenDialog} />
            {dialogVisible && (
                <div className="dialog absolute top-10 right-0 bg-white/80 border border-gray-300 py-2 px-2 shadow-md w-60 rounded-md backdrop-filter backdrop-blur-md transition-transform transform hover:scale-105">
                    <div className="flex flex-col gap-2 justify-center">
                      <p className="cursor-pointer p-2 rounded-md hover:bg-blue-300 transition-colors" onClick={handleOpenImage} aria-label="Open image in new tab">
                        <i className="fas fa-external-link-alt"></i> Open image in new tab
                      </p>
                      <p className="cursor-pointer p-2 rounded-md hover:bg-blue-300 transition-colors" onClick={handleDownloadImage} aria-label="Download Image">
                        <i className="fas fa-download"></i> Download Image
                      </p>
                    </div>
                </div>
            )}
        </div>
        <div className="absolute bottom-1 right-1 flex items-end gap-1">
          <span className="text-xs text-gray-400">
            {
              calculateTime(message.createdAt)
            }
          </span>
          <span className="text-bubble-meta">
            {
              message.senderId === userInfo?.id && <MessageStatus status={message.messageStatus} />
            }
          </span>
        </div>
      </div>
    </div>
  )
}

export default ImageMessage;
