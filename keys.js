//console.log('this is loaded');

exports.twitter = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
};

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

// // Load the NPM Package inquirer
// var inquirer = require("inquirer");

// // Created a series of questions
// inquirer.prompt([

//     {
//         type: "list",
//         name: "doingWhat",
//         message: "Choose a command:",
//         choices: ["my-tweets", "spotify-this-song", "movie-this", "do-this"]
//       },

//     {
//       type: "input",
//       name: "search",
//       message: "What are you looking for?"
//     },

//   ]).then(function(user) {

//     user.doingWhat = process.argv[2];
//     user.search = process.argv[3];

//   });
