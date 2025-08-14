import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Menu from "@/app/ui/menu";
import { getTrees } from "@/app/lib/actions";

export const metadata = {
  title: "New Tree"
}

export default async function Page() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const titles = (await getTrees()).response;
  if (titles?.length) redirect("/tree/" + titles[0].treeId);

  return (
    <div className="w-screen h-screen">
      <Menu opened={true} />
    </div>
  )
}