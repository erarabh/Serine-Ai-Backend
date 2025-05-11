// server/services/similarityService.js

export const calculateSimilarity = (userMessage, websiteContent) => {
  // Define some keywords relevant to your website.
  const keywords = ["serene smartwatch", "price", "availability", "specifications", "warranty", "return"];
  let matches = 0;
  keywords.forEach(keyword => {
    if (
      userMessage.toLowerCase().includes(keyword) &&
      websiteContent.toLowerCase().includes(keyword)
    ) {
      matches++;
    }
  });
  // For demonstration: each match adds 0.2 to the score.
  return Math.min(0.2 * matches, 1.0);
};

export const extractRelevantInfo = (userMessage, websiteContent) => {
  // For simplicity, return the entire cached content.
  // In production, you could use a more refined extraction mechanism.
  return websiteContent;
};
