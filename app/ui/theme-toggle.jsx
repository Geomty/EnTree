"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [])

  if (!mounted) {
    return null;
  }

  return <button
    type="button"
    onClick={() => {
      if (resolvedTheme == "light") {
        setTheme("dark");
      } else if (resolvedTheme == "dark") {
        setTheme("light");
      }
    }}
    className="absolute top-5 left-5 z-10 px-3 py-1 bg-blue-200 text-black border border-black rounded-md hover:cursor-pointer"
  >Theme</button>
}