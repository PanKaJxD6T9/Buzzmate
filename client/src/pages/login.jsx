import Image from "next/image";
import React, { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { GoogleAuthProvider } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import { useRouter } from "next/router";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";

function login() {

  const router = useRouter();
  const [{userInfo, newUser}, dispatch] = useStateProvider();

  useEffect(() => {
    if (userInfo?.id && !newUser) {
      router.push("/");
    }
  }, [userInfo, newUser]);

  const handleLogin = async() => {
    const provider = new GoogleAuthProvider();
    try {
      const { user: {displayName: name, email, photoURL: profileImage} } = await signInWithPopup(firebaseAuth, provider);
      if(email){
        const {data} = await axios.post(CHECK_USER_ROUTE, {email});
        if(!data.success){
          dispatch({
            type: reducerCases.SET_NEW_USER,
            newUser: true
          })
          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {email, name, profileImage},
            status: ""
          });
          router.push("/onboarding");
        } else {
          const { id, name, email, image, about } = data.data;
          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {id, email, name, profileImage: image, about },
            status: ""
          });
          router.push("/");
        }
      }
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('Sign-in popup was closed before finishing the sign-in process');
        // You can add UI feedback here if needed
      } else {
        console.error('Authentication error:', error);
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-br from-purple-600 via-blue-500 to-purple-800 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative backdrop-blur-md bg-white/10 w-full max-w-md p-8 rounded-2xl shadow-2xl border border-white/20"
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
            <h1 className="text-2xl font-bold text-white">Welcome Back!</h1>
            <p className="text-white/80 text-sm">Connect and chat with your friends instantly</p>
          </div>

          {/* Login Button */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 bg-white/90 hover:bg-white text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            onClick={handleLogin}
          >
            <FcGoogle className="text-2xl" />
            <span>Continue with Google</span>
          </motion.button>

          {/* Additional Info */}
          <p className="text-white/60 text-sm text-center mt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute -z-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 top-0 -left-4"></div>
        <div className="absolute -z-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 bottom-0 -right-4"></div>
      </motion.div>
    </div>
  );
}

export default login;
