const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get("/", (req, res) => res.send("Servidor Gemini 1.0 Estável"));

app.post("/chat", async (req, res) => {
    try {
        // Mudamos para o gemini-1.0-pro que é mais compatível com chaves gratuitas
        const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
        
        const prompt = `Responda de forma curta ao player do Roblox: ${req.body.text}`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        res.json({ reply: response.text() });
    } catch (error) {
        console.error("ERRO:", error.message);
        res.status(500).json({ reply: "Erro: " + error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log("Servidor ativo"));
