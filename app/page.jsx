"use client";

import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "motion/react";
import { gsap } from "gsap";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { FcGoogle } from "react-icons/fc";
import { HiArrowSmallLeft } from "react-icons/hi2";
import { montserrat, roboto } from "@/app/lib/fonts";
import { signInAction, sendFeedback } from "@/app/lib/actions";
import ErrorToast from "@/app/ui/error-toast";
import Aurora from "@/app/ui/react-bits/Aurora";
import TiltedCard from "@/app/ui/react-bits/TiltedCard";

gsap.registerPlugin(GSAPSplitText);

export default function Home() {
  const session = useSession();
  if (session.status == "authenticated") redirect("/tree");

  const [instr, setInstr] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

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
      <AnimatePresence>{feedbackOpen && <FeedbackForm setFeedbackOpen={setFeedbackOpen} />}</AnimatePresence>
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
            <motion.div
              initial={{ marginTop: "1rem", opacity: 0 }}
              animate={{ marginTop: "0rem", opacity: 1 }}
              transition={{ type: "tween", duration: 1, ease: "backOut" }}
              className="flex gap-12 lg:text-xl text-lg text-neutral-300"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 1.05 }}
                transition={{ type: "tween", duration: 0.3, ease: "backOut" }}
                onClick={() => {
                  if (!instr) document.getElementById("instructions").scrollIntoView({ behavior: "smooth" });
                  setInstr(!instr);
                }}
                className="hover:cursor-pointer"
              >How it works</motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 1.05 }}
                transition={{ type: "tween", duration: 0.3, ease: "backOut" }}
                className="hover:cursor-pointer"
                onClick={() => setFeedbackOpen(true)}
              >Leave feedback</motion.button>
            </motion.div>
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

function FeedbackForm({ setFeedbackOpen }) {
  const [error, setError] = useState(false);
  const showError = useCallback(err => {
    setError(err);
    setTimeout(() => setError(false), 5000);
  }, []);

  const [confirm, setConfirm] = useState(false);
  const showConfirm = useCallback(() => {
    setConfirm(true);
    setTimeout(() => setConfirm(false), 5000);
  }, []);

  const [result, formAction, isPending] = useActionState(sendFeedback, null);
  useEffect(() => {
    if (result) {
      if (result.error) {
        showError(result.error);
      } else {
        showConfirm();
      }
    }
  }, [result]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
      className="w-screen h-screen fixed z-10"
    >
      <div onClick={() => setFeedbackOpen(false)} className="w-full h-full bg-black opacity-30"></div>
      <motion.div
        initial={{ top: "48%" }}
        animate={{ top: "50%" }}
        exit={{ top: "48%" }}
        transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
        className="p-10 absolute left-1/2 -translate-1/2 flex flex-col items-center gap-12 bg-olive-900 rounded-[3rem]"
      >
        <div className="w-full flex justify-between items-center text-2xl text-neutral-200">
          <motion.button
            whileHover={{ scale: isPending ? 1 : 1.3 }}
            whileTap={{ scale: isPending ? 1 : 1.1 }}
            disabled={isPending}
            title="Back"
            className={isPending ? "opacity-50" : "hover:cursor-pointer"}
            onClick={() => setFeedbackOpen(false)}
          >
            <HiArrowSmallLeft className="size-10 fill-banana-500" />
          </motion.button>
          <p className="select-none">Feedback Form</p>
          <div className="size-10"></div>
        </div>
        <form action={formAction} className="flex flex-col gap-12 text-xl text-neutral-300">
          <div className="flex flex-col items-center gap-8">
            <input
              required
              disabled={isPending}
              id="formName"
              name="name"
              type="text"
              placeholder="Your name"
              className={"w-full px-2 py-1 bg-olive-700 rounded-md" + (isPending ? " opacity-50" : "")}
            />
            <textarea
              required
              disabled={isPending}
              id="formMessage"
              name="message"
              placeholder="Your message"
              className={"resize lg:min-w-92 min-w-[70vw] min-h-28 max-w-[70vw] max-h-[50vh] px-2 py-1 bg-olive-700 rounded-md" + (isPending ? " opacity-50" : "")}
            ></textarea>
          </div>
          <div className="w-full flex justify-end">
            <motion.button
              whileHover={{ scale: isPending ? 1 : 1.1 }}
              whileTap={{ scale: isPending ? 1 : 1.05 }}
              type="submit"
              disabled={isPending}
              title="Send feedback"
              className={"px-3 py-1 bg-slate-600 rounded-xl select-none" +
                (isPending ? " opacity-50" : " hover:cursor-pointer")
              }
            >Send feedback</motion.button>
          </div>
        </form>
      </motion.div>
      <AnimatePresence>{error && <ErrorToast error={error} alwaysDark={true} />}</AnimatePresence>
      <AnimatePresence>{confirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
          className="absolute left-1/2 -translate-x-1/2 bottom-8 z-10 px-3 py-2 flex justify-center items-center gap-3 rounded-full bg-olive-900"
        >
          <p className="text-lg text-neutral-200 select-none">Thank you, your feedback is greatly appreciated!</p>
        </motion.div>
      )}</AnimatePresence>
    </motion.div>
  )
}