import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRouter from './routes/chat.js';
import siteRouter from './routes/site.js';

dotenv.config();

const app = express();
const port = 5000;



app.use(cors({
  origin: "https://serine-ai.vercel.app",  
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self' https://api.openrouter.ai https://serine-ai-backend-production.up.railway.app https://serine-ai.vercel.app"
  );
  next();
});
								 
							 

app.use((req, res, next) => {
  console.log("CSP for this request:", res.getHeader("Content-Security-Policy"));
  next();
});
app.use('/api/site', siteRouter);
app.use('/chat', chatRouter);

app.get('/', (req, res) => {
  res.send('Backend is running...');
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
