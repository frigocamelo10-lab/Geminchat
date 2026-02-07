const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const app = express();

app.use(express.json());

// Rota de teste para você abrir no navegador e ver se o servidor responde
app.get("/", (req, res) => {
    res.send("Servidor Gemini está ONLINE! Use a rota /chat para interagir.");
});

app.post("/chat", async (req, res) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey.length < 10) {
            return res.status(500).json({ reply: "Erro: Chave API não configurada no Render!" });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Você é um robô no Roblox. Um player falou: "${req.body.text}". Responda gentilmente em até 12 linhas.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        res.json({ reply: response.text() });
    } catch (error) {
        console.error("ERRO NO GEMINI:", error);
        res.status(500).json({ reply: "Erro interno: " + error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
