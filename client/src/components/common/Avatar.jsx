
import Image from "next/image";
import React from "react";
import { useState, useEffect } from "react";
import { FaCamera } from "react-icons/fa";
import ContextMenu from "./ContextMenu";
import PhotoPicker from "./PhotoPicker";
import PhotoLibrary from "./PhotoLibrary";
import CapturePhoto from "./CapturePhoto";

function Avatar({ type, image, setImage }) {

  const [hover, setHover] = useState(false)
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false)
  const [uploadPhoto, setuploadPhoto] = useState(false)
  const [showLibrary, setShowLibrary] = useState(false)
  const [showCamera, setShowCamera] = useState(false)

  useEffect(()=>{
    if(uploadPhoto){
      const data = document.getElementById("photo-picker");
      data.click();
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setuploadPhoto(false);
        }, 1000);
      }
    }
  }, [uploadPhoto])

  const contextMenuOptions = [
    {name: "Take Photo", callback: () => {
      setShowCamera(true);
    }},
    {name: "Choose from Library", callback: () => {
      setShowLibrary(true);
    }},
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

  const photoPickerChangeHandler = async(e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    const data = document.createElement("img");
    reader.onload = (e) => {
      data.src = e.target.result;
      data.setAttribute("data-src", e.target.result);
    };
    reader.readAsDataURL(file);
    setTimeout(() => {
      console.log(data.src)
      setImage(data.src);
    }, 100);
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
      {showCamera && <CapturePhoto setImage={setImage} hideCamera={setShowCamera}/>}
      {showLibrary && <PhotoLibrary setImage={setImage} hideLibrary={setShowLibrary}/>}
      {uploadPhoto && <PhotoPicker onChange={photoPickerChangeHandler}/>}
    </>
  );
}

export default Avatar;
