import express from "express";
import { GoogleGenAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({path: "./.env"});
console.log("API Key Loaded:", process.env.API_KEY ? "Yes" : "No");

const app = express();
const PORT = 3000;

// Initialize Gemini AI with API key
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

app.get("/test-gemini", async (req, res) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
For LeetCode problem 106 , return ONLY a JSON array of topics used in its
brute force, better, and optimal solutions.

Rules:
- Output must be a valid array
- No explanation
- No text
- No code block
- No extra words

Example format: ["nested loop", "hashmap", "sorting"]
`
    });

    res.json({ 
      success: true, 
      response: response.text 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Test Gemini API at: http://localhost:${PORT}/test-gemini`);
});
