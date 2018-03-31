require("dotenv").config();

var request = require("request");
var inquirer = require("inquirer");
var colors = require('colors');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require("fs");
var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var omdb = (keys.omdb);

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
function myTweets() {

    var params = {screen_name: 'mtking78'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {

            console.log("");
            console.log(("***** Twitter Tweeter: " + tweets[0].user.screen_name + " *****").inverse);
            for (i = 0; i < tweets.length; i++) {
                console.log("");
                console.log(tweets[i].text);
                console.log(tweets[i].created_at.substring(0, 19));
                console.log("");
                // Append every full return to the log.txt file.
                fs.appendFile("log.txt", "\n" + tweets[0].user.screen_name + "\n" + tweets[i].text + "\n" + tweets[i].created_at.substring(0, 19) + "\n", function(error){
                    if (error) {
                        console.log(error);
                    }
                });
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
            console.log("Song title: " + (firstReturn.name).bold);
            console.log("Preview link at: " + (firstReturn.external_urls.spotify).underline.red);
            console.log("Album title: " + firstReturn.album.name);
            console.log("");
            console.log("**************************************");
            console.log("");
            // Append every full return to the log.txt file.
            fs.appendFile("log.txt", "\n" + "Artist name: " + firstReturn.artists[0].name + "\nSong title: " + firstReturn.name + "\nPreview link at: " + firstReturn.external_urls.spotify + "\nAlbum title: " + firstReturn.album.name + "\n", function(error){
                if (error) {
                    console.log(error);
                }
            });
        } else {
            return console.log('An error occurred: ' + error);
        };
    });
}

// node liri.js movie-this '<movie name here>'
function movieThis (movie) {

    var omdbUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=" + omdb.key;

    request(omdbUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var info = JSON.parse(body);
            console.log("");
            console.log(('***** "' + info.Title + '" *****').inverse);
            console.log("Released in " + info.Year);
            console.log("IMDB " + info.Ratings[0].Value);
            console.log("Rotten Tomatoes " + info.Ratings[1].Value);
            console.log("Produced in " + info.Country);
            console.log("Language: " + info.Language);
            console.log("Plot: " + info.Plot);
            console.log("Actors: " + info.Actors);
            console.log("");
            console.log("**************************************");
            console.log("");
            // Append every full return to the log.txt file.
            fs.appendFile("log.txt", "\n" + '***** "' + info.Title + '" *****' + "\nReleased in " + info.Year + "\nIMDB " + info.Ratings[0].value + "\nRotten Tomatoes " + info.Ratings[1].Value + "\nProduced in " + info.Country + "\nLanguage: " + info.Language + "\nPlot: " + info.Plot + "\nActors: " + info.Actors + "\n", function(error) {
                if (error) {
                    console.log(error);
                };
            });
        } else {
            console.log('An error occurred: ' + error);
        }
    })
}

//node liri.js do-what-it-says
function doThis () {

    fs.readFile("random.txt", "utf8", function(error, data) {

        var things = data.split(",");
        var command = things[0];
        var searchInput = things[1];

        if (!error) {

            for (var i = 1; i < things.length; i++) {
                //console.log(things);
                //console.log(things[i]);
                //spotifyThisSong(things[i]);
                if (command === "my-tweets") {
                    myTweets(searchInput);
                } else if (command === "spotify-this-song") {
                    spotifyThisSong(searchInput);
                } else if (command === "movie-this") {
                    movieThis(searchInput);
                } else {
                    return;
                }
            }
        } else {
            return console.log(error);
        }
    });
}