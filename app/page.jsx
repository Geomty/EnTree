import Flow from "@/app/ui/flow";
import ThemeToggle from "@/app/ui/theme-toggle";

export default function Home() {
  return (
    <div className="text-black dark:text-neutral-200">
      <ThemeToggle />
      <Flow />
    </div>
  )
}
