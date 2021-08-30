const { model, Schema } = require("mongoose");

/**
 * Handling the validations and default values in GraphQL layer
 */
const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String,
});

module.exports = model("User", userSchema);
