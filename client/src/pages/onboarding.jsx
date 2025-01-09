import Image from "next/image";
import React from "react";

function onboarding() {
  return (
    <div className="bg-panel-header-background h-screen w-screen text-white flex flex-col items-center justify-center ">
      <div className="flex items-center justify-center gap-2">
        <Image src="/logo.svg" alt="logo" width={50} height={50} />
        <span className="text-3xl font-semibold">BuzzMate</span>
      </div>
      <h2 className="text-2xl font-semibold">Create your account</h2>
      <div className="flex gap-6 mt-6">
        <div className="flex flex-col items-center justify-center mt-5 gap-6">
          
        </div>
      </div>
    </div>
  );
}

export default onboarding;
