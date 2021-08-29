const { model, Schema } = require("mongoose");

/**
 * Handling the validations and default values in GraphQL layer
 */
const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createAt: String,
});

module.exports = model("User", userSchema);
