const axios = require("axios");
login_validator = require("../middlewares/jwt.auth.middleware").authentication;
const express_validator = require("express-validator");

exports.getWeather = [
  login_validator,
  async (req, res) => {
    try {
      const errors = express_validator.validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      let city = req.body.city;

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
