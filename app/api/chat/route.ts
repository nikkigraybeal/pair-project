import { Configuration, OpenAIApi } from "openai";
import { NextRequest, NextResponse } from "next/server";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req: NextRequest) {
  if (!configuration.apiKey) {
    return NextResponse.json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
  }
  
  try {
    const messages = await req.json() // res now contains body
   
    console.log("MESSAGES", messages)
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    //console.log("COMPLETION", completion.data.choices[0].message?.content);
    return NextResponse.json({
      result: completion.data.choices[0].message?.content,
    });
  } catch (error) {
    return NextResponse.json({
      error: {
        message: "An error occurred during your request.",
      },
    });
  }
}
