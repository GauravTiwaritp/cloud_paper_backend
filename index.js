const express = require("express");
const app = express();
const connectToDatabase = require("./utils/DataBaseConnection");
const connect = require("mongoose");

const bodyParser = require("body-parser");
const cors = require("cors");
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
const cloudRoutes = require("./routes/cloudSelectionRoutes");
const feedbackRoutes = require("./routes/FeedbackRoutes");

app.use("/api/v1/cloud", cloudRoutes);
app.use("/api/v1/feedback", feedbackRoutes);

if (connectToDatabase) {
  app.listen(3000, () => {
    console.log("server is listening on port 3000");
  });
}
