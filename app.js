const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const compression = require("compression");
const apiRoutes = require("./routes/api");
const rateLimiter = require("./middlewares/rate.limiter.middleware");

const path = require("path");
const cors = require("cors");
const morgan = require("morgan");


const PORT = process.env.PORT || 3000;
const dotenv = require("dotenv");
dotenv.config();

//-------------------
//connect to database
//-------------------
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to database");
  })
  .catch((err) => {
    console.log("Error connecting to database", err);
    process.exit();
  });
//------------------
//configure app
//------------------

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(compression());
 
//================================================
// Rate limiting global middleware
//================================================
app.use(rateLimiter);

//define routes
app.use("/api/v1", apiRoutes);
app.use("*", (req, res) => {
  res
    .status(404)
    .json([
      {
        status: false,
        message: `The URL ${req.originalUrl} is  not on this server`,
      },
    ]);
});

//start server
app.listen(`${PORT}`, () => {
  console.log(`Server started on port ${PORT}`);
});
