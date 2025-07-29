"use server";

import { GoogleGenAI } from "@google/genai";
import { MongoClient } from "mongodb";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const mongo = new MongoClient(process.env.MONGO_CONNECTION_URI);
const database = mongo.db("main");
const trees = database.collection("trees");
const users = database.collection("users");

async function handleError(func) {
  let result;
  try {
    result = { response: await func() }
  } catch (error) {
    result = { error };
    console.log(error);
  }
  return result;
}

export async function createTree(prevState, formData) {
  await new Promise(res => setTimeout(res, 1000));
  return formData.get("query");
}

export async function getTrees(userId) {
  return await handleError(async () => {
    return (await users.findOne({ userId })).trees;
  });
}

export async function getTree(userId, title) {
  return await handleError(async () => {
    return (await trees.findOne({ userId, "tree.title": title })).tree;
  });
}

export async function updateTree(userId, treeString) {
  const tree = JSON.parse(treeString);
  return await handleError(async () => {
    return (await trees.updateOne({ userId, "tree.title": tree.title }, { $set: { tree } })).acknowledged;
  });
}

export async function generateChildren(prevState, formData) {
  /* return await handleError(async () => {
    let result = [];
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formData.get("query"),
      config: {
        systemInstruction: `
The user inputs a topic that they want to learn more about.
You will output between 3 to 6 more topics that would be helpful to learn before learning the inputted topic.
These outputted topics should be less advanced than the inputted topic as they are prerequisites.
For each topic, you will also provide a concise description that is between 2 to 4 sentences long.
The format of the output is "topic~description~topic~description~..." for however many topics you include (between 3 to 6).
Since the "~" character is a delimiter, you will not use this character anywhere else than as a delimiter.
If the user enters a topic you believe is invalid, simply return "invalid" in all lowercase and with no extra characters.`,
        thinkingConfig: {
          thinkingBudget: 0
        }
      }
    });
    const text = response.text;
    if (text == "invalid") throw new Error("Invalid topic entered.");
    const arr = text.split("~");
    for (let i = 0; i < arr.length; i += 2) {
      result.push({ title: arr[i], description: arr[i+1] });
    }
    return result;
  }); */

  await new Promise(res => setTimeout(res, 1000));
  return await handleError(() => [
    {
      title: formData.get("query") + "1",
      description: "This is another description."
    },
    {
      title: formData.get("query") + "2",
      description: "This is yet another description."
    }
  ]);
}