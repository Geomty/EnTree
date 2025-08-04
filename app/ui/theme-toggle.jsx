import { useTheme } from "next-themes";
import { motion } from "motion/react";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi2";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div suppressHydrationWarning onClick={() => {
      if (resolvedTheme == "light") setTheme("dark");
      else if (resolvedTheme == "dark") setTheme("light");
    }} className="w-20 h-12 p-1 flex items-center hover:cursor-pointer bg-neutral-100 dark:bg-neutral-800 rounded-full">
      <motion.div
        initial={{ marginLeft: resolvedTheme == "light" ? 0 : "2.5rem" }}
        animate={{ marginLeft: resolvedTheme == "light" ? 0 : "2.5rem" }}
        transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
        className="size-7"
      >
        <ThemeIcon MyIcon={HiOutlineSun} bool={resolvedTheme == "light"} />
        <ThemeIcon MyIcon={HiOutlineMoon} bool={resolvedTheme != "light"} />
      </motion.div>
    </div>
  )
}

function ThemeIcon({ MyIcon, bool }) {
  return (
    <motion.div animate={{ opacity: bool ? 1 : 0 }} transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }} className="absolute size-7" >
      <MyIcon className="size-full transform-[scaleX(-1)] stroke-banana-900 dark:stroke-banana-500" />
    </motion.div>
  )
}