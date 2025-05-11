// server/services/faqService.js

// Hard-coded manual FAQ database.
const faqDatabase = {
  "what are the product specifications": "The Serene Smartwatch features a 1.5-inch AMOLED display, 10-hour battery life, and supports both iOS and Android.",
  "what is the return policy": "Returns are accepted within 30 days of purchase with a valid receipt.",
  "what is the warranty period": "The product comes with a 2-year warranty covering manufacturing defects."
};

export const getManualFAQAnswer = async (clientId, userMessage) => {
  const lowerMessage = userMessage.toLowerCase();
  // Simple matching: check if the query contains any FAQ keys.
  for (const question in faqDatabase) {
    if (lowerMessage.includes(question)) {
      return faqDatabase[question];
    }
  }
  return null;
};
