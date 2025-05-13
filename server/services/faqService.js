// server/services/faqService.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Create __filename and __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from root directory (../.env relative to services folder)
dotenv.config({ path: resolve(__dirname, '..', '.env') });

// Log to verify .env loaded correctly
console.log('[faqService] ENV loaded from:', resolve(__dirname, '..', '.env'));

// Retrieve Supabase credentials
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

// Debug log (optional - remove for production)
console.log('[faqService] SUPABASE_URL:', supabaseUrl);
console.log('[faqService] SUPABASE_KEY present:', !!supabaseKey);

// Validate required envs
if (!supabaseUrl || !supabaseKey) {
  throw new Error('❌ Missing Supabase credentials. Please check .env configuration.');
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Retrieves a matching answer from FAQs if the user's message contains a known question.
 */
export const getManualFAQAnswer = async (clientId, userMessage) => {
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .match({ clientId });

  if (error) {
    console.error('[faqService] Error fetching FAQs:', error);
    return null;
  }

  const lowerMessage = userMessage.toLowerCase();
  for (const faq of data) {
    if (lowerMessage.includes(faq.question.toLowerCase())) {
      return faq.answer;
    }
    // Allow partial matches (e.g., "warranty" should match "What is the warranty period?")
    if (faq.question.toLowerCase().includes(lowerMessage)) {
      return faq.answer;
    } 
  }

  return null;
};
