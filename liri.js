require("dotenv").config();

var request = require("request");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

// Grab the fs package to handle read/write
var fs = require("fs");

// Code required to import the keys.js file and store it in a variable.
var keys = require("./keys.js");
    // Test to see if keys.js is exporting to liri.js by running "node .liri.js"
    // Expected to print "this is loaded"
    //*** The line below will print actual keys ***
    // console.log(keys);

// You should then be able to access your keys information like so:
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// Variables for different arguments
var command = process.argv[2];
var searchInput = process.argv[3];

//=======================================================================================
//************ARGUMENT FUNCTION SELECTORS************//

// Different command functions for liri:
switch (command) {
    case "my-tweets":
        myTweets();
        break;

    case "spotify-this-song":
        spotifyThisSong(searchInput);
        break;

    case "movie-this":
        if(searchInput) {
            movieThis(searchInput);
        } else {
            movieThis('Mr. Nobody');
        }
        break;

    case "do-what-it-says":
        doWhatItSays();
        break;
}

//=======================================================================================
//************FUNCTIONS************//

// node liri.js my-tweets
// This will show your last 20 tweets and when they were created at in your terminal/bash window.
function myTweets() {

    var params = {screen_name: 'nodejs'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
        console.log(tweets);
        }
    });
}

// node liri.js spotify-this-song '<song name here>'
function spotifyThisSong () {

    // If the user typed a track name, the searchInput will be used in the spotify query.
    if(searchInput) {
        // Replace the spaces in user typed track to be replaced with + in url to work correctly.
        searchInput = searchInput.replace(' ', '+');
    } else {
        // If no song is provided then your program will default to "The Sign" by Ace of Base.
        searchInput = "The+Sign+Ace";
    }

    spotify.search({ type: 'track', query: searchInput }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        //console.log(data.tracks.items[0]);
        var firstReturn = data.tracks.items[0];

        console.log("Artist name: " + firstReturn.artists[0].name);
        console.log("Song title: " + firstReturn.name);
        console.log("Preview link at: " + firstReturn.external_urls.spotify);
        console.log("Album title: " + firstReturn.album.name);
    });
}

// node liri.js movie-this '<movie name here>'
function movieThis () {

    // If the user typed a movie name, the searchInput will be used in the omdbURL.
    if(searchInput) {
        // Replace the spaces in user typed title to be replaced with + in url to work correctly.
        searchInput = searchInput.replace(' ', '+');
    } else {
        // If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
        searchInput = "Mr.+Nobody";
    }

    var omdbUrl = "http://www.omdbapi.com/?t=" + searchInput + "&y=&plot=short&apikey=trilogy";

    // Then run a request to the OMDB API with the movie specified
    request(omdbUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            // Full response for searchInput
            // console.log(JSON.parse(body));

            console.log('"' + (JSON.parse(body).Title) + '"');
            console.log("Released in " + (JSON.parse(body).Year));
            console.log("IMDB " + (JSON.parse(body).Ratings[0].Value));
            console.log("Rotten Tomatoes " + (JSON.parse(body).Ratings[1].Value));
            console.log("Produced in " + (JSON.parse(body).Country));
            console.log("Language: " + (JSON.parse(body).Language));
            console.log("Plot: " + (JSON.parse(body).Plot));
            console.log("Actors: " + (JSON.parse(body).Actors));
        }
    })
}

//node liri.js do-what-it-says
//Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
//It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
//Feel free to change the text in that document to test out the feature for other commands.