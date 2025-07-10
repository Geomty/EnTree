"use server";

export async function createTree(prevState, formData) {
  return { title: formData.get("query"), description: "This is a description." };
}