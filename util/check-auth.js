const { AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");

const { SECRET_KEY } = require("../config");

/**
 * Check the whether the user is authenticated.
 *
 * @param {Object} context the http req object
 * @returns Authenicated User object
 */
module.exports = (context) => {
  const authHeader = context.req.headers.authorization;
  if (!authHeader) {
    throw new Error("Authorization header must be provided");
  }

  // split() returns a list of strings
  // so [1] is the second part, which is the jwt
  const token = authHeader.split("Bearer ")[1];
  if (!token) {
    throw new Error("Authentication token must be 'Bearer [token]'"); // token in wrong format
  }

  try {
    return jwt.verify(token, SECRET_KEY); // return the User. Go to catch block if failed.
  } catch (error) {
    throw new AuthenticationError("Invalid/Expired token");
  }
};
