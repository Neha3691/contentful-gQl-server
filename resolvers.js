const { createContentfulResolver } = require("./resolverFactory");
const contentConfigs = require("./contentConfig");

const resolvers = {
  Query: {
    // Generic resolver for contactUsFlyout
    contactUsFlyout: createContentfulResolver(contentConfigs.contactUsFlyout),

    // Easy to add more content types - just add to contentConfig.js and here:
    // blogPost: createContentfulResolver(contentConfigs.blogPost),
    // product: createContentfulResolver(contentConfigs.product),
  },
};

module.exports = resolvers;