const { gql } = require("apollo-server");

const typeDefs = gql`
  type OpenTime {
    dayRange: String
    timeRange: String
  }


  type Link {
    text: String
    externalUrl: String
    inverse: Boolean
  }

  type ContactUsFlyout {
    contentEntryKey: String
    chatOptionsHeading: String
    chatOptionsSubText: String
    chatOptionsOpenTimesAdvanced: [OpenTime]
    phoneOptionsHeading: String
    phoneOptionsSubText: String
    phoneNumber: String
    phoneOptionsOpenTimesAdvanced: [OpenTime]
    infoSectionHeading: String
    infoSectionLinks: [Link]
  }

  type Query {
    contactUsFlyout: ContactUsFlyout
  }
`;

module.exports = typeDefs;