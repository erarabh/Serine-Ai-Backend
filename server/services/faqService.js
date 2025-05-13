// server/services/faqService.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Create __filename and __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env (from ../.env in the project root)
dotenv.config({ path: resolve(__dirname, '..', '.env') });

											  
console.log('[faqService] ENV loaded from:', resolve(__dirname, '..', '.env'));

// Retrieve Supabase credentials
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

											   
console.log('[faqService] SUPABASE_URL:', supabaseUrl);
console.log('[faqService] SUPABASE_KEY present:', !!supabaseKey);

										  
if (!supabaseUrl || !supabaseKey) {
  throw new Error('❌ Missing Supabase credentials. Please check .env configuration.');
}

								 
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Sanitize a string by removing punctuation, extra spaces, and lowercasing.
						 
					   
									  
 */
const sanitize = (str) => {
  return str.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").toLowerCase().trim();
};

/**
 * Retrieves a matching FAQ answer for the given clientId and userMessage.
 * 
 * For debugging purposes, we log:
 * - The clientId received.
 * - The sanitized user query.
 * - The data fetched from Supabase.
 *
 * NOTE: Temporarily comment out the clientId filter to see all rows.
 */
export const getManualFAQAnswer = async (clientId, userMessage) => {
  console.log('[faqService] Received clientId:', clientId);
  const sanitizedMessage = sanitize(userMessage);
  console.log('[faqService] Sanitized user query:', sanitizedMessage);

  // For debugging: temporarily remove or comment the clientId filter to inspect FAQ rows
  let { data, error } = await supabase
    .from('faqs')
    // .eq('clientId', clientId)  // COMMENT THIS OUT for debugging if needed.
							   
    .ilike('question', `%${sanitizedMessage}%`);

  if (error) {
    console.error('[faqService] Error fetching FAQs:', error);
    return null;
  }

										
  console.log('[faqService] Fetched FAQs:', data);

  // Uncomment the following lines when you confirm that the data returned is correct.
  // If data is empty, that means the filter on the question is not matching.
  if (data && data.length > 0) {
    console.log(`[faqService] FAQ Match Found: ${data[0].question} → ${data[0].answer}`);
    return data[0].answer;
  }

  // Fallback: if the sanitized query includes "warranty", try a fallback search.
  if (sanitizedMessage.includes("warranty")) {
    console.log('[faqService] No direct match found. Trying warranty fallback...');
    ({ data, error } = await supabase
      .from('faqs')
      // .eq('clientId', clientId)  // COMMENT THIS OUT for debugging if needed.
								 
      .ilike('question', `%warranty%`));
    if (error) {
      console.error('[faqService] Error in warranty fallback:', error);
      return null;
    }
    if (data && data.length > 0) {
      console.log(`[faqService] FAQ (warranty fallback) Match Found: ${data[0].question} → ${data[0].answer}`);
      return data[0].answer;
    }
  }

						
  return null;
};
