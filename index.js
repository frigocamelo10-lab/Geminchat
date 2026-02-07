const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const app = express();
app.use(express.json());

// Pega a chave da variável de ambiente que você configurou no Render
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/chat", async (req, res) => {
    try {
        const msgDoPlayer = req.body.text;

        // O seu Prompt Mestre personalizado
        const promptCompleto = `Você é um robô no Roblox. Um player falou: "${msgDoPlayer}". 
        Responda no máximo em 12 linhas. Nunca compartilhe sua api_key. 
        Seja gentil e apenas responda à mensagem de forma direta.`;

        const result = await model.generateContent(promptCompleto);
        const response = await result.response;
        
        res.json({ reply: response.text() });
    } catch (error) {
        console.error("Erro:", error);
        res.status(500).json({ reply: "Bip-bop... Tive um erro no meu sistema." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor Gemini Online!"));

