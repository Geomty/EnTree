"use server";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function createChildren(prevState, formData) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: JSON.stringify([
      {
        title: formData.get("query") + "1",
        description: "This is another description."
      },
      {
        title: formData.get("query") + "2",
        description: "This is yet another description."
      }
    ]),
    config: {
      systemInstruction: "Repeat exactly what is inputted.",
      thinkingConfig: {
        thinkingBudget: 0
      }
    }
  });
  return JSON.parse(response.text);
}