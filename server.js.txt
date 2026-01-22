import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/ask", async (req, res) => {
    try {
        const question = req.body.question;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "Ты дружелюбный учитель математики 1 класса. Отвечай коротко и понятно, используй только математические записи: 5 + 3 = 8."
                    },
                    { role: "user", content: question }
                ]
            })
        });

        const data = await response.json();
        res.json({ answer: data.choices[0].message.content });

    } catch (e) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

app.listen(3000, () => {
    console.log("AI teacher server running on port 3000");
});