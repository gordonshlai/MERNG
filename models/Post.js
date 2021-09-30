const { model, Schema } = require("mongoose");

/**
 * Handling the validations and default values in GraphQL layer
 */
const postSchema = new Schema({
  body: String,
  username: String,
  createdAt: String,
  comments: [
    {
      body: String,
      username: String,
      createdAt: String,
    },
  ],
  likes: [
    {
      username: String,
      createdAt: String,
    },
  ],
  user: {
    // this allow use to use mongoose methods to pre-populate the user field
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = model("Post", postSchema);
