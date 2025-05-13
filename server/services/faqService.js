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
console.log('[faqService] ENV loaded from:', resolve(__dirname, '..', '.env'));

// Retrieve Supabase credentials from .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
console.log('[faqService] SUPABASE_URL:', supabaseUrl);
console.log('[faqService] SUPABASE_KEY present:', !!supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  throw new Error('❌ Missing Supabase credentials. Please check .env configuration.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Helper function to sanitize a string:
 * - removes punctuation,
 * - extra spaces,
 * - converts to lowercase.
 */
const sanitize = (str) => {
  return str.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").toLowerCase().trim();
};

/**
 * Retrieves a matching FAQ answer for the given clientId and userMessage.
 * Uses .eq() along with .filter() using the 'ilike' operator for a case-insensitive match.
 * Falls back to a generic "warranty" search if no match is found.
 */
export const getManualFAQAnswer = async (clientId, userMessage) => {
  console.log('[faqService] Received clientId:', clientId);
  const sanitizedMessage = sanitize(userMessage);
  console.log('[faqService] Sanitized user query:', sanitizedMessage);

  // Primary query: filter by clientId and perform an ilike search over question.
  let { data, error } = await supabase
    .from('faqs')
    .select('*')
    .eq('clientId', clientId)
    .filter('question', 'ilike', `%${sanitizedMessage}%`);

  if (error) {
    console.error('[faqService] Error fetching FAQs:', error);
    return null;
  }

  console.log('[faqService] Fetched FAQs:', data);

  if (data && data.length > 0) {
    console.log(`[faqService] FAQ Match Found: ${data[0].question} → ${data[0].answer}`);
    return data[0].answer;
  }

  // Fallback: if the sanitized query includes "warranty", try a generic warranty search.
  if (sanitizedMessage.includes("warranty")) {
    console.log('[faqService] No direct match found. Trying warranty fallback...');
    ({ data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('clientId', clientId)
      .filter('question', 'ilike', `%warranty%`));

    if (error) {
      console.error('[faqService] Error fetching FAQs (warranty fallback):', error);
      return null;
    }
    if (data && data.length > 0) {
      console.log(`[faqService] FAQ (warranty fallback) Match Found: ${data[0].question} → ${data[0].answer}`);
      return data[0].answer;
    }
  }

  return null;
};
