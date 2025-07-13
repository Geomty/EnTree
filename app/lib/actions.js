"use server";

export async function createChildren(prevState, formData) {
  return [
    {
      title: formData.get("query") + "1",
      description: "This is another description."
    },
    {
      title: formData.get("query") + "2",
      description: "This is yet another description."
    }
  ];
}