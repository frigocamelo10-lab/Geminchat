const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const app = express();
app.use(express.json());

// Forçamos a conexão para não usar v1beta
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get("/", (req, res) => res.send("Servidor v1 Online"));

app.post("/chat", async (req, res) => {
    try {
        // Usamos o modelo padrão sem o sufixo "-latest" para evitar o erro 404
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash"
        });
        
        const prompt = `Responda curto para o Roblox: ${req.body.text}`;
        
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
