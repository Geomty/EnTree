import { useTheme } from "next-themes";
import { motion } from "motion/react";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi2";

export default function ThemeToggle({ formStyle }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div suppressHydrationWarning onClick={() => {
      if (resolvedTheme == "light") setTheme("dark");
      else if (resolvedTheme == "dark") setTheme("light");
    }} className={"w-20 h-12 p-1 flex items-center !rounded-full hover:cursor-pointer " + formStyle + (resolvedTheme == "light" ? " justify-start" : " justify-end")}>
      <motion.div layout transition={{ type: "tween", duration: 0.2, ease: "easeInOut" }} className="size-7">
        <ThemeIcon MyIcon={HiOutlineSun} bool={resolvedTheme == "light"} />
        <ThemeIcon MyIcon={HiOutlineMoon} bool={resolvedTheme != "light"} />
      </motion.div>
    </div>
  )
}

function ThemeIcon({ MyIcon, bool }) {
  return (
    <motion.div suppressHydrationWarning animate={{ opacity: bool ? 1 : 0 }} transition={{ type: "tween", duration: 0.2, ease: "easeInOut" }} className="absolute size-7" >
      <MyIcon className="size-full transform-[scaleX(-1)] stroke-neutral-700 dark:stroke-neutral-400" />
    </motion.div>
  )
}