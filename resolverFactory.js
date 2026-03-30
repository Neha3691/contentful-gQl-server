/**
 * Resolver Factory
 * 
 * Provides a generic resolver creator that works with contentConfig.js
 * to support multiple Contentful content types without code duplication.
 */

const client = require("./contentfulClient");

/**
 * Helper to safely extract string from localized object
 */
function getString(val) {
  if (!val) return null;
  if (typeof val === "object" && !Array.isArray(val)) {
    const key = Object.keys(val)[0];
    return val[key];
  }
  return val;
}

/**
 * Helper to safely extract boolean from localized object
 */
function getBoolean(val) {
  if (val === null || val === undefined) return false;
  if (typeof val === "boolean") return val;
  if (typeof val === "object" && !Array.isArray(val)) {
    const key = Object.keys(val)[0];
    return val[key] ?? false;
  }
  return !!val;
}

/**
 * Helper to safely extract array from localized object
 */
function getArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "object") {
    const key = Object.keys(val)[0];
    const arr = val[key];
    return Array.isArray(arr) ? arr : [];
  }
  return [];
}

/**
 * Transform resolved linked entries
 * Extracts specified fields and transforms them
 */
async function transformResolvedLinks(rawLinks, linkFields = []) {
  const transformedLinks = [];

  for (const link of rawLinks) {
    if (link?.fields) {
      // Link is already resolved
      const linkObj = {};
      for (const field of linkFields) {
        linkObj[field] = getString(link.fields[field]);
      }
      transformedLinks.push(linkObj);
    } else if (link?.sys?.id) {
      // Link needs to be fetched
      try {
        console.log(`📎 Fetching unresolved link: ${link.sys.id}`);
        const linkedEntry = await client.getEntries({
          'sys.id': link.sys.id,
        });

        if (linkedEntry.items?.[0]?.fields) {
          const linkFields_data = linkedEntry.items[0].fields;
          const linkObj = {};
          for (const field of linkFields) {
            linkObj[field] = getString(linkFields_data[field]);
          }
          transformedLinks.push(linkObj);
        }
      } catch (err) {
        console.error(`❌ Failed to fetch link ${link.sys.id}:`, err.message);
      }
    }
  }

  return transformedLinks;
}

/**
 * Creates a generic Contentful resolver based on config
 * 
 * @param {object} config - Configuration object with contentType, fields, and defaultValues
 * @returns {function} An async resolver function
 */
function createContentfulResolver(config) {
  return async () => {
    try {
      const { contentType, fields, defaultValues } = config;

      // Fetch entries from Contentful
      const entries = await client.getEntries({
        content_type: contentType,
        include: 3, // deep resolve linked entries
      });

      // Handle Contentful wrapper (body/items) & array/object mismatch
      const data = entries?.body || entries;
      const item = Array.isArray(data.items) ? data.items[0] : data.items;

      if (!item) {
        console.warn(`⚠️ No entries found for content type: ${contentType}`);
        return defaultValues;
      }

      // Build result dynamically based on field config
      const result = {};

      for (const [graphqlField, fieldConfig] of Object.entries(fields)) {
        const { source, type, linkFields } = fieldConfig;
        const fieldValue = item.fields[source];

        try {
          if (type === "string") {
            result[graphqlField] = getString(fieldValue);
          } else if (type === "boolean") {
            result[graphqlField] = getBoolean(fieldValue);
          } else if (type === "array") {
            result[graphqlField] = getArray(fieldValue);
          } else if (type === "resolvedLinks") {
            const rawLinks = getArray(fieldValue);
            result[graphqlField] = await transformResolvedLinks(rawLinks, linkFields || []);
          } else {
            // Unknown type, try string as fallback
            console.warn(`⚠️ Unknown field type '${type}' for ${graphqlField}, defaulting to string`);
            result[graphqlField] = getString(fieldValue);
          }
        } catch (fieldError) {
          console.error(`❌ Error processing field '${graphqlField}':`, fieldError.message);
          result[graphqlField] = defaultValues?.[graphqlField] ?? null;
        }
      }

      console.log(`✅ Successfully resolved ${contentType}`);
      return result;
    } catch (error) {
      console.error(`❌ Resolver error for ${config.contentType}:`, error);
      return config.defaultValues;
    }
  };
}

module.exports = { createContentfulResolver };
