import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ZodTypeAny  } from "zod";

const llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",   //model you wanna use
    apiKey: process.env.GEMINI_API_KEY,        // your api key
});

function StructuredLLM<T extends ZodTypeAny>(Schema: T) {
    return llm.withStructuredOutput(Schema);
}

export { StructuredLLM , llm }