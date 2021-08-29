const Post = require("../../models/Post");
/**
 * For each query, mutation or subscription, they has its corresponding
 * resolver, and execute the logics then return the query
 */
module.exports = {
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
