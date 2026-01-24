import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.post("/ask", async (req, res) => {
    try {
        const question = req.body.question;

        console.log("📩 Вопрос:", question);

        if (!question) {
            return res.json({ answer: "Задай вопрос, пожалуйста." });
        }

        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "Ты дружелюбный учитель математики 1 класса. Отвечай коротко, понятно и обязательно показывай пример: 2 + 5 = 7."
                },
                {
                    role: "user",
                    content: question
                }
            ],
            temperature: 0.3
        });

        const answer =
            completion.choices?.[0]?.message?.content?.trim();

        console.log("📤 Ответ GPT:", answer);

        res.json({
            answer: answer || "Я не смогла ответить. Попробуй ещё раз."
        });

    } catch (error) {
        console.error("❌ Ошибка GPT:", error.message);
        res.json({
            answer: "Ошибка сервера. Попробуй позже."
        });
    }
});

app.get("/", (req, res) => {
    res.send("AI Teacher Server работает ✅");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
});
