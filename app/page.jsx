"use client";

import { useState } from "react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "motion/react";
import { FcGoogle } from "react-icons/fc";
import { BsCaretLeftFill, BsCaretRightFill } from "react-icons/bs";
import { montserrat, roboto } from "@/app/lib/fonts";
import { signInAction } from "@/app/lib/actions";

export default function Home() {
  const session = useSession();
  if (session.status == "authenticated") redirect("/tree");

  const [page, setPage] = useState(0);

  return (
    <div className="overflow-x-hidden">
      <div className="w-screen h-screen">
        <div className="absolute top-1/2 lg:left-1/4 left-1/2 -translate-1/2 flex flex-col lg:items-start items-center gap-10 lg:text-left text-center">
          <h1 className={"text-black lg:text-8xl text-7xl font-black " + montserrat.className}>EnTree</h1>
          <p className="text-neutral-700 lg:text-2xl text-xl">Your entry into AI-guided learning.<br></br>Generate a visual learning plan about any topic.</p>
          <form action={signInAction}>
            <motion.button
              initial={{ backgroundColor: "#ffffff" }}
              whileHover={{ backgroundColor: "#e5e5e5", boxShadow: "0px 1px 2px 0px #737373" }} // neutral-200, neutral-500
              transition={{ type: "tween", duration: 0.2, ease: "easeInOut" }}
              type="submit"
              className="px-3 py-2 flex items-center gap-3 bg-white border border-neutral-500 rounded-full select-none hover:cursor-pointer !transition-none"
            >
              <FcGoogle className="size-6" />
              <p className={"text-neutral-700 text-md font-medium " + roboto.className}>Sign in with Google</p>
            </motion.button>
          </form>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 1.05 }}
            transition={{ type: "tween", duration: 0.3, ease: "backOut" }}
            onClick={() => {
              if (page == 0) setPage(1);
              else setPage(0);
            }}
            className="text-neutral-600 lg:text-xl text-lg hover:cursor-pointer"
          >How it works &gt;</motion.button>
        </div>
      </div>
      <AnimatePresence>
        {page > 0 && <div className="w-screen lg:h-0 h-screen flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            className="lg:w-1/3 w-3/4 aspect-square p-4 flex flex-col gap-4 lg:absolute lg:top-1/2 lg:left-3/4 lg:-translate-1/2 bg-neutral-500 rounded-3xl"
          >
            <div className="size-full bg-neutral-700 rounded-3xl"></div>
            <div className="px-2 flex justify-end items-center gap-4">
              {[BsCaretLeftFill, BsCaretRightFill].map((Arrow, index) => {
                return (
                  <button
                    key={index}
                    onClick={() => setPage(page + (2 * index - 1))}
                    disabled={page == 4 * index + 1}
                    className={"p-1 bg-neutral-700 rounded-full" + (page == 4 * index + 1 ? " opacity-50" : " hover:cursor-pointer")}
                  >
                    <Arrow className="size-8 fill-neutral-500" />
                  </button>
                )
              })}
            </div>
          </motion.div>
        </div>}
      </AnimatePresence>
    </div>
  )
}