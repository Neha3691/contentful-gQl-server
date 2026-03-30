# Contentful GraphQL Server

A simple GraphQL server that fetches content from Contentful and exposes it through a custom GraphQL API.

This project uses Node.js, Apollo Server, and the Contentful SDK.

---

# Architecture

Client applications (Web, Mobile, React, etc.) send GraphQL queries to a custom GraphQL server.
The server retrieves data from Contentful and returns it in a structured format.

```
Client (React / Web / Mobile)
        |
     GraphQL
        |
Your GraphQL Server
        |
Contentful API
```

---

# Prerequisites

Before starting, ensure you have:

* Node.js (v16 or higher)
* npm or yarn
* Contentful account
* Contentful Space ID
* Contentful Content Delivery API token

You can obtain the Space ID and Access Token from:

Contentful → Settings → API Keys

---

# Project Setup

## 1. Create Project

```
mkdir contentful-graphql-server
cd contentful-graphql-server
npm init -y
```

---

## 2. Install Dependencies

```
npm install apollo-server graphql contentful dotenv
```

Dependencies used:

* apollo-server → GraphQL server
* graphql → GraphQL query engine
* contentful → SDK for fetching content
* dotenv → environment variable support

---

# Environment Variables

Create a `.env` file in the root directory.

```
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
PORT=4000
```

---

# Project Structure

```
contentful-graphql-server
│
├── index.js
├── schema.js
├── resolvers.js
├── contentfulClient.js
├── .env
└── package.json
```

---

# Contentful Client Setup

Create `contentfulClient.js`.

```
const contentful = require("contentful");

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

module.exports = client;
```

This file creates a client to interact with the Contentful API.

---

# GraphQL Schema

Create `schema.js`.

```
const { gql } = require("apollo-server");

const typeDefs = gql`
  type BlogPost {
    title: String
    slug: String
    body: String
  }

  type Query {
    posts: [BlogPost]
  }
`;

module.exports = typeDefs;
```

This schema defines a `BlogPost` type and a `posts` query.

---

# Resolvers

Create `resolvers.js`.

```
const client = require("./contentfulClient");

const resolvers = {
  Query: {
    posts: async () => {
      const entries = await client.getEntries({
        content_type: "blogPost",
      });

      return entries.items.map((item) => ({
        title: item.fields.title,
        slug: item.fields.slug,
        body: item.fields.body,
      }));
    },
  },
};

module.exports = resolvers;
```

Resolvers fetch data from Contentful and map it to GraphQL fields.

---

# GraphQL Server Setup

Create `index.js`.

```
require("dotenv").config();
const { ApolloServer } = require("apollo-server");

const typeDefs = require("./schema");
const resolvers = require("./resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen({ port: process.env.PORT }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
```

---

# Run the Server

Start the server using:

```
node index.js
```

GraphQL Playground will be available at:

```
http://localhost:4000
```

---

# Example Query

```
query {
  posts {
    title
    slug
    body
  }
}
```

---

# Alternative: Using Contentful GraphQL API Directly

Contentful provides a built-in GraphQL endpoint.

Example endpoint:

```
https://graphql.contentful.com/content/v1/spaces/{SPACE_ID}
```

Example query:

```
{
  blogPostCollection {
    items {
      title
      slug
    }
  }
}
```

---

# When to Use a Custom GraphQL Server

Create a custom server when you need:

* Hide API keys
* Combine multiple APIs
* Add authentication
* Add caching
* Implement business logic
* Transform data before sending to clients

---

# Production Best Practices

* Use environment variables for secrets
* Add caching (Redis)
* Implement rate limiting
* Add logging and monitoring
* Use authentication middleware

Deployment options include:

* Vercel
* AWS
* Render
* Docker containers

---

# Future Improvements

Possible improvements for this project:

* Add pagination
* Add filtering support
* Add authentication
* Add Redis caching
* Auto-generate schema from Contentful models
* Add TypeScript support

---

# License

MIT License
