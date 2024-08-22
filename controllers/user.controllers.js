const user_model = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();

const login_validators =
  require("../middlewares/jwt.auth.middleware").authentication;

//create a new user

exports.create_user = [
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { name, email, password } = req.body;
      const user = await user_model.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }
      const hashed_password = await bcrypt.hash(password, 10);
      const new_user = new user_model({
        name,
        email,
        password: hashed_password,
      });
      const saved_user= await new_user.save();
      saved_user.password = undefined
      res.status(201).json({ status:true,message: "User created successfully",data:saved_user });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
];

/**
 * @api {post} /api/v1/user/login Login a user
 * @apiName LoginUser
 *
 * @req {String} email User email
 * @req {String} password User password
 *
 * This api logs in a user and returns a token for authentication
 */

exports.login_user = [
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { email, password } = req.body;
      const user = await user_model.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const is_valid = await bcrypt.compare(password, user.password);
      if (!is_valid) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const payload = {
        id: user._id.toString(),
        email,
        userID: user.userID,
        ip: req.ip,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.status(200).json({
        staus: true,
        message: "Login successful",
        token: token,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Server error",
      });
    }
  },
];
