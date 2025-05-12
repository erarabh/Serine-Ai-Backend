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
      console.log(`Matched keyword: "${keyword}" (Total matches: ${matches})`);
    }
  });
  const simScore = Math.min(0.25 * matches, 1.0);
  console.log(`Calculated similarity score: ${simScore}`);
  return simScore;
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
      const extracted = "Price: " + match[1].trim();
      console.log(`Extracted Price: ${extracted}`);
      return extracted;
    }
  }
  
  // --- Availability extraction ---
  if (lowerQuery.includes("availability") || lowerQuery.includes("available")) {
    const match = websiteContent.match(/[-\s]*Availability:\s*([^\n]+)/i);
    if (match && match[1]) {
      const extracted = "Availability: " + match[1].trim();
      console.log(`Extracted Availability: ${extracted}`);
      return extracted;
    }
  }
  
  // --- Description extraction ---
  if (lowerQuery.includes("description") || lowerQuery.includes("details")) {
    const match = websiteContent.match(/[-\s]*Description:\s*([^\n]+)/i);
    if (match && match[1]) {
      const extracted = "Description: " + match[1].trim();
      console.log(`Extracted Description: ${extracted}`);
      return extracted;
    }
  }
  
  // --- Warranty extraction ---
  if (lowerQuery.includes("warranty")) {
    const match = websiteContent.match(/[-\s]*Warranty:\s*([^\n]+)/i);
    if (match && match[1]) {
      const extracted = "Warranty: " + match[1].trim();
      console.log(`Extracted Warranty: ${extracted}`);
      return extracted;
    }
  }
  
  // --- Product Name extraction ---
  if (lowerQuery.includes("product name") || lowerQuery.includes("name")) {
    const match = websiteContent.match(/[-\s]*Product Name:\s*([^\n]+)/i);
    if (match && match[1]) {
      const extracted = "Product Name: " + match[1].trim();
      console.log(`Extracted Product Name: ${extracted}`);
      return extracted;
    }
  }
  
  console.log("No specific extraction found – returning full website content as fallback.");
  return websiteContent;
};
