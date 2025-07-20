import { useTheme } from "next-themes";
import { montserrat } from "@/app/lib/fonts";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return <button
    type="button"
    title="Theme"
    onClick={() => {
      if (resolvedTheme == "light") {
        setTheme("dark");
      } else if (resolvedTheme == "dark") {
        setTheme("light");
      }
    }}
    className={"px-3 py-1 bg-neutral-100 border-2 border-black dark:bg-neutral-800 dark:border-neutral-500 rounded-lg hover:cursor-pointer font-black " + montserrat.className}
  >Theme</button>
}