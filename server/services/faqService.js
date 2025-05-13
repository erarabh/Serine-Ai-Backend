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
 * Helper function to sanitize a string:
 * - removes punctuation,
 * - extra spaces, and,
 * - converts the string to lowercase.
 */
const sanitize = (str) => {
  return str.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").toLowerCase().trim();
};

/**
 * Retrieves a matching FAQ answer for the given clientId and userMessage.
 * Uses the "ilike" operator for a case-insensitive, partial match on the FAQ question.
 * Updates:
 * - The query now references the "clientId" column using double quotes (".eq('"clientId"', ...)")
 *   so that PostgreSQL matches the case-sensitive column name.
 * - If no direct match is found, and if the sanitized query includes "warranty",
 *   a fallback query searches generically for "warranty".
 */
export const getManualFAQAnswer = async (clientId, userMessage) => {
  // Sanitize the user query.
  const sanitizedMessage = sanitize(userMessage);
  console.log('[faqService] Sanitized user query:', sanitizedMessage);

  // Primary query: Note the use of .eq('"clientId"', clientId) for a case-sensitive match.
  let { data, error } = await supabase
    .from('faqs')
    .select('*')
    .eq('"clientId"', clientId)
    .ilike('question', `%${sanitizedMessage}%`);

  if (error) {
    console.error('[faqService] Error fetching FAQs:', error);
    return null;
  }

  // Log the fetched FAQs for debugging.
  console.log('[faqService] Fetched FAQs:', data);

  // If found, return the answer.
  if (data && data.length > 0) {
    console.log(`[faqService] FAQ Match Found: ${data[0].question} → ${data[0].answer}`);
    return data[0].answer;
  }

  // Fallback: if the sanitized query contains "warranty", try a fallback query using "%warranty%".
  if (sanitizedMessage.includes("warranty")) {
    console.log('[faqService] No direct match found. Trying warranty fallback...');
    ({ data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('"clientId"', clientId)
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

  // No FAQ match found.
  return null;
};
