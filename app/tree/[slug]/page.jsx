import { notFound } from "next/navigation";
import { auth } from "@/auth";
import Menu from "@/app/ui/menu";
import Flow from "@/app/ui/flow";
import { getTrees, getTree } from "@/app/lib/actions";

export default async function Page({ params }) {
  const session = await auth();
  if (!session?.user) notFound();

  const { slug } = await params;
  const initial = (await getTree("1", slug)).response;
  if (!initial) notFound();
  const titles = (await getTrees("1")).response;

  return (
    <>
      <Menu titles={titles} slug={slug} />
      <Flow initial={initial} slug={slug} />
    </>
  )
}