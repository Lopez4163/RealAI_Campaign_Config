import { NextResponse } from "next/server";
import { audiencePrompt, productPrompt } from "@/app/lib/prompts/prompts";
import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs"

// GEMINI ANALYZE FUNCTION 
export async function POST(req: Request) {
    const body = await req.json();
    const {userContext} = body
    const { campaignType } = userContext


    if (campaignType !== "audience" && campaignType !== "product") {
        return NextResponse.json({ error: "Invalid campaignType" }, { status: 400 });
      }      
    const prompt = campaignType === "audience" ? audiencePrompt(userContext) : productPrompt(userContext)
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
        return NextResponse.json(
          { error: "Missing GOOGLE_API_KEY in .env.local" },
          { status: 500 }
        );
      }

    const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { apiVersion: "v1" },
    });

    try {
        const resp = await ai.models.generateContent({
          model: "gemini-2.0-flash", // --> *** MODEL TYPE IF YOU NEED TO CHANGE FOR GEMINI API KEY ***
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: { temperature: 0, maxOutputTokens: 600 },
        });
    
        const text = resp.text ?? "";
        const jsonStr = text.match(/\{[\s\S]*\}/)?.[0];
        const parsed = jsonStr ? JSON.parse(jsonStr) : { raw: text };

        // *** LOG TO BE SEEN IN IDE CONSOLE  ***
        console.log("=== GEMINI RAW OUTPUT START ===");
        console.log(parsed);
        console.log("=== GEMINI RAW OUTPUT END ===");
    
        return NextResponse.json(parsed); 
      } catch (err: any) {
        console.error("Gemini error:", err);
    
        return NextResponse.json(
          { error: err?.message ?? "Gemini request failed" },
          { status: 500 }
        );
      }
    }


    
   