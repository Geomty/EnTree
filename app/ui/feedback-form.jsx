"use client";

import { useActionState, useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import ErrorToast from "@/app/ui/error-toast";
import { sendFeedback } from "@/app/lib/actions";

export default function FeedbackForm() {
  const [error, setError] = useState(false);
  const showError = useCallback(err => {
    setError(err);
    setTimeout(() => setError(false), 5000);
  }, []);

  const [result, formAction, isPending] = useActionState(sendFeedback, null);
  useEffect(() => {
    if (result) {
      if (result.error) {
        showError(result.error);
      }
    }
  }, [result]);

  return (
    <div>
      <form action={formAction}>
        <label htmlFor="formName" className="">Name:</label>
        <input
          required
          disabled={isPending}
          id="formName"
          name="name"
          type="text"
          placeholder="Enter your name"
          className=""
        />
        <label htmlFor="formMessage" className="">Message:</label>
        <textarea
          required
          disabled={isPending}
          id="formMessage"
          name="message"
          placeholder="Enter your message"
          className=""
        ></textarea>
        <button type="submit" disabled={isPending} title="Send feedback">Send feedback</button>
      </form>
      <AnimatePresence>{error && <ErrorToast error={error} alwaysDark={true} />}</AnimatePresence>
    </div>
  )
}