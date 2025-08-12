"use client";

import { useState } from "react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "motion/react";
import { FcGoogle } from "react-icons/fc";
import { montserrat, roboto } from "@/app/lib/fonts";
import { signInAction } from "@/app/lib/actions";

export default function Home() {
  const session = useSession();
  if (session.status == "authenticated") redirect("/tree");

  const [page, setPage] = useState(0);

  return (
    <div className="flex lg:flex-row flex-col overflow-x-hidden">
      <HalfContainer>
        <div className="flex flex-col lg:items-start items-center gap-10 lg:text-left text-center">
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
      </HalfContainer>
      <HalfContainer>
        <AnimatePresence>
          {page > 0 && <motion.div
            initial={{ left: "75%" }}
            animate={{ left: "0%" }}
            exit={{ left: "75%", transition: { type: "tween", duration: 0.7, ease: "backIn" } }}
            transition={{ type: "tween", duration: 0.7, ease: "backOut" }}
            className="lg:w-1/2 w-3/4 aspect-square p-4 relative bg-neutral-500 rounded-3xl"
          >
          </motion.div>}
        </AnimatePresence>
      </HalfContainer>
    </div>
  )
}

function HalfContainer({ children }) {
  return <div className="lg:w-[50vw] w-screen h-screen flex justify-center items-center">{children}</div>
}