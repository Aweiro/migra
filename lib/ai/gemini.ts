import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function translateText(text: string, targetLangs: string[]) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `Translate the following text into these languages: ${targetLangs.join(", ")}. 
    Return the result as a strictly formatted JSON object where keys are the language codes (en, uk, ru, pl) and values are the translations.
    If the target language is English, keep it as is if it's already English.
    Text to translate: "${text}"`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();
        console.log("GEMINI_TRANSLATE_RAW:", responseText);

        // Sanitize response text to handle potential markdown code blocks
        const sanitizedJson = responseText.replace(/```json\n?|\n?```/g, "").trim();
        return JSON.parse(sanitizedJson);
    } catch (error) {
        console.error("Gemini Translation Error:", error);
        throw error;
    }
}

export async function generateProductDescription(productName: string, targetLangs: string[]) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `Generate a premium, concise, and technical product description for a product named "${productName}".
    The description should sound high-end, focusing on quality, context, and aesthetic.
    Provide the description in these languages: ${targetLangs.join(", ")}.
    Return the result as a strictly formatted JSON object where keys are the language codes (en, uk, ru, pl) and values are the generated descriptions.
    The description should be 2-3 sentences long.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();
        console.log("GEMINI_DESC_RAW:", responseText);

        const sanitizedJson = responseText.replace(/```json\n?|\n?```/g, "").trim();
        return JSON.parse(sanitizedJson);
    } catch (error) {
        console.error("Gemini Generation Error:", error);
        throw error;
    }
}
