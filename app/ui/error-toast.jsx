import { motion } from "motion/react";
import { HiExclamationTriangle } from "react-icons/hi2";

export default function ErrorToast({ error }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
      className="absolute left-1/2 -translate-x-1/2 bottom-8 z-10 px-3 py-2 flex justify-center items-center gap-3 bg-red-800 dark:bg-red-300 rounded-full"
    >
      <HiExclamationTriangle className="size-6 fill-neutral-200 dark:fill-black" />
      <p className="animColor text-lg !text-neutral-200 dark:!text-black select-none">{error.message}</p>
    </motion.div>
  )
}