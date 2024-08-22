const express = require('express');
const router = express.Router();

const weather_controller = require("../controllers/weater.controllers")

router.get("/get-weather", weather_controller.getWeather)

module.exports = router;