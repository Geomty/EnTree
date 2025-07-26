"use client";

import { useRef, useActionState } from "react";
import Flow from "@/app/ui/flow";
import ThemeToggle from "@/app/ui/theme-toggle";
import { getTree } from "@/app/lib/actions";

const formStyle = "bg-neutral-100 border-2 border-black dark:bg-neutral-800 dark:border-neutral-500 rounded-lg";

export default function Home() {
  const inputRef = useRef(null);
  const [state, formAction, isPending] = useActionState(getTree, null);

  return (
    <div className="text-black dark:text-neutral-200">
      <div className="absolute top-5 left-5 z-10 flex justify-start items-center gap-20 select-none">
        <ThemeToggle formStyle={formStyle} />
        <form action={formAction} className={"flex justify-start items-center gap-4" + (isPending || state ? " opacity-50" : "")}>
          <input required disabled={isPending || state} ref={inputRef} name="query" type="text" placeholder="Enter anything" title="Enter anything" className={"h-9 pl-2 " + formStyle} />
          <button disabled={isPending || state} type="submit" title="Submit" className={"px-3 py-1 " + formStyle + (isPending || state ? "" : " hover:cursor-pointer")}>Submit</button>
        </form>
      </div>
      {state && <Flow initial={state} formStyle={formStyle} />}
    </div>
  )
}
