// server/services/similarityService.js

/**
 * Calculate a similarity score based on how many keywords appear in both the query and the website content.
 * We have expanded the keywords list to include synonyms for each target field.
 */
export const calculateSimilarity = (userMessage, websiteContent) => {
  // Expanded keywords across multiple fields.
  const keywords = [
    "serene smartwatch", // product identifier
    "price", "cost",     // price synonyms
    "availability", "available", // availability synonyms
    "specifications",    // specs
    "warranty",          // warranty-related
    "return",            // return info
    "product name", "name", "product",  // product name synonyms
    "description", "details"             // description synonyms
  ];
  let matches = 0;
  // For each keyword, if it appears both in the user's query and the website content, count as a match.
  keywords.forEach(keyword => {
    if (
      userMessage.toLowerCase().includes(keyword) &&
      websiteContent.toLowerCase().includes(keyword)
    ) {
      matches++;
    }
  });
  // Each match adds 0.25, capped at 1.0.
  return Math.min(0.25 * matches, 1.0);
};

/**
 * Extracts relevant information from the cached website content based on the query. 
 * We try to use regex to capture specific lines from the cached content if available.
 */
export const extractRelevantInfo = (userMessage, websiteContent) => {
  const lowerQuery = userMessage.toLowerCase();
  
  // --- Extract Price ---
  if (lowerQuery.includes("price") || lowerQuery.includes("cost")) {
    const match = websiteContent.match(/[-\s]*Price:\s*([^\n]+)/i);
    if (match && match[1]) {
      return "Price: " + match[1].trim();
    }
  }
  
  // --- Extract Product Name ---
  // Check for multiple product name synonyms.
  if (
    lowerQuery.includes("product name") ||
    lowerQuery.includes("name") ||
    lowerQuery.includes("product")
  ) {
    const match = websiteContent.match(/[-\s]*Product Name:\s*([^\n]+)/i);
    if (match && match[1]) {
      return "Product Name: " + match[1].trim();
    }
  }
  
  // --- Extract Description ---
  if (lowerQuery.includes("description") || lowerQuery.includes("details")) {
    const match = websiteContent.match(/[-\s]*Description:\s*([^\n]+)/i);
    if (match && match[1]) {
      return "Description: " + match[1].trim();
    }
  }
  
  // --- Extract Availability ---
  if (lowerQuery.includes("availability") || lowerQuery.includes("available")) {
    const match = websiteContent.match(/[-\s]*Availability:\s*([^\n]+)/i);
    if (match && match[1]) {
      return "Availability: " + match[1].trim();
    }
  }
  
  // --- Extract Warranty (if needed) ---
  if (lowerQuery.includes("warranty")) {
    // Sometimes the warranty info is not in a dedicated "Warranty:" field.
    // Here we rely on manual FAQ for warranty. Otherwise, you could extend this part.
    const match = websiteContent.match(/[-\s]*Warranty:\s*([^\n]+)/i);
    if (match && match[1]) {
      return "Warranty: " + match[1].trim();
    }
  }
  
  // If no specific extraction is triggered, return the full cached content.
  return websiteContent;
};
