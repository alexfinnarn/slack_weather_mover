const process = require('process');
const fetch = require('node-fetch');

// You can get your webhook URL from https://api.slack.com/apps/AGG232BPT/incoming-webhooks
const inboundWebhookURL = 'https://hooks.slack.com/services/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';

// Base URL for an API request with query parameters.
const openWeatherURL = 'http://api.openweathermap.org/data/2.5/weather';

// Search for your city and then look in the URL for the ID.
// ex. https://openweathermap.org/city/4188985 the ID is 4188985.
const cityID = 4509177;

// Taken from https://home.openweathermap.org/api_keys.
const appID = 'ee348e507eb85891c92b014d5bbd607f';

// These are just sample phrases to check for in the weather descriptions.
const goodVibes = [
  'sun',
  'clear',
];
const badTimes = [
  'snow',
  'rain'
];

// This is the default decision for when the weather description doesn't contain good or bad vibes.
let decision = {
  text: 'Who knows what\'s going on outside. Life is meaningless. Think about that.',
  image: 'http://deansomerset.com/wp-content/uploads/2014/02/shoulder-shrug.jpg',
};

// I'm using OpenWeatherMap's API for fetching the weather data.
// https://openweathermap.org/api.
function getWeather() {
  fetch(`${openWeatherURL}?id=${cityID}&APPID=${appID}`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
  }).then(resp => resp.json())
    .then((data) => {
      if (typeof data.weather[0].description !== 'undefined') {

        if (goodVibes.find(el => data.weather[0].description.includes(el))) {
          decision = {
            text: 'It\'s a groovy day, walk around!',
            image: 'http://i.huffpost.com/gen/2672998/images/o-WALKING-IN-SUNSHINE-facebook.jpg',
          };
        }

        if (badTimes.find(el => data.weather[0].description.includes(el))) {
          decision = {
            text: 'Doesn\'t look good outside. Womp, womp. Ride your exercise bike.',
            image: 'http://photos.demandstudios.com/getty/article/18/111/87783925_XS.jpg'
          };
        }

        postMessage(decision);
      }
    });
}

// We use a Slack webhook to post a message with blocks in it to a channel.
// Webhooks: https://api.slack.com/apps/AGG232BPT/incoming-webhooks
// Creating Blocks: https://api.slack.com/messaging/composing/layouts
function postMessage(message) {
  const blocks = [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": message.text,
      },
      "accessory": {
        "type": "image",
        "image_url": message.image,
        "alt_text": "What to do",
      }
    },
  ];

  fetch(inboundWebhookURL, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify({blocks: blocks})
  });
}

// Trigger initial grab of weather and message posting to channel.
getWeather();

// Check weather every hour and remind me to move around in some fashion.
setInterval(() => {
  getWeather();
}, 1000 * 60 * 60);
