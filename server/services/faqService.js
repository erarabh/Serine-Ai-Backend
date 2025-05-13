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

// Debug log (optional - remove in production)
console.log('[faqService] SUPABASE_URL:', supabaseUrl);
console.log('[faqService] SUPABASE_KEY present:', !!supabaseKey);

// Validate required environment variables
if (!supabaseUrl || !supabaseKey) {
  throw new Error('❌ Missing Supabase credentials. Please check .env configuration.');
}

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Retrieves a matching FAQ answer for the given clientId and userMessage.
 * This version uses Supabase's "ilike" operator to perform a case-insensitive, partial match on the FAQ question.
 *
 * Example: A user query "warranty period" will match a FAQ with "What is the warranty period?".
 */
export const getManualFAQAnswer = async (clientId, userMessage) => {
  const lowerMessage = userMessage.toLowerCase();

  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .eq("clientId", clientId)
    .ilike('question', `%${lowerMessage}%`);

  if (error) {
    console.error('[faqService] Error fetching FAQs:', error);
    return null;
  }

  if (data && data.length > 0) {
    console.log(`FAQ Match Found: ${data[0].question} → ${data[0].answer}`);
															
						
	 
																						   
															
    return data[0].answer;
	  
  }

  return null;
};
