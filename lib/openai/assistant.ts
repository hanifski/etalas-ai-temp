"use server";

import OpenAI from "openai";
import { AssistantCreate } from "@/interfaces/openai.interface";

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY as string });

// Function to create assistant to OpenAI
export async function _createAssistant(input: any) {
  const output = await openai.beta.assistants.create({
    model: input.model,
    name: input.name,
    instructions: input.instructions,
    tools: [{ type: "file_search" }],
    tool_resources: {
      file_search: {
        vector_store_ids: [input.vector_store_id],
      },
    },
  });

  return output.id;
}

// Function to create assistant to OpenAI without file
export async function _createAssistantWithoutFile(input: any) {
  const output = await openai.beta.assistants.create({
    model: input.model,
    name: input.name,
    instructions: input.instructions,
    tools: [{ type: "file_search" }],
  });

  return output.id;
}
