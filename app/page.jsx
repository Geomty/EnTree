"use client";

import { useRef, useActionState } from "react";
import { HiOutlineTrash } from "react-icons/hi2";
import Flow from "@/app/ui/flow";
import ThemeToggle from "@/app/ui/theme-toggle";
import { getTree } from "@/app/lib/actions";

const formStyle = "bg-neutral-100 border-2 border-black dark:bg-neutral-800 dark:border-neutral-500 rounded-lg";

export default function Home() {
  const inputRef = useRef(null);
  const [state, formAction, isPending] = useActionState(getTree, null);

  return (
    <div className="text-black dark:text-neutral-200">
      <div className="absolute top-5 right-5 w-84 z-10 p-6 flex flex-col items-center gap-8 bg-neutral-300 border-2 border-black dark:bg-neutral-700 dark:border-neutral-500 rounded-2xl select-none">
        <ThemeToggle formStyle={formStyle} />
        <div className="w-full max-h-48 overflow-auto flex flex-col gap-4">
          {["hello", "world", "this is", "a test", "this is some longer text", "this is some very very very long text"].map(value => {
            return (
              <div key={value} className="flex justify-between items-center gap-4">
                <p className="text-lg hover:cursor-pointer">{value}</p>
                <HiOutlineTrash className="size-6 shrink-0 stroke-neutral-700 dark:stroke-neutral-400 hover:cursor-pointer" />
              </div>
            )
          })}
        </div>
        <form action={formAction} className={"flex items-center gap-4" + (isPending || state ? " opacity-50" : "")}>
          <input required disabled={isPending || state} ref={inputRef} name="query" type="text" placeholder="Enter anything" title="Enter anything" className={"h-9 pl-2 " + formStyle} />
          <button disabled={isPending || state} type="submit" title="Submit" className={"px-3 py-1 " + formStyle + (isPending || state ? "" : " hover:cursor-pointer")}>Submit</button>
        </form>
      </div>
      {state && <Flow initial={state} formStyle={formStyle} />}
    </div>
  )
}
