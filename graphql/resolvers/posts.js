const { AuthenticationError } = require("apollo-server");

const Post = require("../../models/Post");
const checkAuth = require("../../util/check-auth");

/**
 * For each query, mutation or subscription, they has its corresponding
 * resolver, and execute the logics then return the query
 */
module.exports = {
  Query: {
    getPosts: async () => {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },

    getPost: async (parent, { postId }) => {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },

  Mutation: {
    createPost: async (parent, { body }, context) => {
      const user = checkAuth(context);

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();

      return post;
    },

    deletePost: async (parent, { postId }, context) => {
      const user = checkAuth(context);
      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.delete();
          return "Post deleted sucessfully";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (error) {
        throw new Error(error);
      }
    },

    // Toggle the user that likes a post
    likePost: async (parent, { postId }, context) => {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);
      if (!post) {
        throw new UserInputError("Post not found");
      }

      if (post.likes.find((like) => like.username === username)) {
        // Post already liked, unlike it
        post.likes = post.likes.filter((like) => like.username !== username);
      } else {
        // Not liked, like post
        post.likes.push({
          username,
          createdAt: new Date().toISOString(),
        });
      }

      await post.save();
      return post;
    },
  },
};
