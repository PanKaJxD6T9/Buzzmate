import Image from "next/image";
import React from "react";
import { IoClose } from "react-icons/io5";

function PhotoLibrary({setImage, hideLibrary}) {

  const images = [
    "/avatars/1.png",
    "/avatars/2.png",
    "/avatars/3.png",
    "/avatars/4.png",
    "/avatars/5.png",
    "/avatars/6.png",
    "/avatars/7.png",
    "/avatars/8.png",
    "/avatars/9.png",
  ]

  return <div className="fixed top-0 left-0 max-h-[100vh] max-w-[100vw] h-full w-full flex justify-center items-center z-[100]">
    <div className="h-max w-max bg-gray-900 gap-6 rounded-lg p-4">
      <div className="pt-2 pr-2 flex items-end justify-end" onClick={() => hideLibrary(false)}>
        <IoClose className="text-white h-10 w-10 cursor-pointer"/>
      </div>
      <div className="grid grid-cols-3 items-center justify-center gap-16 py-5 px-10 w-full">
        {
          images.map((image, index) => {
            return (
              <div key={index} onClick={() => {setImage(image); hideLibrary(false)}}>
                <div className="flex items-center justify-center cursor-pointer">
                  <Image src={image} alt="avatar" width={150} height={150}/>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  </div>;
}

export default PhotoLibrary;
