const { gql } = require("apollo-server");

/**
 * Defines the data structures and queries
 * '!' means require field when inputting the data to the database
 * The Type after the ':' in the Mutations are the type to be returned
 *
 * If the retrun type is wrapped in '[]', it returns a list of that type
 */
module.exports = gql`
  type Post {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
  }
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
  }
`;
