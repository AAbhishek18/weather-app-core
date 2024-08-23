/**
 * Rate limiter implementation
 * max req :50
 * windowMs: 1 minute
 * message: "Too many requests, please try again later."
 * statusCode: 429
 * @module rateLimiter
 * @requires express-rate-limit
 *
 */
const rateLimit = require("express-rate-limit");

const userKey = (req) => {
  const ip = req.ip;
  const userID = req.user ? req.user.userID : "unauthenticated";
  return `${userID}-${ip}`;
};

const rateLimiter = rateLimit({
  max: 50,
  windowMs: 1 * 60 * 1000,
  keyGenerator: userKey,

  message: "Too many requests, please try again later.",
  statusCode: 429,
});

module.exports = rateLimiter;
