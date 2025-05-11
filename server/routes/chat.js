// server/routes/chat.js
import express from 'express';
import { processChatRequest } from '../controllers/chatController.js';
							
		
const router = express.Router();

router.post('/', async (req, res) => {
  const { clientId, sessionId, messages } = req.body;

  if (!clientId || !messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Missing required fields: clientId and a non-empty messages array." });
  }

  // We assume that the latest message (i.e. last element in messages) is the user's latest query.
  const lastMessage = messages[messages.length - 1].content;

  try {
    const answer = await processChatRequest(clientId, sessionId, lastMessage);
    // If sessionId was not provided, the controller may generate one (here we simply echo back the one provided or a fallback string)
    res.json({ message: answer, sessionId: sessionId || "generated-session-id" });
									 
  } catch (error) {
    console.error("Error processing chat request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
