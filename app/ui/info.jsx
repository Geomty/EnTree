"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { redirect } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { HiOutlineTrash, HiPlus } from "react-icons/hi2";
import ThemeToggle from "@/app/ui/theme-toggle";
import { createTree, deleteTree } from "@/app/lib/actions";

export default function Info({ titles, slug, formStyle }) {
  const [titlesArr, setTitlesArr] = useState(titles);
  const [menu, setMenu] = useState(false);
  let menuTimeout = useRef(false);

  const [createTreeResult, createTreeAction, isPending] = useActionState(createTree, null);
  useEffect(() => {
    if (createTreeResult) {
      if (createTreeResult.error) {
        alert(`A ${createTreeResult.error.name} has occurred. Please try again.`);
      } else {
        setMenu(false);
        setTimeout(() => redirect(createTreeResult.response), 100);
      }
    }
  }, [createTreeResult]);

  const [deleteTreeResult, deleteTreeAction, isPending2] = useActionState(deleteTree, null);
  useEffect(() => {
    if (deleteTreeResult) {
      if (deleteTreeResult.error) {
        alert(`A ${deleteTreeResult.error.name} has occurred. Please try again.`);
      } else if (deleteTreeResult.response == slug) {
        setMenu(false);
        setTimeout(() => redirect("/tree"), 100);
      } else {
        setTitlesArr(titlesArr.filter(value => deleteTreeResult.response != value.treeId));
      }
    }
  }, [deleteTreeResult]);

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
          className="absolute top-5 right-5 w-84 z-10 p-4 flex flex-col items-center gap-12 bg-neutral-300 border-2 border-black dark:bg-neutral-700 dark:border-neutral-500 rounded-2xl select-none"
        >
          <div className="w-full flex justify-start items-center"><ThemeToggle formStyle={formStyle} /></div>
          <div className="w-full max-h-48 overflow-auto flex flex-col gap-4">
            {titlesArr.map(value => {
              return (
                <div key={value.treeId} className="flex justify-between items-center gap-4">
                  <button onClick={() => {
                    setMenu(false);
                    setTimeout(() => redirect(value.treeId), 100);
                  }} className={"w-full text-lg text-left hover:cursor-pointer" + (value.treeId == slug ? " font-bold" : "")}>{value.title}</button>
                  <form action={deleteTreeAction}>
                    <input type="text" name="ids" value={"1_" + value.treeId} readOnly className="hidden" />
                    <button type="submit" disabled={isPending2} title="Delete" className={"size-6" + (isPending2 ? " opacity-50" : " hover:cursor-pointer")}><HiOutlineTrash className="size-full stroke-neutral-700 dark:stroke-neutral-400" /></button>
                  </form>
                </div>
              )
            })}
          </div>
          <form action={createTreeAction} className="w-full flex items-center gap-4">
            <input type="text" name="userId" value="1" readOnly className="hidden" />
            <input required disabled={isPending} name="query" type="text" placeholder="Enter a topic" title="Enter a topic" className={"w-full h-9 pl-2 " + formStyle + (isPending ? " opacity-50 hover:cursor-default" : "")} />
            <button type="submit" disabled={isPending} title="Create tree" className={"size-8 shrink-0" + (isPending ? " opacity-50" : " hover:cursor-pointer")}><HiPlus className="size-full fill-neutral-700 dark:fill-neutral-400" /></button>
          </form>
        </motion.div>}
      </AnimatePresence>
    </>
  )
}