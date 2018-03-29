require("dotenv").config();

var request = require("request");
var inquirer = require("inquirer");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

// Grab the fs package to handle read/write
var fs = require("fs");

// Code required to import the keys.js file and store it in a variable.
var keys = require("./keys.js");
    // Test to see if keys.js is exporting to liri.js by running "node .liri.js"
    // Expected to print "this is loaded"
    //*** The line below will print actual keys ***
    //console.log(keys);

// You should then be able to access your keys information like so:
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// Variables for different arguments
//var command = process.argv[2];
//var searchInput = process.argv[3];

//=======================================================================================
//************ARGUMENT FUNCTION SELECTORS************//
inquirer.prompt(

    {
        type: "list",
        name: "command",
        message: "Choose a command:",
        choices: ["my-tweets", "spotify-this-song", "movie-this", "do-this"]
    },

).then(function(user) {

    if (user.command == "my-tweets") {
        myTweets();

    } else if (user.command == "spotify-this-song") {
        inquirer.prompt(
            {
                type: "input",
                name: "search",
                message: "What song are you looking for?"
            },
        ).then(function(user) {
            if (user.search === "") {
                spotifyThisSong("Sign Ace Base");
            } else {
                spotifyThisSong(user.search);
            }
        })

    } else if (user.command == "movie-this") {
        inquirer.prompt(
            {
                type: "input",
                name: "search",
                message: "What movie are you looking for?"
            },
        ).then(function(user){
            if (user.search === "") {
                movieThis("Mr. Nobody");
            } else {
                movieThis(user.search);
            }
        })

    } else if (user.command == "do-this") {
        doThis();
    }

  });
//=======================================================================================
//************ARGUMENT FUNCTION SELECTORS************//

// // Different command functions for liri:
// switch (command) {
//     case "my-tweets":
//         myTweets();
//         break;

//     case "spotify-this-song":
//         if (!searchInput) {
//             spotifyThisSong("Sign Ace Base");
//         } else {
//             spotifyThisSong(searchInput);
//         }
//         break;

//     case "movie-this":
//         if (!searchInput) {
//             movieThis("Mr. Nobody");
//         } else {
//             movieThis(searchInput);
//         }
//         break;

//     case "do-this":
//         doThis(searchInput);
//         break;

// }

//=======================================================================================
//************FUNCTIONS************//

// node liri.js my-tweets
// This will show your last 20 tweets and when they were created at in your terminal/bash window.
function myTweets() {

    var params = {screen_name: 'mtking78'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {

            console.log("");
            console.log("***** Twitter Tweeter: " + tweets[0].user.screen_name + " *****");
            for (i = 0; i < tweets.length; i++) {
                console.log("");
                console.log(tweets[i].text);
                console.log(tweets[i].created_at.substring(0, 19));
                console.log("");
            }
            console.log("**************************************");
            console.log("");
        } else {
            console.log('An error occurred: ' + error);
        }
    });
}

// node liri.js spotify-this-song '<song name here>'
function spotifyThisSong (song) {

    spotify.search({ type: 'track', query: song }, function(error, data) {
        if (!error) {
            var firstReturn = data.tracks.items[0];

            console.log("");
            console.log("Artist name: " + firstReturn.artists[0].name);
            console.log("Song title: " + firstReturn.name);
            console.log("Preview link at: " + firstReturn.external_urls.spotify);
            console.log("Album title: " + firstReturn.album.name);
            console.log("");
            console.log("**************************************");
            console.log("");
        } else {
            return console.log('An error occurred: ' + error);
        }
    });
}

// node liri.js movie-this '<movie name here>'
function movieThis (movie) {

    var omdbUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    // Then run a request to the OMDB API with the movie specified
    request(omdbUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {

            console.log("");
            console.log('***** "' + (JSON.parse(body).Title) + '" *****');
            console.log("Released in " + (JSON.parse(body).Year));
            console.log("IMDB " + (JSON.parse(body).Ratings[0].Value));
            console.log("Rotten Tomatoes " + (JSON.parse(body).Ratings[1].Value));
            console.log("Produced in " + (JSON.parse(body).Country));
            console.log("Language: " + (JSON.parse(body).Language));
            console.log("Plot: " + (JSON.parse(body).Plot));
            console.log("Actors: " + (JSON.parse(body).Actors));
            console.log("");
            console.log("**************************************");
            console.log("");
        } else {
            console.log('An error occurred: ' + error);
        }
    })
}

//node liri.js do-what-it-says
//Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
//It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
//Feel free to change the text in that document to test out the feature for other commands.
function doThis () {

    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (!error) {
            var things = data.split(",");
            // Loop through the newly created array
            for (var i = 1; i < things.length; i++) {
                // We will then print the contents of data
                //console.log(things);
                //console.log(things[i]);
                spotifyThisSong(things[i]);
            }
        } else {
            return console.log(error);
        }
    });
}