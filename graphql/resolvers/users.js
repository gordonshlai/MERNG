const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../util/validators");
const { SECRET_KEY } = require("../../config");
const User = require("../../models/User");

const generateToken = (user) =>
  jwt.sign(
    {
      // fields that endoded with the jwt
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

module.exports = {
  Mutation: {
    login: async (parent, { username, password }) => {
      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({ username }); // 'username' is the paramter to be filter against
      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong credentials";
        throw new UserInputError("Wrong credentials", { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },

    /**
     * User registration
     * @param {Object} parent inputs from the last resolver
     * @param {Object} args inputs from the current mutation (destructured)
     */
    register: async (
      parent,
      { registerInput: { username, email, password, confirmPassword } }
    ) => {
      // TODO: validate user data
      const { errors, valid } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Error", { errors });
      }

      // TODO: Make sure user doesn't already exsist
      const user = User.findOne({ username }); // 'username' is the paramter to be filter against
      if (user) {
        throw new UserInputError("Username is taken", {
          errors: {
            username: "This username is taken", // for the front to display
          },
        });
      }

      // TODO: Hash password and create an auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      // Save the new user to the database
      const res = await newUser.save();

      // generate the jwt
      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
