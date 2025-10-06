"use server";

import { GoogleGenAI } from "@google/genai";
import { MongoClient } from "mongodb";
import { auth, signIn } from "@/auth";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const mongo = new MongoClient(process.env.MONGO_CONNECTION_URI);
const database = mongo.db("main");
const trees = database.collection("trees");
const users = database.collection("users");

async function handleError(func) {
  let result;
  try {
    const session = await auth();
    result = { response: await func(session?.user.email) }
  } catch (error) {
    result = { error };
    console.log(error);
  }
  return result;
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/tree" });
}

export async function sendFeedback(prevState, formData) {
  return await handleError(async () => {
    const res = await fetch(process.env.FORMCARRY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        "Name": formData.get("name"),
        "Message": formData.get("message")
      })
    });
    const data = await res.json();
    if (data.code == 200) {
      return "Success";
    } else {
      throw new Error(data.message);
    }
  });
}

export async function createTree(prevState, formData) {
  return await handleError(async email => {
    const description = (await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formData.get("query"),
      config: {
        systemInstruction: `
Provide a concise description for the inputted topic that is between 2 to 4 sentences long.
If the user enters a topic you believe is invalid, simply return "invalid" in all lowercase and with no extra characters.`,
        thinkingConfig: {
          thinkingBudget: 0
        }
      }
    })).text;
    if (description.toLowerCase() == "invalid") throw new Error("Please enter a valid topic.");
    const id = crypto.randomUUID();
    await trees.insertOne({
      userId: email,
      tree: {
        title: formData.get("query"),
        description,
        position: { x: 0, y: 0 },
        complete: false,
        children: []
      },
      treeId: id
    });
    await users.updateOne({ userId: email }, {
      $push: {
        trees: {
          title: formData.get("query"),
          treeId: id
        }
      }
    }, { upsert: true });
    return id;
  });
}

export async function getTrees() {
  return await handleError(async email => {
    const result = await users.findOne({ userId: email });
    if (result) return result.trees;
    else return result;
  });
}

export async function getTree(treeId) {
  return await handleError(async email => {
    if (email) {
      const result = await trees.findOne({ userId: email, treeId });
      if (result) return result.tree;
      else return result;
    } else return null;
  });
}

export async function updateTree(treeId, treeString) {
  const tree = JSON.parse(treeString);
  return await handleError(async email => {
    return (await trees.updateOne({ userId: email, treeId }, { $set: { tree } })).acknowledged;
  });
}

export async function deleteTree(prevState, formData) {
  return await handleError(async email => {
    const treeId = formData.get("treeId");
    await trees.deleteOne({ userId: email, treeId });
    await users.updateOne({ userId: email }, {
      $pull: {
        trees: {
          treeId
        }
      }
    });
    return treeId;
  });
}

export async function generateChildren(prevState, formData) {
  return await handleError(async () => {
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
  });

  /* await new Promise(res => setTimeout(res, 1000));
  return await handleError(() => [
    {
      title: formData.get("query") + "1",
      description: "This is another description."
    },
    {
      title: formData.get("query") + "2",
      description: "This is yet another description."
    }
  ]); */
}