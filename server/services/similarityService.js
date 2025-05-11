// server/services/similarityService.js

/**
 * Calculate a similarity score based on how many keywords appear in both the query and the website content.
 * The keywords array contains synonyms and relevant words for different fields.
 */
export const calculateSimilarity = (userMessage, websiteContent) => {
  const keywords = [
    "serene smartwatch",
    "price", "cost",
    "availability", "available",
    "specifications",
    "warranty",
    "return",
    "product name", "name", "product",
    "description", "details"
  ];
  let matches = 0;
  keywords.forEach(keyword => {
    if (
      userMessage.toLowerCase().includes(keyword) &&
      websiteContent.toLowerCase().includes(keyword)
    ) {
      matches++;
    }
  });
  // Each match adds 0.25 to the score, capped at 1.0.
  return Math.min(0.25 * matches, 1.0);
};

/**
 * Extract relevant information from the cached website content based on the query.
 * The conditions are ordered from most specific to more generic to avoid conflicts.
 */
export const extractRelevantInfo = (userMessage, websiteContent) => {
  const lowerQuery = userMessage.toLowerCase();
  
  // --- Price extraction ---
  if (lowerQuery.includes("price") || lowerQuery.includes("cost")) {
    const match = websiteContent.match(/[-\s]*Price:\s*([^\n]+)/i);
    if (match && match[1]) {
      return "Price: " + match[1].trim();
    }
  }
  
  // --- Availability extraction ---
  if (lowerQuery.includes("availability") || lowerQuery.includes("available")) {
    const match = websiteContent.match(/[-\s]*Availability:\s*([^\n]+)/i);
    if (match && match[1]) {
      return "Availability: " + match[1].trim();
    }
  }
  
  // --- Description extraction ---
  if (lowerQuery.includes("description") || lowerQuery.includes("details")) {
    const match = websiteContent.match(/[-\s]*Description:\s*([^\n]+)/i);
    if (match && match[1]) {
      return "Description: " + match[1].trim();
    }
  }
  
  // --- Warranty extraction ---
  if (lowerQuery.includes("warranty")) {
    // If there is a dedicated Warranty field in the content, extract it.
    const match = websiteContent.match(/[-\s]*Warranty:\s*([^\n]+)/i);
    if (match && match[1]) {
      return "Warranty: " + match[1].trim();
    }
  }
  
  // --- Product Name extraction ---
  // Check for "product name" or "name" here last to avoid interfering with more specific queries.
  if (lowerQuery.includes("product name") || lowerQuery.includes("name")) {
    const match = websiteContent.match(/[-\s]*Product Name:\s*([^\n]+)/i);
    if (match && match[1]) {
      return "Product Name: " + match[1].trim();
    }
  }
  
  // If none of the specific fields are detected, return the full website content as fallback.
  return websiteContent;
};
