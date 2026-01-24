import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY not set");
}

app.post("/ask", async (req, res) => {
  const question = req.body?.question;

  console.log("📩 Question:", question);

  if (!question) {
    return res.json({ answer: "Пожалуйста, задай вопрос." });
  }

  try {
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
            content:
              "Ты дружелюбный учитель математики 1 класса. Отвечай коротко и понятно. Если это пример, используй ТОЛЬКО математическую запись, например: 5 + 3 = 8."
          },
          { role: "user", content: question }
        ],
        temperature: 0.2
      })
    });

    const data = await response.json();
    console.log("🧠 OpenAI raw response:", JSON.stringify(data));

    const answer =
      data?.choices?.[0]?.message?.content ||
      "Я не смогла ответить. Попробуй ещё раз.";

    res.json({ answer });

  } catch (err) {
    console.error("🔥 OpenAI error:", err);
    res.json({ answer: "Ошибка сервера. Попробуй позже." });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("🚀 AI teacher server running on port", PORT);
});
