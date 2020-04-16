require("dotenv").config();
const fetch = require("isomorphic-unfetch");
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TELEGRAM_BOT;
const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

const bot = new TelegramBot(token, { polling: true });
const nasaAPI = process.env.NASA_API;

function fetchNasa() {
  return fetch(`https://api.nasa.gov/planetary/apod?api_key=${nasaAPI}`)
    .then((rawData) => rawData.json())
    .then((data) => {
      return data;
    });
}

bot.on("message", (msg) => {
  let Hi = "hi";
  if (msg.text.toString().toLowerCase().indexOf(Hi) === 0) {
    bot.sendMessage(msg.chat.id, `hello there, ${msg.chat.first_name}`);
  }
});

bot.on("message", (msg) => {
  fetchNasa().then((data) => {
    if (msg.text.toString().toLowerCase() === "image") {
      bot.sendMessage(
        msg.chat.id,
        `${msg.chat.first_name}, image ${data.title} here is your picture ${data.url}`
      );
    }
  });
});

bot.on("polling_error", (err) => console.log(err));

// viewed at http://localhost:3000
app.get("/", function (req, res) {
  res.send("telegramBot is now starting");
});

app.listen(port, () => console.log(`telegramBot start on port ${port}!`));
