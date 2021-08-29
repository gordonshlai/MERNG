const { gql } = require("apollo-server");

/**
 * Defines the data structures and queries
 */
module.exports = gql`
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
