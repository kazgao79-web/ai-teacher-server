/*****import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/* =======================
   🧠 БЕСПЛАТНАЯ ЛОГИКА
======================= */
/*******
// Проверка: можем ли решить без GPT
function canSolveLocally(q) {
  if (!q) return false;

  // простой пример 2+5, 7-3
  if (q.match(/^\s*\d+\s*[\+\-]\s*\d+\s*$/)) return true;

  // базовые вопросы
  const keywords = [
    "что такое сложение",
    "что такое вычитание",
    "почему",
    "объясни сложение",
    "объясни вычитание"
  ];

  return keywords.some(k => q.toLowerCase().includes(k));
}

// Бесплатный ответ
function solveLocally(q) {
  q = q.toLowerCase().trim();

  // Примеры
  const add = q.match(/(\d+)\s*\+\s*(\d+)/);
  if (add) {
    const a = +add[1], b = +add[2];
    return `${a} + ${b} = ${a + b}. Было ${a} яблока, добавили ещё ${b}, стало ${a + b}.`;
  }

  const sub = q.match(/(\d+)\s*-\s*(\d+)/);
  if (sub) {
    const a = +sub[1], b = +sub[2];
    return `${a} - ${b} = ${a - b}. Было ${a} яблок, убрали ${b}, осталось ${a - b}.`;
  }

  // Объяснения
  if (q.includes("что такое сложение")) {
    return "Сложение — это когда мы соединяем числа вместе. Например: 2 + 3 = 5.";
  }

  if (q.includes("что такое вычитание")) {
    return "Вычитание — это когда от числа отнимают. Например: 5 − 2 = 3.";
  }

  if (q.includes("почему")) {
    return "Потому что при сложении мы считаем все предметы вместе, а при вычитании — убираем часть.";
  }

  return null;
}

/* =======================
   🤖 GPT (ЕСЛИ НУЖНО)
======================= */
/*******
async function askGPT(question) {
  if (!OPENAI_API_KEY) {
    return "GPT сейчас недоступен. Попробуй задать вопрос по-другому.";
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
          content:
            "Ты дружелюбный учитель математики 1 класса. Отвечай коротко и понятно, используй математическую запись: 5 + 3 = 8."
        },
        { role: "user", content: question }
      ]
    })
  });

  const data = await response.json();

  if (!data.choices || !data.choices[0]) {
    console.error("❌ GPT error:", data);
    return "Я не смогла ответить. Попробуй ещё раз.";
  }

  return data.choices[0].message.content;
}

/* =======================
   🌐 ENDPOINT /ask
======================= */
/*******
app.post("/ask", async (req, res) => {
  const question = req.body.question;
  console.log("📩 Question:", question);

  try {
    // 1️⃣ Пробуем бесплатно
    if (canSolveLocally(question)) {
      const answer = solveLocally(question);
      console.log("🟢 Local answer:", answer);
      return res.json({ answer, source: "local" });
    }

    // 2️⃣ GPT
    console.log("🔵 Using GPT...");
    const answer = await askGPT(question);
    return res.json({ answer, source: "gpt" });

  } catch (e) {
    console.error("🔥 Server error:", e);
    res.status(500).json({ answer: "Ошибка сервера" });
  }
});

/* =======================
   🚀 START
======================= */
/*******
app.listen(PORT, () => {
  console.log(`✅ AI teacher server running on port ${PORT}`);
});
********/
/********---------------------------NOVYI------------------------------------------******/
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

        console.log("📩 Question:", question);

        const response = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
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
                            content: `
Ты — дружелюбный и терпеливый учитель математики для 1 класса.

ТЕМА УРОКА:
«Сложение и вычитание чисел».

ПРАВИЛА:
- Отвечай свободно и естественно, как живой учитель.
- Объясняй простыми словами, доступными ребёнку.
- Используй примеры с предметами (яблоки, карандаши, игрушки).
- Можно поддерживать ученика и говорить, что это не сложно.
- Не используй сложные термины.
- Не выходи за рамки математики начальной школы.
- Если в вопросе несколько действий — объясняй их по порядку.

ЦЕЛЬ:
Помочь ребёнку ПОНЯТЬ, а не просто дать ответ.
`
                        },
                        {
                            role: "user",
                            content: question
                        }
                    ],
                    temperature: 0.8
                })
            }
        );

        const data = await response.json();

        if (!data.choices || !data.choices[0]) {
            console.error("❌ OpenAI empty response:", data);
            return res.json({
                answer: "Я не смогла ответить. Попробуй ещё раз."
            });
        }

        const answer = data.choices[0].message.content;

        console.log("🧠 GPT answer:", answer);

        res.json({ answer });

    } catch (error) {
        console.error("🔥 Server error:", error);
        res.status(500).json({
            answer: "Произошла ошибка на сервере."
        });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log("✅ AI teacher server running on port", PORT);
});


