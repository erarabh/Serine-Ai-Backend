// server/services/similarityService.js

// Calculate a similarity score based on how many keywords are present in both the query and the website content.
export const calculateSimilarity = (userMessage, websiteContent) => {
  // Expanded keywords array to cover different phrasings.
  const keywords = [
    "serene smartwatch",
    "price",
    "availability",
    "specifications",
    "warranty",
    "return",
    "product name",
    "description"
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
  // Each match adds 0.25 to the score, capped at 1.0
  return Math.min(0.25 * matches, 1.0);
};

// Extract relevant information from the cached website content based on the query.
// This function uses simple regex patterns to capture the desired line.
export const extractRelevantInfo = (userMessage, websiteContent) => {
  const lowerQuery = userMessage.toLowerCase();
  
  // Look for "price" keyword.
  if (lowerQuery.includes("price")) {
    const match = websiteContent.match(/[-\s]*Price:\s*([^\n]+)/i);
    if (match && match[1]) {
      return "Price: " + match[1].trim();
    }
  }
  
  // Look for "product name". We also check for "name" to catch different phrasings.
  if (lowerQuery.includes("product name") || lowerQuery.includes("name")) {
    const match = websiteContent.match(/[-\s]*Product Name:\s*([^\n]+)/i);
    if (match && match[1]) {
      return "Product Name: " + match[1].trim();
    }
  }
  
  // Look for "description".
  if (lowerQuery.includes("description")) {
    const match = websiteContent.match(/[-\s]*Description:\s*([^\n]+)/i);
    if (match && match[1]) {
      return "Description: " + match[1].trim();
    }
  }
  
  // Look for "availability".
  if (lowerQuery.includes("availability") || lowerQuery.includes("available")) {
    const match = websiteContent.match(/[-\s]*Availability:\s*([^\n]+)/i);
    if (match && match[1]) {
      return "Availability: " + match[1].trim();
    }
  }
  
  // If no specific extraction was possible, fallback to returning the full website content.
  return websiteContent;
};
