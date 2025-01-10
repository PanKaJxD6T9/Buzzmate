import Image from "next/image";
import React from "react";
import { useState } from "react";
import { FaCamera } from "react-icons/fa";
import ContextMenu from "./ContextMenu";
import PhotoPicker from "./PhotoPicker";

function Avatar({ type, image, setImage }) {

  const [hover, setHover] = useState(false)
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false)
  const [uploadPhoto, setuploadPhoto] = useState(false)
  const contextMenuOptions = [
    {name: "Take Photo", callback: () => {}},
    {name: "Choose from Library", callback: () => {}},
    {name: "Upload Photo", callback: () => {
      setuploadPhoto(true);
    }},
    {name: "Remove Photo", callback: () => {
      setImage("/user.png")
    }}
  ]

  const handleContextMenu = (e) => {
    e.preventDefault()
    setIsContextMenuVisible(true)
  }

  const photoPickerChangeHandler = () => {
    
  }

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
            <div className={`bg-photopicker-overlay-background rounded-full text-white h-60 w-60 absolute top-0 left-0 flex justify-center items-center flex-col text-center gap-2 z-10 ${hover ? "visible" : "hidden"}`} onClick={e=>handleContextMenu(e)} id="context-opener">
              <FaCamera className="text-2xl" id="context-opener" onClick={e=>handleContextMenu(e)}/>
              <span id="context-opener" onClick={e=>handleContextMenu(e)}>Change Profile Photo</span>
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
      {isContextMenuVisible && <ContextMenu options={contextMenuOptions} contextMenu={isContextMenuVisible} setContextMenu={setIsContextMenuVisible}/>}
      {uploadPhoto && <PhotoPicker onChange={photoPickerChangeHandler}/>}
    </>
  );
}

export default Avatar;
