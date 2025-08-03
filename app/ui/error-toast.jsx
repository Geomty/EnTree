import { motion } from "motion/react";
import { HiExclamationTriangle } from "react-icons/hi2";

export default function Error() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
      className="absolute left-1/2 -translate-x-1/2 bottom-8 z-10 px-4 py-3 flex justify-center items-center gap-3 bg-red-500 rounded-full"
    >
      <HiExclamationTriangle className="size-8 fill-neutral-200" />
      <p className="!text-neutral-200 text-xl">An error occurred, please try again.</p>
    </motion.div>
  )
}