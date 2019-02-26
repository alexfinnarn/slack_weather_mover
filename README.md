# Slack Weather Mover

Do you tend to have Slack open on your laptop most waking hours of the day? Do you sit around more often than you'd like? Well if you're a web developer like me, you probably answered yes to both of those questions. 

In this sample app, you can see a working solution that posts a reminder to move around to a Slack channel of your choice. You'll need to setup a Slack workspace, add an inbound webhook, and set some variables in the `index.js` script, but after that you can use and modify this script to periodically post dynamic messages to Slack.

This repo is tied to a blog post with more information on the background and rationale for creating the script:

## Setup

You should read the linked blog post for more information on setup, but you'll need to create a workspace first at https://slack.com/create. Once you have the workspace created, you can create an app and add a webhook at https://api.slack.com/apps.

Then, you'll need to change some variables in the `index.js` file. The first variable will be adding the webhook URL and the last two deal with the weather service I decided to use to look up forecast descriptions: https://openweathermap.org/.

```js
// You can get your webhook URL from https://api.slack.com/apps/XXXXXX/incoming-webhooks
// The XXXX app ID will be listed under your apps.
const inboundWebhookURL = '';

// Search for your city and then look in the URL for the ID.
// ex. https://openweathermap.org/city/4188985 the ID is 4188985.
const cityID = 12345;

// Taken from https://home.openweathermap.org/api_keys.
const appID = '';

```

## Run The Script

Assuming you have node.js and `yarn` installed, all you have to do is install a couple of depdendencies and then boot up the script. The script makes an initial call to the weather API posting a message to the Slack channel and then waits an hour until the next request. Ideally, the `setInterval()` call would be replaced with a better reocurring task runner like `node-cron`, but this example is only intended to help you get your feet wet playing with posting messages to a Slack channel.

```bash
# Install dependencies.
yarn install

# Start the script.
node index.js
```

You can also mess around with the interval used for checking the weather if you want. The function call is located at the bottom of `index.js`.

```js
// Check weather every hour and remind me to move around in some fashion.
setInterval(() => {
  getWeather();
}, myIntervalDeterminingFunction());
```

Finally, you'll want to pick some motivating imagery for the different conditions you want to decide on. I originally included some images of my choosing in the blog post screenshots; however, I replaced those with a generic 300x300 image for copyright reasons and also because you might not share my sense of humor...it happens.

```js
// Change the text and image used to your liking.
let decision = {
  text: 'I have different opinions on sunshine...',
  image: 'https://my.image.com/sunny-walk.jpg',
};
```
