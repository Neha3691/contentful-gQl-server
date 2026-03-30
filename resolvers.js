const client = require("./contentfulClient");

const resolvers = {
  Query: {
    contactUsFlyout: async () => {
      try {
        // Fetch entries from Contentful
        const entries = await client.getEntries({
          content_type: "contactUsFlyout",
          include: 3, // deep resolve linked entries
        });

        // Handle Contentful wrapper (body/items) & array/object mismatch
        const data = entries?.body || entries;
        const item = Array.isArray(data.items) ? data.items[0] : data.items;

        if (!item) return null;

        // Helper to safely extract string from localized object
        const getString = (val) => {
          if (!val) return null;
          if (typeof val === "object" && !Array.isArray(val)) {
            const key = Object.keys(val)[0];
            return val[key];
          }
          return val;
        };

        // Helper to safely extract boolean from localized object
        const getBoolean = (val) => {
          if (val === null || val === undefined) return false;
          if (typeof val === "boolean") return val;
          if (typeof val === "object" && !Array.isArray(val)) {
            const key = Object.keys(val)[0];
            return val[key] ?? false;
          }
          return !!val;
        };

        // Helper to safely extract array from localized object
        const getArray = (val) => {
          if (!val) return [];
          if (Array.isArray(val)) return val;

          if (typeof val === "object") {
            const key = Object.keys(val)[0];
            const arr = val[key];
            return Array.isArray(arr) ? arr : [];
          }
          return [];
        };

        // Extract infoSectionLinks safely
        console.log("🔍 Raw infoSectionLinks:", JSON.stringify(item.fields.infoSectionLinks, null, 2));
        
        // First extract the array (handles { 'en-GB': [...] } structure)
        let rawLinks = getArray(item.fields.infoSectionLinks);
        console.log("🔍 After getArray:", rawLinks.length, "items");
        
        // If links are not resolved (only have sys.id), fetch them manually
        const transformedLinks = [];
        for (const link of rawLinks) {
          if (link?.fields) {
            // Link is already resolved
            transformedLinks.push({
              text: getString(link.fields.text),
              externalUrl: getString(link.fields.externalUrl),
              inverse: getBoolean(link.fields.inverse),
            });
          } else if (link?.sys?.id) {
            // Link needs to be fetched
            try {
              console.log("🔍 Fetching unresolved link:", link.sys.id);
              const linkedEntry = await client.getEntries({
                'sys.id': link.sys.id,
              });
              
              if (linkedEntry.items && linkedEntry.items[0]?.fields) {
                const linkFields = linkedEntry.items[0].fields;
                transformedLinks.push({
                  text: getString(linkFields.text),
                  externalUrl: getString(linkFields.externalUrl),
                  inverse: getBoolean(linkFields.inverse),
                });
              }
            } catch (err) {
              console.error("❌ Failed to fetch link:", link.sys.id, err.message);
            }
          }
        }
        
        console.log("✅ Final transformed links count:", transformedLinks.length);

        // Return final ContactUsFlyout object
        return {
          contentEntryKey: getString(item.fields.contentEntryKey),
          chatOptionsHeading: getString(item.fields.chatOptionsHeading),
          chatOptionsSubText: getString(item.fields.chatOptionsSubText),
          chatOptionsOpenTimesAdvanced: getArray(
            item.fields.chatOptionsOpenTimesAdvanced
          ),
          phoneOptionsHeading: getString(item.fields.phoneOptionsHeading),
          phoneOptionsSubText: getString(item.fields.phoneOptionsSubText),
          phoneNumber: getString(item.fields.phoneNumber),
          phoneOptionsOpenTimesAdvanced: getArray(
            item.fields.phoneOptionsOpenTimesAdvanced
          ),
          infoSectionHeading: getString(item.fields.infoSectionHeading),
          infoSectionLinks: transformedLinks,
        };
      } catch (error) {
        console.error("❌ Resolver error:", error);

        // Safe fallback to prevent 503 or crashes
        return {
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
        };
      }
    },
  },
};

module.exports = resolvers;