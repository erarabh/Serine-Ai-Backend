import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRouter from './routes/chat.js';
import siteRouter from './routes/site.js';

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Middleware CSP à appliquer pour toutes les routes
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self' https://api.openrouter.ai"
  );
  next();
});

// Utilisation des routeurs
app.use('/api/site', siteRouter);
app.use('/chat', chatRouter);

app.get('/', (req, res) => {
  res.send('Backend is running...');
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
