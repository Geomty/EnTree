"use client";

import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import { redirect } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { HiOutlineTrash, HiPlus } from "react-icons/hi2";
import ThemeToggle from "@/app/ui/theme-toggle";
import ErrorToast from "@/app/ui/error-toast";
import { createTree, deleteTree } from "@/app/lib/actions";

export default function Menu({ titles = [], slug, opened = false }) {
  const [titlesArr, setTitlesArr] = useState(titles);
  const [menu, setMenu] = useState(opened);
  let menuTimeout = useRef(false);

  const [bColor, setbColor] = useState(false);
  useEffect(() => {
    let bColorTimeout = setTimeout(() => {
      if (opened) {
        setbColor(!bColor);
      }
    }, 1000);
    return () => clearTimeout(bColorTimeout);
  }, [bColor]);
  const [inputActive, setInputActive] = useState(false);

  const [error, setError] = useState(false);
  const showError = useCallback(err => {
    setError(err);
    setTimeout(() => setError(false), 5000);
  }, []);

  const [createTreeResult, createTreeAction, isPending] = useActionState(createTree, null);
  useEffect(() => {
    if (createTreeResult) {
      if (createTreeResult.error) {
        showError(createTreeResult.error);
      } else {
        setMenu(false);
        setTimeout(() => redirect("/tree/" + createTreeResult.response), 100);
      }
    }
  }, [createTreeResult]);

  const [deleteTreeResult, deleteTreeAction, isPending2] = useActionState(deleteTree, null);
  useEffect(() => {
    if (deleteTreeResult) {
      if (deleteTreeResult.error) {
        showError(deleteTreeResult.error);
      } else if (deleteTreeResult.response == slug) {
        setMenu(false);
        setTimeout(() => {
          if (titlesArr.length == 1) redirect("/tree");
          const i = titlesArr.findIndex(value => slug == value.treeId);
          if (i) redirect(titlesArr[i-1].treeId);
          else redirect(titlesArr[i+1].treeId);
        }, 100);
      } else {
        setTitlesArr(titlesArr.filter(value => deleteTreeResult.response != value.treeId));
      }
    }
  }, [deleteTreeResult]);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 1.05 }}
        onClick={opened ? () => {} : () => {
          if (!menuTimeout.current) {
            menuTimeout.current = setTimeout(() => {
              menuTimeout.current = false;
            }, 300);
            setMenu(!menu);
          }
        }}
        className="absolute top-9 right-9 size-12 z-20 bg-red-500 rounded-full hover:cursor-pointer"
      ></motion.button>
      <AnimatePresence>
        {menu && <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "tween", duration: 0.4, ease: "backOut" }}
          style={{ transformOrigin: "18.5rem 2.5rem" }}
          className="absolute top-5 right-5 w-84 z-10 p-4 flex flex-col items-center gap-12 bg-slate-300 dark:bg-slate-700 rounded-2xl select-none"
        >
          <div className="w-full flex justify-start items-center"><ThemeToggle /></div>
          <div className="p-1 w-full max-h-48 overflow-x-hidden overflow-y-auto flex flex-col gap-4">
            {titlesArr.length ?
              titlesArr.map(value => {
                return (
                  <div key={value.treeId} className="flex justify-between items-center gap-4">
                    <motion.button
                      initial={{ transform: "scale(1)" }}
                      whileHover={{ transform: "scale(1.1)" }}
                      whileTap={{ transform: "scale(1.05)" }}
                      transition={{ type: "tween", duration: 0.3, ease: "backOut" }}
                      onClick={() => {
                        setMenu(false);
                        setTimeout(() => redirect(value.treeId), 100);
                      }}
                      className={"animColor w-full origin-left text-lg text-left hover:cursor-pointer" + (value.treeId == slug ? " font-bold" : "")}>{value.title}</motion.button>
                    <form action={deleteTreeAction} style={{ all: "inherit" }}>
                      <input type="text" name="ids" value={"1_" + value.treeId} readOnly className="hidden" />
                      <motion.button
                        whileHover={{ scale: isPending2 ? 1 : 1.3 }}
                        whileTap={{ scale: isPending2 ? 1 : 1.1 }}
                        type="submit"
                        disabled={isPending2}
                        title="Delete" 
                        className={"size-6" + (isPending2 ? " opacity-50" : " hover:cursor-pointer")}
                      >
                        <HiOutlineTrash className="size-full stroke-banana-800 dark:stroke-banana-500" />
                      </motion.button>
                    </form>
                  </div>
                )
              })
            :
              <p className="animColor text-center text-lg">Create your first tree below!</p>
            }
          </div>
          <form action={createTreeAction} className="w-full flex items-center gap-4">
            <input type="text" name="userId" value="1" readOnly className="hidden" />
            <motion.input
              animate={{ borderColor: bColor ? "#00c951" : "#efb100" }} // green-500, yellow-500
              transition={{ type: "tween", duration: 1, ease: "easeInOut" }}
              required
              disabled={isPending}
              name="query"
              type="text"
              placeholder="Enter a topic"
              title="Enter a topic"
              className={"animColor w-full h-9 pl-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg" +
                (isPending ? " opacity-50 hover:cursor-default" : "") +
                ((opened && !inputActive) ? " border-2" : "")
              }
              onFocus={() => setInputActive(true)}
              onBlur={() => setInputActive(false)}
            />
            <motion.button
              whileHover={{ scale: isPending ? 1 : 1.3 }}
              whileTap={{ scale: isPending ? 1 : 1.1 }}
              type="submit"
              disabled={isPending}
              title="Create tree"
              className={"size-8 shrink-0" + (isPending ? " opacity-50" : " hover:cursor-pointer")}
            >
              <HiPlus className="size-full fill-banana-800 dark:fill-banana-500" />
            </motion.button>
          </form>
        </motion.div>}
      </AnimatePresence>
      <AnimatePresence>{error && <ErrorToast error={error} />}</AnimatePresence>
    </>
  )
}