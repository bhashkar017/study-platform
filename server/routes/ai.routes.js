const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

router.post('/ask', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({ error: "Server missing GROQ_API_KEY" });
        }

        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are a helpful study assistant. Provide clear, concise explanations to help students learn." },
                { role: "user", content: prompt }
            ],
            max_tokens: 500,
            temperature: 0.7
        });

        const text = completion.choices[0].message.content;
        res.json({ response: text });
    } catch (err) {
        console.error("AI Request Failed:", {
            message: err.message,
            error: err.error
        });

        if (err.status === 401) {
            return res.status(500).json({ error: "Invalid Groq API Key" });
        }

        res.status(500).json({ error: "Failed to generate response. Check server logs." });
    }
});

module.exports = router;
