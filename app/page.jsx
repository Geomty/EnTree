import Flow from "@/app/ui/flow";
import FlowForm from "@/app/ui/flow-form";
import ThemeToggle from "@/app/ui/theme-toggle";

export default function Home() {
  return (
    <div className="text-black dark:text-neutral-200">
      <div className="absolute top-5 left-5 z-10 flex justify-start items-center gap-8">
        <ThemeToggle />
        <FlowForm />
      </div>
      <Flow />
    </div>
  )
}
