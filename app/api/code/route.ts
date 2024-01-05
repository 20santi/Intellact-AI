import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

const instructionMessage = {
  role: "system",
  content:
    "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations and also return explanation of every line of code with their functionalty in points",
};

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const response: OpenAI.Chat.ChatCompletion =
      await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [instructionMessage, ...messages],
      });

    return NextResponse.json(response["choices"][0]["message"]["content"]);
  } catch (error) {
    console.log("CODE_ERROR :->  ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
