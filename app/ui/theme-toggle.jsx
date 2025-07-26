import { useTheme } from "next-themes";
import { montserrat } from "@/app/lib/fonts";

export default function ThemeToggle({ formStyle }) {
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
    className={"px-3 py-1 rounded-lg hover:cursor-pointer select-none font-black " + montserrat.className + " " + formStyle}
  >Theme</button>
}