const contentful = require("contentful-management");

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

// Export a function that gets entries from the management API
module.exports = {
  async getEntries(query) {
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment('master');
    const entries = await environment.getEntries(query);
    // console.log('enteries-----', entries)
    return entries;
  }
};
