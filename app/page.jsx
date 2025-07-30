"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HiOutlineTrash } from "react-icons/hi2";
import Flow from "@/app/ui/flow";
import ThemeToggle from "@/app/ui/theme-toggle";
import { getTrees, getTree, createTree } from "@/app/lib/actions";

const formStyle = "bg-neutral-100 border-2 border-black dark:bg-neutral-800 dark:border-neutral-500 rounded-lg";

export default function Home() {
  const [createTreeResult, createTreeAction] = useActionState(createTree, null);
  const [titles, setTitles] = useState(["hello", "world", "this is", "a test", "this is some longer text", "this is some very very very long text"]);
  const [initial, setInitial] = useState(null);
  const [menu, setMenu] = useState(false);
  let menuTimeout = useRef(false);

  useEffect(() => {
    let ignore = false;
    if (!ignore) {
      (async () => {
        const getTreesResult = await getTrees("1");
        if (getTreesResult.error) {
          alert(`A ${getTreesResult.error.name} has occurred. Please try again.`);
        } else {
          setTitles(getTreesResult.response);
        }
      })();
    }
    return () => ignore = true;
  }, []);

  useEffect(() => setInitial(createTreeResult), [createTreeResult]);

  return (
    <div className="text-black dark:text-neutral-200">
      <div onClick={() => {
        if (!menuTimeout.current) {
          menuTimeout.current = setTimeout(() => {
            menuTimeout.current = false;
          }, 300);
          setMenu(!menu);
        }
      }} className="absolute top-11 right-11 size-10 z-20 bg-red-500 rounded-full hover:cursor-pointer"></div>
      <AnimatePresence>
        {menu && <motion.div
          initial={{ transform: "scale(0)", opacity: 0 }}
          animate={{ transform: "scale(1)", opacity: 1 }}
          exit={{ transform: "scale(0)", opacity: 0 }}
          transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
          style={{ transformOrigin: "18.25rem 2.75rem" }}
          className="absolute top-5 right-5 w-84 z-10 p-6 flex flex-col items-center gap-8 bg-neutral-300 border-2 border-black dark:bg-neutral-700 dark:border-neutral-500 rounded-2xl select-none"
        >
          <div className="w-full flex justify-start items-center"><ThemeToggle formStyle={formStyle} /></div>
          <div className="w-full max-h-48 overflow-auto flex flex-col gap-4">
            {titles.map(value => {
              return (
                <div key={value} className="flex justify-between items-center gap-4">
                  <button onClick={async () => {
                    const getTreeResult = await getTree("1", value);
                    if (getTreeResult.error) {
                      alert(`A ${getTreeResult.error.name} has occurred. Please try again.`);
                    } else {
                      setInitial(getTreeResult.response);
                    }
                  }} className="text-lg hover:cursor-pointer">{value}</button>
                  <HiOutlineTrash className="size-6 shrink-0 stroke-neutral-700 dark:stroke-neutral-400 hover:cursor-pointer" />
                </div>
              )
            })}
          </div>
          <form action={createTreeAction} className="flex items-center gap-4">
            <input required name="query" type="text" placeholder="Enter anything" title="Enter anything" className={"h-9 pl-2 " + formStyle} />
            <button type="submit" title="Submit" className={"px-3 py-1 hover:cursor-pointer " + formStyle}>Submit</button>
          </form>
        </motion.div>}
      </AnimatePresence>
      {initial && <Flow initial={initial} formStyle={formStyle} />}
    </div>
  )
}
