// server/controllers/chatController.js

import { getClientConfig } from '../services/clientService.js';
import { getManualFAQAnswer } from '../services/faqService.js';
import { getCachedWebsiteContent } from '../services/websiteService.js';
import { calculateSimilarity, extractRelevantInfo } from '../services/similarityService.js';

export const processChatRequest = async (clientId, sessionId, userMessage) => {
  try {
    // 1. Retrieve client configuration (for example, website URL)
    const clientConfig = await getClientConfig(clientId);

    // 2. Check for a manual FAQ override (if a match is found, return that answer)
    const manualAnswer = await getManualFAQAnswer(clientId, userMessage);
    if (manualAnswer) {
      return manualAnswer;
    }

    // 3. Retrieve the cached website content for automated matching.
    const websiteContent = await getCachedWebsiteContent(clientConfig.websiteUrl);

    // 4. Calculate a similarity score between the query and website content.
    const similarityScore = calculateSimilarity(userMessage, websiteContent);
    const threshold = 0.5; // Adjust this threshold based on your testing

    if (similarityScore >= threshold) {
      // 5. If the match is strong enough, extract the relevant information and return it.
      const answer = extractRelevantInfo(userMessage, websiteContent);
      return answer;
    }

    // 6. Fallback: if nothing relevant is found, return a default message.
    return "The requested information is not available.";
  } catch (error) {
    console.error("Error in processChatRequest:", error);
    throw error;
  }
};
