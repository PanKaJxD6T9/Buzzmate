import Image from "next/image";
import React from "react";
import { useState } from "react";
import { FaCamera } from "react-icons/fa";

function Avatar({ type, image, setImage }) {

  const [hover, setHover] = useState(false)
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false)

  return (
    <>
      <div className="flex items-center justify-center">
        {type === "sm" && (
          <div className="relative h-10 w-10">
            <Image
              src={image}
              alt="avatar"
              className="rounded-full"
              fill
            />
          </div>
        )}
        {type === "lg" && (
          <div className="relative h-14 w-14">
            <Image
              src={image}
              alt="avatar"
              className="rounded-full"
              fill
            />
          </div>
        )}
        {type === "xl" && (
          <div className="relative cursor-pointer z-0 " onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <div className={`bg-photopicker-overlay-background rounded-full text-white h-60 w-60 absolute top-0 left-0 flex justify-center items-center flex-col text-center gap-2 z-10 ${hover ? "visible" : "hidden"}`}>
              <FaCamera className="text-2xl" id="context-opener"/>
              <span>Change Profile Photo</span>
            </div>
            <div className="h-60 w-60">
              <Image
                src={image}
                alt="avatar"
                className="rounded-full"
                fill
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Avatar;
