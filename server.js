import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    console.error("❌ Ошибка: Не задан OPENAI_API_KEY в переменных окружения!");
    process.exit(1);
}

app.post("/ask", async (req, res) => {
    try {
        const question = req.body.question?.trim();
        if (!question) {
            return res.json({ answer: "Я не получил вопрос. Попробуй снова." });
        }

        console.log("➡ Вопрос от ученика:", question);

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
                        content: "Ты дружелюбный учитель математики 1 класса. Отвечай коротко и понятно. Используй только математические записи: например 5 + 3 = 8."
                    },
                    { role: "user", content: question }
                ],
                temperature: 0.3
            })
        });

        const data = await response.json();
        console.log("⬅ Ответ от OpenAI:", JSON.stringify(data, null, 2));

        const answer = data?.choices?.[0]?.message?.content?.trim()
            || "Я не смогла ответить. Попробуй ещё раз.";

        res.json({ answer });

    } catch (err) {
        console.error("❌ Ошибка сервера:", err);
        res.status(500).json({ answer: "Произошла ошибка на сервере. Попробуй позже." });
    }
});

// Использовать порт Render или локально 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ AI teacher server running on port ${PORT}`);
});
