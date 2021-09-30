const { AuthenticationError, UserInputError } = require("apollo-server");
const Post = require("../../models/Post");
const checkAuth = require("../../util/check-auth");

module.exports = {
  Mutation: {
    createComment: async (parent, { postId, body }, context) => {
      const { username } = checkAuth(context);

      if (body.trim === "") {
        throw new UserInputError("Empty Comment", {
          errors: {
            body: "Comment body must not empty",
          },
        });
      }

      const post = await Post.findById(postId);
      if (!post) {
        throw new UserInputError("Post not found");
      }

      post.comments.unshift({
        body,
        username,
        createdAt: new Date().toISOString(),
      });
      await post.save();
      return post;
    },

    deleteComment: async (parent, { postId, commentId }, context) => {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);
      if (!post) {
        throw new UserInputError("Post not found");
      }

      const commentIndex = post.comments.findIndex((c) => c.id === commentId);
      if (post.comments[commentIndex].username !== username) {
        throw new AuthenticationError("Action not allowed");
      }

      post.comments.splice(commentIndex, 1);
      await post.save();
      return post;
    },
  },
};
