const express = require('express');
const app = express();

const userRoutes = require("../routes/user.routes")
const weatherRoutes = require("../routes/weather.routes")




app.use("/user", userRoutes);
app.use("/weather", weatherRoutes);

module.exports = app;