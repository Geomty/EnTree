import { redirect } from "next/navigation";
import { getTrees } from "@/app/lib/actions";

export default async function Page() {
    redirect("/tree/" + (await getTrees("1")).response[0].treeId);
}