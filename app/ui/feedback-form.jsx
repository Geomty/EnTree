"use client";

import { useActionState, useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "motion/react";
import { HiArrowSmallLeft } from "react-icons/hi2";
import { sendFeedback } from "@/app/lib/actions";
import ErrorToast from "@/app/ui/error-toast";

export default function FeedbackForm({ setFeedbackOpen }) {
  const session = useSession();

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
      className="w-screen h-screen fixed z-40"
    >
      <div onClick={() => {if (!isPending) setFeedbackOpen(false)}} className="w-full h-full bg-black opacity-30"></div>
      <motion.div
        initial={{ top: "48%" }}
        animate={{ top: "50%" }}
        exit={{ top: "48%" }}
        transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
        className="p-8 absolute left-1/2 -translate-1/2 flex flex-col items-center gap-8 bg-olive-800 !text-neutral-200 dark:bg-olive-600 dark:!text-black rounded-[3rem]"
      >
        <div className="w-full flex justify-between items-center text-2xl">
          <motion.button
            whileHover={{ scale: isPending ? 1 : 1.3 }}
            whileTap={{ scale: isPending ? 1 : 1.1 }}
            disabled={isPending}
            title="Back"
            className={isPending ? "opacity-50" : "hover:cursor-pointer"}
            onClick={() => setFeedbackOpen(false)}
          >
            <HiArrowSmallLeft className="size-10 fill-banana-500 dark:fill-banana-800" />
          </motion.button>
          <p className="animColor select-none">Feedback Form</p>
          <div className="size-10"></div>
        </div>
        <form action={formAction} className="flex flex-col gap-8 text-xl">
          <div className="flex flex-col items-center gap-8">
            <input
              required
              disabled={isPending}
              name="name"
              type="text"
              defaultValue={session.data.user.name}
              placeholder="Your name"
              className={"animColor w-full px-2 py-1 bg-olive-700 dark:bg-olive-500 rounded-md" + (isPending ? " opacity-50" : "")}
            />
            <input readOnly name="email" type="text" value={session.data.user.email} className="hidden" />
            <textarea
              required
              disabled={isPending}
              name="message"
              placeholder="Your message"
              className={"animColor resize lg:min-w-92 min-w-[70vw] min-h-28 max-w-[70vw] max-h-[50vh] px-2 py-1 bg-olive-700 dark:bg-olive-500 rounded-md" + (isPending ? " opacity-50" : "")}
            ></textarea>
          </div>
          <div className="w-full flex justify-end">
            <motion.button
              whileHover={{ scale: isPending ? 1 : 1.1 }}
              whileTap={{ scale: isPending ? 1 : 1.05 }}
              type="submit"
              disabled={isPending}
              title="Send feedback"
              className={"animColor px-3 py-1 bg-slate-400 !text-black dark:bg-slate-700 dark:!text-neutral-300 rounded-xl select-none" +
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
          className="lg:w-auto w-[80vw] absolute left-1/2 -translate-x-1/2 bottom-8 z-50 px-3 py-2 flex justify-center items-center gap-3 rounded-full bg-olive-800 dark:bg-olive-600"
        >
          <p className="animColor text-lg text-center !text-neutral-200 dark:!text-black select-none">Thank you, your feedback is greatly appreciated!</p>
        </motion.div>
      )}</AnimatePresence>
    </motion.div>
  )
}