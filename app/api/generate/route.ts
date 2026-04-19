import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { dishName, ingredients, techniqueNotes } = await req.json();
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://api.deepseek.com/v1",
    });
    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert food photographer and recipe card designer. Create styled recipe card layouts with photography angle suggestions and plating descriptions. Format your response as a beautiful, well-structured recipe card in markdown.`,
        },
        {
          role: "user",
          content: `Create a styled recipe card for: ${dishName}\n\nIngredients: ${ingredients}\n\nTechnique Notes: ${techniqueNotes}\n\nProvide:\n1. Recipe card with sections (title, ingredients list, instructions)\n2. Photography angle suggestions\n3. Plating description and styling tips\n4. Lighting recommendations`,
        },
      ],
      temperature: 0.7,
    });
    return NextResponse.json({ result: response.choices[0].message.content });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
