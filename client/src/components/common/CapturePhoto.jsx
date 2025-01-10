import React, { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";

function CapturePhoto({ setImage, hideCamera }) {

  const videoRef = useRef(null);

  useEffect(() => {
    let stream;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.log(error);
      }
    }
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [])

  const captureFrame = () => {
    const canvas = document.createElement("canvas");
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0, 300, 150);
    setImage(canvas.toDataURL("image/jpeg"));
    hideCamera(false);
  }

  return (
    <div className="absolute h-max w-max top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-gray-900 gap-3 rounded-lg pt-2 flex flex-col items-center justify-center">
      <div className="flex flex-col gap-4 w-full">
        <div className="pt-2 pr-2 flex items-end justify-end" onClick={() => hideCamera(false)}>
          <IoClose className="text-white h-10 w-10 cursor-pointer"/>
        </div>
        <div className="flex justify-center">
          <video id="video" ref={videoRef} autoPlay muted width="400"/>
        </div>
        <button className="m-auto h-16 w-16 bg-white rounded-full cursor-pointer border-8 border-teal-light p-2 mb-4" onClick={captureFrame}></button>
      </div>
    </div>
  );
}

export default CapturePhoto;
