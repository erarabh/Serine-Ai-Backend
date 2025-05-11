// server/services/websiteService.js

let cachedContent = null;

export const getCachedWebsiteContent = async (websiteUrl) => {
  // For demonstration, we simulate the cached content if not already set.
  if (!cachedContent) {
    cachedContent = `
Product Information:
- Product Name: Serene Smartwatch
- Description: A cutting-edge smartwatch designed for busy professionals.
- Price: $29.99
- Availability: In Stock

Frequently Asked Questions:
Q: What are the product specifications?
A: The Serene Smartwatch features a 1.5-inch AMOLED display, 10-hour battery life, and supports both iOS and Android.
Q: What is the warranty period?
A: The product comes with a 2-year warranty.
Q: What is the return policy?
A: Returns are accepted within 30 days of purchase with a valid receipt.
    `;
  }
  return cachedContent;
};
