const { ApolloServer } = require("apollo-server");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");
const gql = require("graphql-tag");
const mongoose = require("mongoose");

const Post = require("./models/Post");
const { MONGODB } = require("./config");

/**
 * Defines the data structures and queries
 */
const typeDefs = gql`
  type Post {
    id: ID!
    body: String!
    username: String!
    createAt: String!
  }
  type Query {
    getPosts: [Post]
  }
`;

/**
 * For each query, mutation or subscription, they has its corresponding
 * resolver, and execute the logics then return the query
 */
const resolvers = {
  Query: {
    getPosts: async () => {
      try {
        const posts = await Post.find();
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};

/**
 * Apollo server uses express server behind the scene
 */
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB Connected");
    return server.listen({ port: 5000 });
  })
  .then((res) => console.log(`server running at ${res.url}`))
  .catch((error) => console.log(error));
