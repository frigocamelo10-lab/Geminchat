const express = require("express");
const https = require("https");
const app = express();
app.use(express.json());

app.get("/", (req, res) => res.send("Servidor Nativo Online"));

app.post("/chat", async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    const dataString = JSON.stringify({
        contents: [{ parts: [{ text: `Responda curto para o Roblox: ${req.body.text}` }] }]
    });

    const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': dataString.length
        }
    };

    const request = https.request(options, (response) => {
        let body = '';
        response.on('data', (chunk) => body += chunk);
        response.on('end', () => {
            try {
                const json = JSON.parse(body);
                if (json.candidates && json.candidates[0]) {
                    res.json({ reply: json.candidates[0].content.parts[0].text });
                } else {
                    res.status(500).json({ reply: "Erro na resposta do Google", detail: json });
                }
            } catch (e) {
                res.status(500).json({ reply: "Erro ao ler resposta" });
            }
        });
    });

    request.on('error', (error) => {
        res.status(500).json({ reply: "Erro de conexão" });
    });

    request.write(dataString);
    request.end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log("Servidor rodando!"));
