const express = require('express');
const cors = require('cors');
const OpenAI = require("openai");
require('dotenv').config();

const app = express();
const port = 3005;

// 配置跨域
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY // 建议使用环境变量存储密钥
});



// 提供静态文件
//app.use(express.static('public'));

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));


// 处理聊天请求
app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;
        
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                ...messages
            ],
            model: "deepseek-chat",
        });

        res.json({
            success: true,
            message: completion.choices[0].message.content
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: '请求处理失败'
        });
    }
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
  

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
