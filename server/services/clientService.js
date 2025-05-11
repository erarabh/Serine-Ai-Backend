// server/services/clientService.js

export const getClientConfig = async (clientId) => {
  // For demonstration, return a static configuration.
  // In a complete system, this data would come from a database.
  return {
    websiteUrl: "https://html-test-page-wheat.vercel.app"
  };
};
