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
    apiKey: 'sk-4dfdaf65e15c449080c1838d1f16b3e3' // 建议使用环境变量存储密钥
});



// 提供静态文件
//app.use(express.static('public'));

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));


// 处理聊天请求
app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;
/*
         // 如果是首次对话，直接返回开场白
         if (messages.length === 0) {
            res.json({
                success: true,
                message: "您好！我是您的家庭医疗机器人，专门为您提供健康咨询和初步诊断服务。为了更好地了解您的症状并提供准确的建议，我需要向您提出几个问题。请您尽量详细地回答，这样我才能更好地帮助您。请问您目前有什么不适或症状吗？"
            });
            return;
        }
*/
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "你是一个家庭医疗机器人，能够通过向来询问的人提问进而一步步判断患者的患病情况，并给出一定的诊断。现在请在患者询问之前向患者大哥召唤并交代你的身份。" },
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
    console.log(`Server running at https://simple-framework-8jm8lakqg-firstpioneers-projects.vercel.app/`);
});
