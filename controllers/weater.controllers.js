const axios = require("axios");
login_validator = require("../middlewares/jwt.auth.middleware").authentication;
const express_validator = require("express-validator");

const redis = require("redis");
const promisify = require("util").promisify;

const redisClient = redis.createClient(
  17411,
  "redis-17411.c91.us-east-1-3.ec2.redns.redis-cloud.com",

  { no_ready_check: true }
);
redisClient.auth("FX9jwSCjPpWiva4JlX138FQWcyRilX6I", function (err) {
  if (err) throw err;
});
redisClient.on("connect", async function () {
  console.log("Connected to Redis...");
});

const GET_ASYNC = promisify(redisClient.get).bind(redisClient);
const SET_ASYNC = promisify(redisClient.set).bind(redisClient);

exports.getWeather = [
  login_validator,
  async (req, res) => {
    try {
      const errors = express_validator.validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      let city = req.body.city;
      let cacheKey = city;
      //check if data is in cache
      const cachedData = await GET_ASYNC(JSON.parse(cacheKey));
      if (cachedData) {
        return res.status(200).send({
          status: true,
          message: `Sucessfully city ${city} Temp fetched.`,
          data: JSON.parse(cachedData),
        });
      }

      let resp = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=c26e14196127f9967e40189dbac1d919&units=metric`
      );

      if (!resp) {
        return res
          .status(400)
          .send({ status: false, message: "City not found" });
      }

      let obj = {
        city: city,
        temp: resp.data.main.temp,
      };

      //save data to cache WITH an expiry of 15 minute
      await SET_ASYNC(cacheKey, JSON.stringify(obj), "EX", 900);

      return res.status(200).send({
        status: true,
        message: `Sucessfully city ${city} Temp fetched.`,
        data: obj,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ status: false, msg: "server error", error: error.message });
    }
  },
];
