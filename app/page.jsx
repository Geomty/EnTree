"use client";

import { useEffect, useRef, useState } from "react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "motion/react";
import { gsap } from "gsap";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { FcGoogle } from "react-icons/fc";
import { montserrat, roboto } from "@/app/lib/fonts";
import { signInAction } from "@/app/lib/actions";
import Aurora from "@/app/ui/react-bits/Aurora";
import TiltedCard from "@/app/ui/react-bits/TiltedCard";

gsap.registerPlugin(GSAPSplitText);

export default function Home() {
  const session = useSession();
  if (session.status == "authenticated") redirect("/tree");

  const [instr, setInstr] = useState(false);

  return (
    <>
      <div className="w-screen h-screen fixed -z-20 bg-neutral-950"></div>
      <div style={{ filter: "grayscale(10%) blur(100px)" }} className="w-screen h-screen fixed -z-10">
        <Aurora
          colorStops={["#00a63e", "#efb100", "#2b7fff"]} // green-500, yellow-500, blue-500
          speed={0.5}
          blend={0}
          amplitude={0.1}
        />
      </div>
      <div className="flex lg:flex-row flex-col overflow-x-hidden">
        <div className="lg:w-[50vw] w-screen h-screen flex justify-center items-center">
          <div className="lg:relative lg:left-20 flex flex-col lg:items-start items-center gap-10 lg:text-left text-center">
            <SplitText
              options={{
                stagger: 0.05,
                duration: 1,
                ease: "elastic.out(1.5,0.5)"
              }}
              className={"text-neutral-200 lg:text-8xl text-7xl font-black " + montserrat.className}
            >EnTree</SplitText>
            <div className="flex flex-col lg:items-start items-center gap-2">
              {["Your entry into AI-guided learning.", "Generate a visual learning plan about any topic in seconds."].map((value, index) => {
                return (
                  <SplitText
                    key={index}
                    options={{
                      stagger: 0.01,
                      duration: 1,
                      ease: "elastic.out(1,0.5)"
                    }}
                    className="text-neutral-300 lg:text-2xl text-xl lg:max-w-full max-w-[80vw]"
                  >{value}</SplitText>
                )
              })}
            </div>
            <form action={signInAction}>
              <motion.button
                initial={{ backgroundColor: "#262626", marginTop: "2rem", opacity: 0 }} // neutral-800
                animate={{ marginTop: "0rem", opacity: 1 }}
                whileHover={{ backgroundColor: "#404040", boxShadow: "0px 1px 2px 0px #737373" }} // neutral-700, neutral-500
                transition={{
                  backgroundColor: { type: "tween", duration: 0.2, ease: "easeInOut" },
                  boxShadow: { type: "tween", duration: 0.2, ease: "easeInOut" },
                  default: { type: "tween", duration: 1, ease: "backOut" }
                }}
                type="submit"
                className="px-3 py-2 flex items-center gap-3 border border-neutral-500 rounded-full select-none hover:cursor-pointer !transition-none"
              >
                <FcGoogle className="size-6" />
                <p className={"text-neutral-300 text-md font-medium " + roboto.className}>Sign in with Google</p>
              </motion.button>
            </form>
            <motion.button
              initial={{ marginTop: "1rem", opacity: 0 }}
              animate={{ marginTop: "0rem", opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 1.05 }}
              transition={{
                scale: { type: "tween", duration: 0.3, ease: "backOut" },
                default: { type: "tween", duration: 1, ease: "backOut" }
              }}
              title="How it works"
              onClick={() => {
                if (!instr) document.getElementById("instructions").scrollIntoView({ behavior: "smooth" });
                setInstr(!instr);
              }}
              className="text-neutral-300 lg:text-xl text-lg hover:cursor-pointer"
            >How it works &gt;</motion.button>
          </div>
        </div>
        <div id="instructions" className="lg:w-[50vw] w-screen h-screen flex flex-col justify-center items-center gap-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "tween", duration: 1, ease: "backOut" }}
            className="absolute"
          >
            {["1.png", "2.png", "3.png"].map((value, index, array) => <Container key={index} bool={instr} file={value} calc={index - (array.length / 2 - 0.5)} />)}
          </motion.div>
          {[
            "Enter a topic that you want to learn about but seems out of reach",
            "Generate prerequisite topics for your chosen topic with the help of AI",
            "Keep generating prerequisites until you reach topics that you already understand",
            "Work your way up and learn about progressively more advanced topics, marking them as complete along the way",
            "Once you understand your originally chosen topic, start again and learn something new!"
          ].map((value, index) => {
            return (
              <AnimatePresence key={index}>
                {instr && <motion.div
                  initial={{ left: "80%", opacity: 0 }}
                  animate={{ left: index % 2 ? "5%" : "-5%", opacity: 1 }}
                  exit={{ left: "80%", opacity: 0, transition: { type: "tween", duration: 0.8-0.05*index, ease: "backIn", delay: 0.05*index } }}
                  transition={{ type: "tween", duration: 0.6, ease: "backOut", delay: 0.05*index }}
                  style={{ backgroundColor: "rgba(115, 115, 115, 0.2)" }} // neutral-500
                  className="lg:max-w-7/12 max-w-3/4 px-6 py-4 relative rounded-3xl"
                >
                  <p className={"text-neutral-200 lg:text-xl text-lg" + (index % 2 ? " text-right" : " text-left")}>{index+1}. {value}</p>
                </motion.div>}
              </AnimatePresence>
            )
          })}
        </div>
      </div>
    </>
  )
}

function Container({ bool, file, calc }) {
  return (
    <motion.div
      animate={{ opacity: bool ? 0 : 1 }}
      transition={bool ?
        { type: "tween", duration: 0.3, ease: "easeInOut" }
      :
        { type: "tween", duration: 0.3, ease: "easeInOut", delay: 0.5 }
      }
      style={{ top: `${-calc*3}rem`, left: `${calc*5}rem`, filter: `brightness(${90+calc*10}%)` }}
      className="relative"
    >
      <TiltedCard
        imageSrc={file}
        altText=""
        containerHeight="lg:h-[13.5vw] h-[27vw]"
        containerWidth="lg:w-[24vw] w-[48vw]"
        imageHeight=""
        imageWidth="lg:w-[48vw] w-[96vw]"
        scaleOnHover={0.6}
        showMobileWarning={false}
        showTooltip={false}
      />
    </motion.div>
  )
}

function SplitText({ children, options, className }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    let split = GSAPSplitText.create(ref.current, {
      autoSplit: true,
      onSplit: self => {
        setVisible(1);
        return gsap.from(self.chars, {
          y: 20,
          opacity: 0,
          ...options,
          //onComplete: () => self.revert()
        });
      }
    });
    return () => split.revert();
  }, []);

  return (
    <p ref={ref} style={{ opacity: visible }} className={className}>{children}</p>
  )
}