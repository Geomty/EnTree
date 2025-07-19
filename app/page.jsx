"use client";

import { useRef, useState } from "react";
import Flow from "@/app/ui/flow";
import ThemeToggle from "@/app/ui/theme-toggle";

const formStyle = "bg-neutral-100 border-2 border-black dark:bg-neutral-800 dark:border-neutral-500 rounded-lg";

export default function Home() {
  const [initial, setInitial] = useState(null);
  const inputRef = useRef(null);

  return (
    <div className="text-black dark:text-neutral-200">
      <div className="absolute top-5 left-5 z-10 flex justify-start items-center gap-20 select-none">
        <ThemeToggle />
        <form onSubmit={e => {
          e.preventDefault();
          setInitial(inputRef.current.value);
          inputRef.current.value = "";
        }} className="flex justify-start items-center gap-4">
          <input required disabled={initial} ref={inputRef} type="text" placeholder="Enter anything" title="Enter anything" className={"h-9 pl-2 " + formStyle + (initial ? " opacity-50" : "")} />
          <button disabled={initial} type="submit" title="Submit" className={"px-3 py-1 " + formStyle + (initial ? " opacity-50" : " hover:cursor-pointer")}>Submit</button>
        </form>
      </div>
      {initial && <Flow initial={initial} formStyle={formStyle} />}
    </div>
  )
}
