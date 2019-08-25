'use strict';

const npsApiKey = "Xc8Z9iz4eukphHpAZIMXwKaQ8bfP6Tl4dBhXoXiR";
const npsSearchURL = "https://developer.nps.gov/api/v1/parks?api_";

const weatherApiKey = "77e0f092ff8c489aa8fe507cb942e633";
const weatherSearchURL = "https://api.weatherbit.io/v2.0/forecast/daily?";

const reviewAPIKeyClient = "J2OYBRJYIRVZJCLVFDQZNXJUIUYT2JZYIYQ3OFJ0D2WQ0D0N";
const reviewApiKey = "XGXG155FFGLLKP3PT4OEHFJNPPIMS0Z0VFDKQOBUQ24A25MU";
const reviewSearchURL = "https://api.foursquare.com/v2/venues/explore?";


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join("&");
}
let answers = {};
let answersArr = [];

function watchReset() {
  $(".reset").click(event => {
    $("#results").addClass("hidden");
    $("#js-search-term").val("WI");

  });
  watchForm();
}
let arr = [];

function displayResults(responseJson) {

  console.log(responseJson);
  if (responseJson.total == 0) {
    $("#js-error-message").text("No results. Try another search!")
    $("#js-error-message").removeClass("hidden");
    $("#results").addClass("hidden");
  }
  else {

    $("#results").removeClass("hidden");
    $("#results-list").empty();
    arr = [];

    for (let j = 0; j < responseJson.data.length; j++) {
      arr.push(responseJson.data[j].name);
    }
    for (let i = 0; i < arr.length; i++) {
      answers = {};
      answers.name = responseJson.data[i].name;
      answers.description = responseJson.data[i].description;
      answers.address = {};
      answers.address.line1 = responseJson.data[i].addresses[1].line1;
      answers.address.line2 = responseJson.data[i].addresses[1].line2;
      answers.address.line3 = responseJson.data[i].addresses[1].line3;
      answers.address.city = responseJson.data[i].addresses[1].city;
      answers.address.state = responseJson.data[i].addresses[1].stateCode;
      answers.address.zip = responseJson.data[i].addresses[1].postalCode;
      answers.url = responseJson.data[i].url;
      answersArr.push(answers);
      answers.weather = {};
      answers.entertainment = {};
      getReviews(answersArr[i].address.zip);
      getWeather(answersArr[i].address.zip);
      answers.weather = forecastArr[i];
      answers.entertainment.nightlife = nightLife[i];
      answers.entertainment.grocery = groceryStore[i];
      answers.entertainment.outdoors = outdoorLife[i];
    }


  }
  $("#results-list").append(`<p>${arr.length} Search Results</p>`);
  console.log(arr);
  let lengthArr = arr.length;
  for (let j = 0; j < lengthArr; j++) {
    $("#results-list").append(`<h2 class="parkName">${answersArr[j + lengthArr].name}</h2><p>${answersArr[j + lengthArr].description}</p><section class="grid-holder"><ul class="grid-hold" class="parkAddress">Address<li>${answersArr[j + lengthArr].address.line1}</li><li>${answersArr[j + lengthArr].address.line2}</li><li>${answersArr[j + lengthArr].address.line3}</li><li>${answersArr[j + lengthArr].address.city}, ${answersArr[j + lengthArr].address.state} ${answersArr[j + lengthArr].address.zip} </li></ul><ul class="grid-hold"><a href='${answersArr[j + lengthArr].url}' target="_blank"><li>Park Website<li></a></li></li></section><p><img src="weather.png"></p><h2>Check out the forecast</h2><p class="bold">Forecast for ${answersArr[j + lengthArr].name}:</p><section class="grid-container"> <ul> <li class="grid-item">Today: ${answersArr[j + lengthArr].weather.today}&deg F</li><li class="grid-item"> ${answersArr[j + lengthArr].weather.description1}</li></ul><ul><li class="grid-item">Tomorrow: ${answersArr[j + lengthArr].weather.tomorrow}&deg F</li><li class="grid-item">${answersArr[j + lengthArr].weather.description2}</li></ul><ul><li class="grid-item">Next Day: ${answersArr[j + lengthArr].weather.nextDay}&deg F</li><li class="grid-item">${answersArr[j + lengthArr].weather.description3}</li></ul></section></p><img src="park.png"><h2>Check out the Nearby Attractions for ${answersArr[j + lengthArr].name}</h2><h3>Night Life:</h3><li> ${answersArr[j + lengthArr].entertainment.nightlife.nightlife}</li><ul><h3>Grocery & Fast food:</h3> <li> ${answersArr[j + lengthArr].entertainment.grocery.grocery}</li></ul><ul><h3>Outdoor Recreation:</h3> <li> ${answersArr[j + lengthArr].entertainment.outdoors.outdoors}</li></ul></li>`);
    
  }
}


function getParks(query) {
  const params = {
    key: npsApiKey,
    stateCode: query,
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
      $("#js-error-message").text(`Something went wrong: ${err.message}`)
    });
}

function watchForm() {
  $("#js-form").submit(event => {
    event.preventDefault();
    $("#js-error-message").addClass("hidden");
    const searchTerm = $("#js-search-term").val();

    outdoorLife = [];
    groceryStore = [];
    nightLife = [];
    answers = {};
    arr = [];
    forecastArr = [];
    answersArr = [];
    $("#results-list").empty();
    getParks(searchTerm);
  });
}
// weather API data below

function getWeather(query) {
  const params = {
    key: weatherApiKey,
    postal_code: query,

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
    .then(responseJson => displayWeatherResults(responseJson))
    .catch(err => {
      $("#js-error-message").text(`Something went wrong! Try Another Search`)
    });
}

function formatQueryParamsWeather(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join("&");
}

let forecast = {};
let forecastArr = [];
function displayWeatherResults(responseJson) {
  console.log(responseJson);

  forecast = {};
  forecast = {
    today: responseJson.data[0].rh,
    description1: responseJson.data[0].weather.description,
    tomorrow: responseJson.data[1].rh,
    description2: responseJson.data[1].weather.description,
    nextDay: responseJson.data[2].rh,
    description3: responseJson.data[2].weather.description
  };
  forecastArr.push(forecast);

}


//per API restrictions, had to switch from reviews of parks to nearby attractions

function getReviews(query) {
  const params = {
    near: query,
    client_id: reviewAPIKeyClient,
    client_secret: reviewApiKey,
    v: 20190811,

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
    .then(responseJson => displayReviewResults(responseJson))
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`)
    });
}

function formatQueryParamsReviews(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join("&");
}

let nightList = {};
let grocery = {};
let outdoors = {};
let nightLifeArr = [];
let nightLife = [];
let groceryStore = [];
let groceryArr = [];
let outdoorsArr = [];
let outdoorLife = [];

function displayReviewResults(responseJson) {
  grocery = {};
  outdoors = {};
  nightList = {};
  nightLifeArr = [];
  groceryArr = [];
  outdoorsArr = [];

  for (let j = 0; j < responseJson.response.groups[0].items.length; j++) {
    if (`${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Sports Bar" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Bar" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Brewery") {
      nightLifeArr.push(` ${responseJson.response.groups[0].items[j].venue.name}`)
    }
    if (nightLifeArr.length > 0) {
      nightList = { nightlife: nightLifeArr };
    }
    else nightList = { nightlife: "None" };

    if (`${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Café" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Diner" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Coffee Shop" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Deli / Bodega" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Fast Food Restaurant" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Grocery Store" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Sandwich Place") {
      groceryArr.push(` ${responseJson.response.groups[0].items[j].venue.name}`)
    }
    if (groceryArr.length > 0) {
      grocery = { grocery: groceryArr };
    }
    else grocery = { grocery: "None" };

    if (`${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Lake" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Harbor Marina" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Bay" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Bike Trail" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Yoga Studio" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Campground" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Botanical Garden" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "State / Provincial Park") {
      outdoorsArr.push(` ${responseJson.response.groups[0].items[j].venue.name}`)
    }
    if (outdoorsArr.length > 0) {
      outdoors = { outdoors: outdoorsArr };
    }
    else outdoors = { outdoors: "None" };
  }
  nightLife.push(nightList);
  groceryStore.push(grocery);
  outdoorLife.push(outdoors);
}



function createApp() {
  watchForm();
  watchReset();
}




$(createApp);
