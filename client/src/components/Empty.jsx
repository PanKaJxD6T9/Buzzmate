import React from "react";
import { motion } from "framer-motion";
import { BsChatDots, BsArrowRight } from "react-icons/bs";

function Empty() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gray-900 border-l border-white">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ 
          scale: 1,
          opacity: 1,
          transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
          }
        }}
        className="text-center p-8 relative"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-800/50 to-transparent rounded-3xl" />
        
        {/* Content container */}
        <div className="relative backdrop-blur-sm bg-gray-800/30 rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
          <motion.div
            className="mb-8 relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl" />
            <div className="relative bg-gradient-to-br from-blue-500 to-purple-500 p-4 rounded-full inline-block">
              <BsChatDots className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Start a Conversation
            </h2>
            <p className="text-gray-400 text-base max-w-[320px]">
              Begin your journey by selecting a chat or starting a new conversation
            </p>
            
            {/* <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white font-medium inline-flex items-center gap-2 group"
            >
              New Chat
              <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button> */}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default Empty;
