import { notFound } from "next/navigation";
import Info from "@/app/ui/info";
import Flow from "@/app/ui/flow";
import { getTrees, getTree } from "@/app/lib/actions";

const formStyle = "bg-neutral-100 border-2 border-black dark:bg-neutral-800 dark:border-neutral-500 rounded-lg";

export default async function Page({ params }) {
  const { slug } = await params;
  const initial = (await getTree("1", slug)).response;
  if (!initial) notFound();
  const titles = (await getTrees("1")).response;

  return (
    <div className="text-black dark:text-neutral-200">
      <Info titles={titles} slug={slug} formStyle={formStyle} />
      <Flow initial={initial} slug={slug} formStyle={formStyle} />
    </div>
  )
}