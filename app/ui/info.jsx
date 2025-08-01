"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { HiOutlineTrash } from "react-icons/hi2";
import ThemeToggle from "@/app/ui/theme-toggle";
import { createTree } from "@/app/lib/actions";

export default function Info({ titles, formStyle }) {
  const [menu, setMenu] = useState(false);
  let menuTimeout = useRef(false);

  const [createTreeResult, formAction, isPending] = useActionState(createTree, null);
  useEffect(() => {
    if (createTreeResult) {
      if (createTreeResult.error) {
        alert(`A ${createTreeResult.error.name} has occurred. Please try again.`);
      } else {
        redirect(createTreeResult.response);
      }
    }
  }, [createTreeResult]);

  return (
    <>
      <div onClick={() => {
        if (!menuTimeout.current) {
          menuTimeout.current = setTimeout(() => {
            menuTimeout.current = false;
          }, 300);
          setMenu(!menu);
        }
      }} className="absolute top-9 right-9 size-12 z-20 bg-red-500 rounded-full hover:cursor-pointer"></div>
      <AnimatePresence>
        {menu && <motion.div
          initial={{ transform: "scale(0)", opacity: 0 }}
          animate={{ transform: "scale(1)", opacity: 1 }}
          exit={{ transform: "scale(0)", opacity: 0 }}
          transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
          style={{ transformOrigin: "18.5rem 2.5rem" }}
          className="absolute top-5 right-5 w-84 z-10 p-4 flex flex-col items-center gap-8 bg-neutral-300 border-2 border-black dark:bg-neutral-700 dark:border-neutral-500 rounded-2xl select-none"
        >
          <div className="w-full flex justify-start items-center"><ThemeToggle formStyle={formStyle} /></div>
          <div className="w-full max-h-48 overflow-auto flex flex-col gap-4">
            {titles.map(value => {
              return (
                <div key={value.treeId} className="flex justify-between items-center gap-4">
                  <Link href={value.treeId} className="text-lg hover:cursor-pointer">{value.title}</Link>
                  <HiOutlineTrash className="size-6 shrink-0 stroke-neutral-700 dark:stroke-neutral-400 hover:cursor-pointer" />
                </div>
              )
            })}
          </div>
          <form action={formAction} className="flex items-center gap-10">
            <input type="text" name="userId" value="1" readOnly className="hidden" />
            <input required disabled={isPending} name="query" type="text" placeholder="Enter anything" title="Enter anything" className={"h-9 pl-2 " + formStyle + (isPending ? " opacity-50 hover:cursor-default" : "")} />
            <button type="submit" title="Submit" className={"px-3 py-1 hover:cursor-pointer " + formStyle + (isPending ? " opacity-50 hover:!cursor-default" : "")}>Submit</button>
          </form>
        </motion.div>}
      </AnimatePresence>
    </>
  )
}