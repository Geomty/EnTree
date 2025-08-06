import { redirect } from "next/navigation";
import Info from "@/app/ui/info";
import { getTrees } from "@/app/lib/actions";

export default async function Page() {
  const titles = (await getTrees("1")).response;
  if (titles.length) redirect("/tree/" + titles[0].treeId);

  return (
    <div className="w-screen h-screen">
      <Info opened={true} />
    </div>
  )
}