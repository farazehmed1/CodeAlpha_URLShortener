const express = require("express");
const mongoose = require("mongoose");
const shortid = require("shortid");
const cors = require("cors");

const Url = require("./models/Url");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/urlshortener")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.post("/shorten", async (req, res) => {
  const { longUrl } = req.body;

  const urlCode = shortid.generate();

  const shortUrl = `http://localhost:5000/${urlCode}`;

  const newUrl = new Url({
    longUrl,
    shortUrl,
    urlCode
  });

  await newUrl.save();

  res.json(newUrl);
});

app.get("/:code", async (req, res) => {
  const url = await Url.findOne({ urlCode: req.params.code });

  if (url) {
    return res.redirect(url.longUrl);
  }

  return res.status(404).json("URL not found");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});