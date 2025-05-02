// routes/chat.js
import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

router.post('/', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Missing or invalid 'messages' array." });
  }

  try {
    const openrouterRes = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions', // make sure this is the correct endpoint
      {
        model: 'deepseek/deepseek-r1:free',
        messages: messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000, // set a 30-second timeout to prevent hanging
      }
    );

    console.log("🔑 OPENROUTER_API_KEY:", process.env.OPENROUTER_API_KEY);
    console.log('✅ OpenRouter response:', openrouterRes.data);

    const aiMessage = openrouterRes?.data?.choices?.[0]?.message?.content;

    if (!aiMessage) {
      return res.status(500).json({ error: 'No message from AI.' });
    }

    res.json({ message: aiMessage });
  } catch (error) {
    console.error('❌ Error from OpenRouter:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get response from AI.' });
  }
});

export default router;
