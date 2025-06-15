
import { GoogleGenAI, GenerateContentResponse, Chat, Content } from "@google/genai";
import { GEMINI_MODEL_NAME } from '../constants';
import { ChatMessage, EditorSuggestion } from "../types";

const API_KEY = import.meta.env.VITE_API_KEY;

if (!API_KEY) {
  console.error("API_KEY for Gemini is not set. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey:API_KEY || "NO_API_KEY_PROVIDED" });

// System instruction to make the AI announce received context for debugging.
const MUSE_CHAT_SYSTEM_INSTRUCTION_DEBUG = `You are "The Muse," an expert creative writing partner for authors.
Engage in a supportive and inspiring conversation.
Help the user brainstorm ideas, develop plots, create characters, and overcome writer's block.
Keep your responses concise and conversational unless asked for more detail.
You can generate creative text like story snippets, dialogue, or descriptions when prompted.
Be encouraging and focus on collaboration.
Sometimes, the user's prompt will be prefixed with [Relevant World Info:...] containing context about their story.
**If you receive a non-empty context block, YOU MUST begin your response by listing the titles of the main items from that context. For example, start with: "DEBUG: CONTEXT RECEIVED for: [Title1, Title2]."**
**If the context block is prefixed but empty, or if no context block is prefixed at all, YOU MUST begin your response with: "DEBUG: NO CONTEXT or EMPTY CONTEXT received."**
After this debug statement, then proceed to answer the user's actual prompt using any available information.
Use this information to give highly relevant and specific answers tailored to their world.
Do not use markdown formatting in your responses.`;


// Existing function for the EditorPanel's "Enhance with Muse" button
const PROMPT_TEMPLATE_ENHANCE = `
You are "The Muse," an AI writing assistant for authors.
Your goal is to help overcome writer's block and enhance creativity by providing descriptive alternatives.
The user has written the following text:

---
{TEXT_TO_ENHANCE}
---

Your task is to rewrite or expand upon this text in 3 distinct and more descriptive ways, focusing on "showing" rather than "telling."
Make each suggestion vivid and engaging. Ensure each suggestion is a complete thought or paragraph.
Present your suggestions clearly. Do not use markdown formatting for your suggestions (e.g. no lists, no bolding).
Each suggestion should be separated by a double newline character ('\\n\\n').
For example, if the input is "He was angry.", you might provide:
1. His knuckles whitened as he gripped the armrest, a vein throbbing at his temple.
2. A low growl rumbled in his chest, and his eyes narrowed into dangerous slits.
3. He slammed his fist on the table, the sound echoing the sudden storm brewing in his expression.

Please provide 3 such suggestions for the text above.
`;

export const generateMuseSuggestions = async (textToEnhance: string): Promise<string[]> => {
  if (!API_KEY || API_KEY === "NO_API_KEY_PROVIDED") {
    throw new Error("Gemini API Key is not configured. Please set the API_KEY environment variable.");
  }

  const prompt = PROMPT_TEMPLATE_ENHANCE.replace("{TEXT_TO_ENHANCE}", textToEnhance);

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
    });

    const rawText = response.text;
    if (!rawText || rawText.trim() === "") {
      return ["Muse seems to be quiet right now. Try rephrasing or a different text."];
    }
    
    const suggestions = rawText.split('\n\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (suggestions.length === 0) {
       return ["Muse offered some thoughts, but they were a bit cryptic. Try again!"];
    }
    return suggestions;

  } catch (error) {
    console.error('Gemini API Error (Enhance Text):', error);
    if (error instanceof Error && error.message.includes("API key not valid")) {
         throw new Error("Invalid Gemini API Key. Please check your configuration.");
    }
    throw new Error(`Failed to get suggestions from Muse AI. ${error instanceof Error ? error.message : ''}`);
  }
};


// Updated function for Muse Chat to include context
export const getMuseChatResponse = async (
  chatHistory: ChatMessage[], 
  newUserMessageText: string,
  contextString?: string // Optional context string
): Promise<string> => {
  if (!API_KEY || API_KEY === "NO_API_KEY_PROVIDED") {
    return "API Key for Gemini is not configured. Please set the API_KEY environment variable to use AI features.";
  }

  const formattedHistory: Content[] = chatHistory.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }],
  }));
  
  const chat: Chat = ai.chats.create({
    model: GEMINI_MODEL_NAME,
    config: {
      systemInstruction: MUSE_CHAT_SYSTEM_INSTRUCTION_DEBUG, 
      // For production, change back to: systemInstruction: ORIGINAL_MUSE_CHAT_SYSTEM_INSTRUCTION,
    },
    history: formattedHistory, // History up to before the current user message
  });

  let finalPrompt = newUserMessageText;
  if (contextString && contextString.trim() !== "") {
    // Ensure there's a clear separation and instruction for the AI.
    finalPrompt = `[Relevant World Info:\n---\n${contextString}\n---]\n\nUser Prompt: ${newUserMessageText}`;
  } else if (contextString === '') { // Explicitly empty context string was passed (meaning buildContextString ran but found nothing)
     finalPrompt = `[Relevant World Info:\n---\nEMPTY\n---]\n\nUser Prompt: ${newUserMessageText}`;
  }
  // If contextString is undefined, no [Relevant World Info:...] block is added.
  
  console.log("GEMINI SERVICE: Final prompt being sent to AI:", finalPrompt);

  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message: finalPrompt });
    const aiResponseText = response.text;

    if (!aiResponseText || aiResponseText.trim() === "") {
      return "Muse seems to be pondering... Try asking again or rephrasing.";
    }
    return aiResponseText.trim();
  } catch (error) {
    console.error('Gemini API Chat Error:', error);
    if (error instanceof Error) {
        if (error.message.includes("API key not valid") || error.message.includes("API_KEY_INVALID")) {
            return "Error: Invalid Gemini API Key. Please check your configuration.";
        }
        if (error.message.toLowerCase().includes("quota")) {
            return "Error: You may have exceeded your Gemini API quota. Please check your usage and limits.";
        }
        const errorDetails = (error as any).message || '';
        if (errorDetails.includes("SAFETY")) {
             return "Muse had a thought, but it couldn't be shared due to safety guidelines. Try rephrasing your message or exploring a different topic.";
        }
        if ((error as any).status === 400 && errorDetails.includes("candidate")) {
             return "Muse's response was blocked, possibly due to safety settings. Please try rephrasing your message.";
        }
         return `Error communicating with Muse AI: ${error.message}. Check the console for more details.`;
    }
    return "An unknown error occurred while talking to Muse AI. Please check the console.";
  }
};

// New function for Editor Analysis
const EDITOR_SYSTEM_INSTRUCTION = `You are "The Editor," a meticulous and analytical AI assistant for authors.
Your task is to analyze the provided text and identify areas for improvement.
Focus on common writing issues such as clarity, conciseness, grammar, punctuation, passive voice, repetition, clichés, and awkward phrasing.
For each issue found, provide:
1.  The "original" problematic segment of text.
2.  A "suggestion" for how to improve it.
3.  A "category" (e.g., "Clarity", "Conciseness", "Grammar", "Passive Voice", "Repetition", "Word Choice", "Punctuation", "Style").
4.  A brief "reason" explaining the issue and why the suggestion is an improvement.

You MUST return your findings as a VALID JSON array of objects. Each object in the array should follow this structure:
{
  "original": "The original text snippet that has an issue.",
  "suggestion": "Your improved version of the text snippet.",
  "category": "The category of the writing issue.",
  "reason": "A brief explanation of the issue and your suggestion."
}
Ensure the JSON is well-formed. Do not include any explanatory text or markdown outside of the JSON array itself.
If no significant issues are found, return an empty JSON array [].
`;

export const getEditorAnalysis = async (textToAnalyze: string): Promise<EditorSuggestion[]> => {
  if (!API_KEY || API_KEY === "NO_API_KEY_PROVIDED") {
    throw new Error("Gemini API Key is not configured. Please set the API_KEY environment variable to use AI features.");
  }

  const prompt = `Please analyze the following text:\n\n---\n${textToAnalyze}\n---`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: EDITOR_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json", // Request JSON output
      }
    });

    if (!response.text) {
  throw new Error("No response text from Gemini API.");
}
let jsonStr = response.text.trim();
    
    // Remove markdown fences if present
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }

    try {
      const parsedData = JSON.parse(jsonStr);
      if (Array.isArray(parsedData)) {
        // Add a unique ID to each suggestion for React keys
        return parsedData.map((item, index) => ({ ...item, id: `suggestion-${Date.now()}-${index}` }));
      } else {
        console.error("Editor AI returned non-array JSON:", parsedData);
        throw new Error("Editor AI returned an unexpected data format. Expected an array.");
      }
    } catch (parseError) {
      console.error("Failed to parse JSON response from Editor AI:", parseError, "Raw response:", jsonStr);
      throw new Error("Editor AI returned an invalid response. Could not parse suggestions.");
    }

  } catch (error) {
    console.error('Gemini API Error (Editor Analysis):', error);
     if (error instanceof Error) {
        if (error.message.includes("API key not valid") || error.message.includes("API_KEY_INVALID")) {
            throw new Error("Invalid Gemini API Key. Please check your configuration.");
        }
        if (error.message.toLowerCase().includes("quota")) {
            throw new Error("You may have exceeded your Gemini API quota. Please check your usage and limits.");
        }
        const errorDetails = (error as any).message || '';
         if (errorDetails.includes("SAFETY") || (errorDetails.includes("candidate") && (error as any).status === 400) ) {
             throw new Error("The Editor AI's response was blocked, possibly due to safety guidelines or content filters for the provided text.");
        }
        throw new Error(`Failed to get analysis from Editor AI: ${error.message}`);
    }
    throw new Error("An unknown error occurred while analyzing text with Editor AI.");
  }
};
