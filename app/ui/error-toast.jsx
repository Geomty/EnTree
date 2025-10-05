import { motion } from "motion/react";
import { HiExclamationTriangle } from "react-icons/hi2";

export default function ErrorToast({ error, alwaysDark = false }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
      className={"lg:w-auto w-[80vw] absolute left-1/2 -translate-x-1/2 bottom-8 z-10 px-3 py-2 flex justify-center items-center gap-3 rounded-full " + (alwaysDark ? "bg-red-300" : "bg-red-800 dark:bg-red-300")}
    >
      <HiExclamationTriangle className={"size-6 shrink-0 " + (alwaysDark ? "fill-black" : "fill-neutral-200 dark:fill-black")} />
      <p className={"animColor text-lg text-center select-none " + (alwaysDark ? "!text-black" : "!text-neutral-200 dark:!text-black")}>{error.message}</p>
    </motion.div>
  )
}