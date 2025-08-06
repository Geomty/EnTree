import { notFound } from "next/navigation";
import Info from "@/app/ui/info";
import Flow from "@/app/ui/flow";
import { getTrees, getTree } from "@/app/lib/actions";

export default async function Page({ params }) {
  const { slug } = await params;
  const initial = (await getTree("1", slug)).response;
  if (!initial) notFound();
  const titles = (await getTrees("1")).response;

  return (
    <>
      <Info titles={titles} slug={slug} />
      <Flow initial={initial} slug={slug} />
    </>
  )
}