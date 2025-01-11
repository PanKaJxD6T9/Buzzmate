import Avatar from "@/components/common/Avatar";
import Input from "@/components/common/Input";
import { useStateProvider } from "@/context/StateContext";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { ONBOARDING_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import { reducerCases } from "@/context/constants";

function Onboarding() {
  const [{ userInfo, newUser }, dispatch] = useStateProvider();
  const [name, setName] = useState(userInfo?.name || "");
  const [about, setAbout] = useState("");
  const [image, setImage] = useState("/user.png");
  const router = useRouter();

  useEffect(() => {
    if (!newUser && !userInfo) {
      router.push("/login");
    } else if (!newUser && userInfo?.email) {
      router.push("/");
    }
  }, [newUser, userInfo, router]);

  const validateDetails = () => {
    if (name.length < 3) return false;
    return true;
  };

  const handleSubmit = async () => {
    if (validateDetails()) {
      const email = userInfo?.email;
      try {
        const { data } = await axios.post(ONBOARDING_ROUTE, {
          email,
          name,
          about,
          image,
        });
        if (data.success) {
          dispatch({
            type: reducerCases.SET_NEW_USER,
            newUser: false
          });
          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {
              id: data.id,
              email,
              name,
              profileImage: image,
              about,
            },
            status: "",
          });
          router.push("/");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-br from-purple-600 via-blue-500 to-purple-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative backdrop-blur-md bg-white/10 w-full max-w-2xl p-8 rounded-2xl shadow-2xl border border-white/20"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-6"
        >
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src="/logo.svg"
                  alt="logo"
                  width={60}
                  height={60}
                  className="p-2"
                />
              </motion.div>
            </div>
            <span className="text-3xl text-white font-bold tracking-wider">BuzzMate</span>
          </div>

          {/* Welcome Text */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-white">Complete Your Profile</h1>
            <p className="text-white/80 text-sm">Let's get to know you better</p>
          </div>

          {/* Profile Form */}
          <div className="flex flex-col md:flex-row gap-8 w-full items-center justify-center mt-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col gap-6"
            >
              <Input
                name="Profile Name"
                state={name}
                setState={setName}
                label={true}
              />
              <Input
                name="Description"
                state={about}
                setState={setAbout}
                label={true}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Avatar type="xl" image={image} setImage={setImage} />
            </motion.div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className="w-full max-w-md mt-6 bg-white/90 hover:bg-white text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Complete Setup
          </motion.button>

          {/* Additional Info */}
          <p className="text-white/60 text-sm text-center mt-2">
            You can always change these details later
          </p>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute -z-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 top-0 -left-4"></div>
        <div className="absolute -z-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 bottom-0 -right-4"></div>
      </motion.div>
    </div>
  );
}

export default Onboarding;
