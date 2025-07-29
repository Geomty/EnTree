import { useTheme } from "next-themes";
import { motion } from "motion/react";

export default function ThemeToggle({ formStyle }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div onClick={() => {
      if (resolvedTheme == "light") setTheme("dark");
      else if (resolvedTheme == "dark") setTheme("light");
    }} className={"w-18 h-10 p-1 flex items-center !rounded-full hover:cursor-pointer " + formStyle + (resolvedTheme == "light" ? " justify-start" : " justify-end")}>
      <motion.div layout transition={{ type: "tween", duration: 0.2, ease: "easeInOut" }} className="size-7 bg-neutral-200 border border-black dark:bg-neutral-700 dark:border-neutral-500 rounded-full"></motion.div>
    </div>
  )
}