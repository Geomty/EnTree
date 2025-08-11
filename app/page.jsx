"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "motion/react";
import { FcGoogle } from "react-icons/fc";
import { montserrat, roboto } from "@/app/lib/fonts";
import { signInAction } from "@/app/lib/actions";

export default function Home() {
  const session = useSession();
  if (session.status == "authenticated") redirect("/tree");

  return (
    <div className="absolute top-1/2 lg:left-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col lg:items-start items-center gap-10">
      <h1 className={"text-black lg:text-8xl text-7xl font-black " + montserrat.className}>EnTree</h1>
      <p className="text-neutral-700 lg:text-2xl text-xl lg:text-left text-center">Your entry into AI-guided learning.<br></br>Generate a visual learning plan about any topic.</p>
      <form action={signInAction}>
        <motion.button
          initial={{ backgroundColor: "#ffffff" }}
          whileHover={{ backgroundColor: "#e5e5e5", boxShadow: "0px 1px 2px 0px #737373" }} // neutral-200, neutral-500
          transition={{ type: "tween", duration: 0.2, ease: "easeInOut" }}
          type="submit"
          className="px-3 py-2 flex items-center gap-3 bg-white border border-neutral-500 rounded-full hover:cursor-pointer !transition-none"
        >
          <FcGoogle className="size-6" />
          <p className={"text-neutral-700 text-md font-medium " + roboto.className}>Sign in with Google</p>
        </motion.button>
      </form>
    </div>
  )
}