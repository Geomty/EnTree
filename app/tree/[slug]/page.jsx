import { notFound } from "next/navigation";
import { auth } from "@/auth";
import Menu from "@/app/ui/menu";
import Flow from "@/app/ui/flow";
import { getTrees, getTree } from "@/app/lib/actions";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const initial = (await getTree(slug)).response;
  if (initial) return { title: initial.title };
}

export default async function Page({ params }) {
  const session = await auth();
  if (!session?.user) notFound();

  const { slug } = await params;
  const initial = (await getTree(slug)).response;
  if (!initial) notFound();
  const titles = (await getTrees()).response;

  return (
    <>
      <Menu titles={titles} slug={slug} />
      <Flow initial={initial} slug={slug} />
    </>
  )
}