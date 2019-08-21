'use strict';

const npsApiKey = 'Xc8Z9iz4eukphHpAZIMXwKaQ8bfP6Tl4dBhXoXiR';
const npsSearchURL = "https://developer.nps.gov/api/v1/parks?api_";

const weatherApiKey = '77e0f092ff8c489aa8fe507cb942e633';
const weatherSearchURL = "https://api.weatherbit.io/v2.0/forecast/daily?";

const reviewAPIKeyClient = 'J2OYBRJYIRVZJCLVFDQZNXJUIUYT2JZYIYQ3OFJ0D2WQ0D0N'
const reviewApiKey = 'XGXG155FFGLLKP3PT4OEHFJNPPIMS0Z0VFDKQOBUQ24A25MU';
const reviewSearchURL = 'https://api.foursquare.com/v2/venues/explore?';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}
function watchReset() {
  $(".reset").click(event => {
    $('#results').addClass('hidden');
    $("#js-max-results").val("10");
    $('#js-search-term').val("WI");

  });
  watchForm();
}

function displayResults(responseJson) {

  console.log(responseJson);
  if (responseJson.total == 0) {
    $('#js-error-message').text("No results. Try another search!")
    $('#js-error-message').removeClass('hidden');
    $('#results').addClass('hidden');
  }
  else {

    $('#results').removeClass('hidden');
    $('#results-list').empty();
    arr = [];
    names = [];

    for (let i = 0; i < responseJson.data.length; i++) {
      arr.push(`${responseJson.data[i].addresses[1].postalCode}`);
      names.push(`${responseJson.data[i].name}`);
      getWeather(arr[i], names[i]);
      $('#results-list').append(
        `<li><h2 class='parkName'>${responseJson.data[i].name}</h2>
      <p>${responseJson.data[i].description}</p></li><li><section class="grid-holder"><ul class="grid-hold" class="parkAddress">Address<li>${responseJson.data[i].addresses[1].line1}</li><li>${responseJson.data[i].addresses[1].line2}</li><li>${responseJson.data[i].addresses[1].line3}</li><li>${responseJson.data[i].addresses[1].city},${responseJson.data[i].addresses[1].stateCode} ${responseJson.data[i].addresses[1].postalCode} </li></ul><ul class="grid-hold"><li>Park Website:</li><li><a href='${responseJson.data[i].url}' target="_blank"><li><i  class="fas fa-tree"></i></a></li></li>`);

      if (`${responseJson.data[i].name}` === names[i]) {
        $('#results-list').append(`<li><img src="weather.png"><h2>Check out the forecast</h2><p>${weatherStr[i]}</p></li>`)
      }
      $("#numberResults").html(`${arr[i].length - 1} results`)
      getReviews(arr[i], names[i])

    }



  }
}



let names = [];
let arr = [];

function getParks(query, maxResults = 10) {
  const params = {
    key: npsApiKey,
    stateCode: query,
    limit: maxResults,

  };
  const queryString = formatQueryParams(params) + "&fields=addresses"
  const url = npsSearchURL + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`)
    });
}

function watchForm() {
  $('#js-form').submit(event => {
    event.preventDefault();
    $('#js-error-message').addClass('hidden');
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    nightLifeArr = [];
    groceryArr = [];
    outdoorsArr = [];
    nightLife = [];
    grocery = [];
    outdoors = [];
    weatherStr = [];
    $("#results-list").empty();
    getParks(searchTerm, maxResults);
  });
}
// weather API data below


function getWeather(query, name) {
  const params = {
    key: weatherApiKey,
    postal_code: query,
    name: name,
  };
  const queryString = formatQueryParamsWeather(params)
  const url = weatherSearchURL + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayWeatherResults(responseJson, name))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`)
    });
}

function formatQueryParamsWeather(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}
let weatherStr = [];

function displayWeatherResults(responseJson, name) {
  console.log(responseJson);
  console.log(arr);
  console.log(names);
  weatherStr = weatherStr.slice(0, names.length).sort();
  weatherStr.push(`<p class="bold">Forecast for ${name}:</p><section class='grid-container'> <ul> <li class='grid-item'>Today: ${responseJson.data[0].rh}&deg F</li><li class='grid-item'> ${responseJson.data[0].weather.description}</li></ul><ul><li class='grid-item'>${responseJson.data[1].datetime}: ${responseJson.data[1].rh}&deg F</li><li class='grid-item'>${responseJson.data[1].weather.description}</li></ul><ul><li class='grid-item'>${responseJson.data[2].datetime}: ${responseJson.data[2].rh}&deg F</li><li class='grid-item'>${responseJson.data[2].weather.description}</li></ul></section></p>`);

}




function getReviews(query, name) {
  const params = {
    near: query,
    client_id: reviewAPIKeyClient,
    client_secret: reviewApiKey,
    v: 20190811,
    name: name
  };
  const queryString = formatQueryParamsReviews(params)
  const url = reviewSearchURL + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayReviewResults(responseJson, name))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`)
    });
}

function formatQueryParamsReviews(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}


let nightLife = [];
let grocery = [];
let outdoors = [];

let nightLifeArr = [];
let groceryArr = [];
let outdoorsArr = [];


function displayReviewResults(responseJson, name) {
  console.log(responseJson);
  console.log(names);
  nightLife = [];
  grocery = [];
  outdoors = [];


  for (let j = 0; j < responseJson.response.groups[0].items.length; j++) {
    if (`${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Sports Bar" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Bar" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Brewery") {
      nightLife.push(` ${responseJson.response.groups[0].items[j].venue.name}`)
    }
    if (`${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Café" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Diner" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Coffee Shop" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Deli / Bodega" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Fast Food Restaurant" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Grocery Store" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Sandwich Place") {
      grocery.push(` ${responseJson.response.groups[0].items[j].venue.name}`)
    }
    if (`${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Lake" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Harbor Marina" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Bay" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Bike Trail" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Yoga Studio" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Campground" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Botanical Garden" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "State / Provincial Park") {
      outdoors.push(` ${responseJson.response.groups[0].items[j].venue.name}`)
    }

  }

  if (nightLife.length == 0) {
    nightLife.push("<p>None</p>")
  }
  if (grocery.length == 0) {
    grocery.push("<p>None</p>")
  }
  if (outdoors.length == 0) {
    outdoors.push("<p>None</p>")
  }

  nightLife.slice(0, names.length)
  grocery.slice(0, names.length)
  outdoors.slice(0, names.length)
  $('#results-list').append(`<li> <img src="park.png"><h2>Check out the Nearby Attractions for ${name}</h2><h3>Night Life:</h3><p>${nightLife}</p><ul><h3>Grocery & Fast food:</h3> <li>${grocery}</li></ul><ul><h3>Outdoor Recreation</h3> <li>${outdoors}</li></ul></li>`)



}


function darkMode() {
  $("#darkSelect").click(event => {
    $("body").toggleClass("dark")
  });
}



function createApp() {
  watchForm();
  watchReset();
  darkMode();
}

$(createApp);
