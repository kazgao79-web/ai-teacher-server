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

        if (!question) {
            return res.json({ answer: "Я не услышала вопрос. Попробуй ещё раз." });
        }

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
                        content: "Ты дружелюбный учитель математики 1 класса. Отвечай строго в формате: пример = ответ. Используй только математические записи, например: 2 + 5 = 7 или 5 - 3 = 2."
                    },
                    { role: "user", content: question }
                ]
            })
        });

        const data = await response.json();

        // Безопасная проверка, чтобы избежать undefined
        let answer = data?.choices?.[0]?.message?.content?.trim();
        if (!answer) answer = "Я не смогла ответить. Попробуй ещё раз.";

        res.json({ answer });

    } catch (e) {
        console.error(e);
        res.status(500).json({ answer: "Произошла ошибка на сервере. Попробуй позже." });
    }
});

app.listen(3000, () => {
    console.log("AI teacher server running on port 3000");
});
