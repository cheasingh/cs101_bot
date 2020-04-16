require("dotenv").config();
const fetch = require("isomorphic-unfetch");
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TELEGRAM_BOT;

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
