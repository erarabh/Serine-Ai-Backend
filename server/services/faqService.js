// server/services/faqService.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Create __filename and __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from the root directory (../.env relative to this services folder)
dotenv.config({ path: resolve(__dirname, '..', '.env') });

// Log to verify that .env is loaded correctly
console.log('[faqService] ENV loaded from:', resolve(__dirname, '..', '.env'));

// Retrieve Supabase credentials from .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

// Debug log (optional - remove for production)
console.log('[faqService] SUPABASE_URL:', supabaseUrl);
console.log('[faqService] SUPABASE_KEY present:', !!supabaseKey);

// Validate required environment variables
if (!supabaseUrl || !supabaseKey) {
  throw new Error('❌ Missing Supabase credentials. Please check .env configuration.');
}

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Helper function to sanitize a string.
 * It removes punctuation, extra spaces, and converts to lowercase.
 */
const sanitize = (str) => {
  return str.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").toLowerCase().trim();
};

/**
 * Retrieves a matching FAQ answer for the given clientId and userMessage.
 * Uses the "ilike" operator to perform a case-insensitive, partial match on the FAQ question.
 * Returns the answer from the first match found.
 */
export const getManualFAQAnswer = async (clientId, userMessage) => {
  // Sanitize the user's query to remove punctuation and extra spaces.
  const sanitizedMessage = sanitize(userMessage);
  console.log('[faqService] Sanitized user query:', sanitizedMessage);

  // Primary query: search for FAQ rows using the sanitized query.
  let { data, error } = await supabase
    .from('faqs')
    .select('*')
    .eq('clientId', clientId)
    .ilike('question', `%${sanitizedMessage}%`);

  if (error) {
    console.error('[faqService] Error fetching FAQs:', error);
    return null;
  }

  // Log the full fetched FAQs for debugging.
  console.log('[faqService] Fetched FAQs:', data);

  // If there's a match, return the FAQ answer.
  if (data && data.length > 0) {
    console.log(`[faqService] FAQ Match Found: ${data[0].question} → ${data[0].answer}`);
    return data[0].answer;
  }

  // Fallback: if the sanitized query contains "warranty", try a generic warranty search.
  if (sanitizedMessage.includes("warranty")) {
    console.log('[faqService] No direct match found. Trying warranty fallback...');
    ({ data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('clientId', clientId)
      .ilike('question', `%warranty%`));
    if (error) {
      console.error('[faqService] Error fetching FAQs (warranty fallback):', error);
      return null;
    }
    if (data && data.length > 0) {
      console.log(`[faqService] FAQ (warranty fallback) Match Found: ${data[0].question} → ${data[0].answer}`);
      return data[0].answer;
    }
  }

  // If no match is found, return null.
  return null;
};
