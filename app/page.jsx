import { FcGoogle } from "react-icons/fc";
import { roboto } from "@/app/lib/fonts";
import { signIn } from "@/auth";

export default function Home() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/tree" });
      }}
    >
      <button type="submit" className="border-neutral-500 px-3 py-2 flex items-center gap-3 bg-white border rounded-full hover:cursor-pointer hover:bg-neutral-200 !transition-all !duration-200 !ease-in-out">
        <FcGoogle className="size-6" />
        <p className={"text-neutral-700 text-md font-medium " + roboto.className}>Sign in with Google</p>
      </button>
    </form>
  )
}