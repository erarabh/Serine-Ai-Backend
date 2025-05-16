import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRouter from './routes/chat.js';
import siteRouter from './routes/site.js';
import faqRoutes from './routes/faq.js';
import requireAuth from './middleware/requireAuth.js'; // Import our authentication middleware

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: "https://serine-ai.vercel.app",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"] // Include Authorization header.
}));
app.use(express.json());

// Set a Content-Security-Policy header (already in your code)
app.use((req, res, next) => {
  const isDev = process.env.NODE_ENV !== "production";

  res.setHeader(
    "Content-Security-Policy",
    isDev
      ? "default-src 'self'; " +
        "script-src 'self' 'sha256-NEZvGkT0ZWP6XHdKYM4B1laRPcM6Lw4LJfkDtIEVAKc=' http://localhost:* ws://localhost:*; " + // Allow specific inline scripts during dev
        "style-src 'self' 'sha256-HzLNcXq0q/qekrZdqIT8odaj6oOxAgqWeCiI15p7Sdk='; " + // Allow specific inline styles during dev
        "connect-src 'self' http://localhost:* ws://localhost:* https://api.openrouter.ai https://serine-ai-backend-production.up.railway.app https://serine-ai.vercel.app"
      : "default-src 'self'; " +
        "script-src 'self'; " + // No unsafe scripts in production
        "style-src 'self'; " + // No unsafe styles in production
        "font-src 'self' data:; " +
        "connect-src 'self' https://api.openrouter.ai https://serine-ai-backend-production.up.railway.app https://serine-ai.vercel.app"
  );

  next();
});

app.use((req, res, next) => {
  console.log("CSP for this request:", res.getHeader("Content-Security-Policy"));
  next();
});

app.use('/api/site', siteRouter);
app.use('/chat', chatRouter);
app.use('/faq', faqRoutes);

// Secured admin route: only accessible if JWT is valid and user has an admin role.
app.get('/admin', requireAuth, (req, res) => {
  // Check if the authenticated user has the admin role.
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: You do not have admin access' });
  }
  res.send(`Hello admin ${req.user.email}, welcome to your dashboard!`);
});

// Public health check endpoint.
app.get('/', (req, res) => {
  res.send('Backend is running...');
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
