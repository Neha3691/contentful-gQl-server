/**
 * Content Configuration
 * 
 * Maps Contentful content types to GraphQL fields with type information.
 * This allows the resolver factory to work generically with any content type.
 * 
 * Field structure:
 * - source: the Contentful field name
 * - type: 'string' | 'boolean' | 'array' | 'resolvedLinks' | 'custom'
 * - transform: (optional) custom transformation function
 */

const contentConfigs = {
  contactUsFlyout: {
    contentType: "contactUsFlyout",
    defaultValues: {
      contentEntryKey: null,
      chatOptionsHeading: null,
      chatOptionsSubText: null,
      chatOptionsOpenTimesAdvanced: [],
      phoneOptionsHeading: null,
      phoneOptionsSubText: null,
      phoneNumber: null,
      phoneOptionsOpenTimesAdvanced: [],
      infoSectionHeading: null,
      infoSectionLinks: [],
    },
    fields: {
      contentEntryKey: { source: "contentEntryKey", type: "string" },
      chatOptionsHeading: { source: "chatOptionsHeading", type: "string" },
      chatOptionsSubText: { source: "chatOptionsSubText", type: "string" },
      chatOptionsOpenTimesAdvanced: { source: "chatOptionsOpenTimesAdvanced", type: "array" },
      phoneOptionsHeading: { source: "phoneOptionsHeading", type: "string" },
      phoneOptionsSubText: { source: "phoneOptionsSubText", type: "string" },
      phoneNumber: { source: "phoneNumber", type: "string" },
      phoneOptionsOpenTimesAdvanced: { source: "phoneOptionsOpenTimesAdvanced", type: "array" },
      infoSectionHeading: { source: "infoSectionHeading", type: "string" },
      infoSectionLinks: {
        source: "infoSectionLinks",
        type: "resolvedLinks",
        linkFields: ["text", "externalUrl", "inverse"],
      },
    },
  },

  // Example: Add more content types here
//   blogPost: {
//     contentType: "blogPost",
//     defaultValues: {
//       title: null,
//       slug: null,
//       content: null,
//       tags: [],
//       published: false,
//     },
//     fields: {
//       title: { source: "title", type: "string" },
//       slug: { source: "slug", type: "string" },
//       content: { source: "body", type: "string" },
//       tags: { source: "tags", type: "array" },
//       published: { source: "isPublished", type: "boolean" },
//     },
//   },

//   // Example: Product content type
//   product: {
//     contentType: "product",
//     defaultValues: {
//       name: null,
//       description: null,
//       price: null,
//       inStock: false,
//       images: [],
//     },
//     fields: {
//       name: { source: "productName", type: "string" },
//       description: { source: "productDescription", type: "string" },
//       price: { source: "productPrice", type: "string" },
//       inStock: { source: "availability", type: "boolean" },
//       images: { source: "productImages", type: "array" },
//     },
//   },
};

module.exports = contentConfigs;
