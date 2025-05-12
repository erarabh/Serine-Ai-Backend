// server/routes/faq.js
import express from 'express';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '..', '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL and SUPABASE_KEY (or SUPABASE_SERVICE_ROLE_KEY) must be defined in .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);
const router = express.Router();

/**
 * GET /faq?clientId=CLIENT_ABC123
 * This route retrieves all FAQ entries for a given client.
 */
router.get('/', async (req, res) => {
  try {
    const clientId = req.query.clientId;
    if (!clientId) {
      return res.status(400).json({ error: "clientId is required" });
    }

    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .match({ clientId });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (err) {
    console.error('Error in GET /faq:', err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
