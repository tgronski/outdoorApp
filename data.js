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
    $('#reviewData').addClass('hidden');
    $("#js-max-results").val("10");
    $('#js-search-term').val("WI");
    $("#attractionResults").addClass("hidden");

  });
  watchForm();
}

function displayResults(responseJson) {

  console.log(responseJson);
  if (responseJson.total == 0) {
    $('#js-error-message').text("No results. Try another search!")
    $('#js-error-message').removeClass('hidden');
    $('#results').addClass('hidden');
    $('#reviewData').addClass('hidden');
  }
  else {

    $('#results').removeClass('hidden');
    $('#reviewData').removeClass('hidden');
    $('#results-list').empty();
    $('#weather').empty();
    arr = [];
    names = [];


    for (let j = 0; j < responseJson.data.length; j++) {
      arr.push(`${responseJson.data[j].addresses[1].postalCode}`);
      names.push(`${responseJson.data[j].name}`);
      getWeather(arr[j], names[j])

    }

    for (let i = 0; i < responseJson.data.length; i++) {

      $('#results-list').append(
        `<li><h3 class='parkName'>${responseJson.data[i].name}</h3>
      <p>${responseJson.data[i].description}</p><ul class="parkAddress">Address<li>${responseJson.data[i].addresses[1].line1}</li><li>${responseJson.data[i].addresses[1].line2}</li><li>${responseJson.data[i].addresses[1].line3}</li><li>${responseJson.data[i].addresses[1].city},${responseJson.data[i].addresses[1].stateCode} ${responseJson.data[i].addresses[1].postalCode} </li></ul><p>Click the icons for more info:</p><section id="logos"><a href='${responseJson.data[i].url}' target="_blank"><i class="fas fa-tree"></i></a><a href="#weather"><i id="postal-form" class="fas fa-temperature-low"></i></a><a href="#park-form" ><i class="fab fa-foursquare"></i></a></section>`);

      // getWeather(arr[i]);
      $("#numberResults").html(`${responseJson.data.length} results`)
      $("#park-search-term").val(names[0]);


    };
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
    // $('#results').addClass('hidden');
    $('#nearbyResults').empty();
    $('#weather').empty();
    $("#park-search-term").val("search");
    $("#attractionResults").addClass("hidden");
    $('#js-error-message').addClass('hidden');
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
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
const weatherStr = {};

function displayWeatherResults(responseJson, name) {
  console.log(responseJson);
  console.log(arr);
  console.log(names);
  $('#weather').append(`<p>Forecast for ${name}: <ul> <li>${responseJson.data[0].datetime}: ${responseJson.data[0].rh} degrees</li><li> ${responseJson.data[0].weather.description}</li></ul><ul><li>${responseJson.data[1].datetime}: ${responseJson.data[1].rh} degrees</li><li>${responseJson.data[1].weather.description}</li></ul><ul><li>${responseJson.data[2].datetime}: ${responseJson.data[2].rh} degrees</li><li>${responseJson.data[2].weather.description}</li></ul></p>`);
  $("#navigateUp1").html("<a href='#js-form'><p>Back to the Parks List</p></a>")
  // weatherStr.push(`${responseJson.data[0].datetime}`);

}
//show reivews 
function watchReviews() {
  $('#park-form').submit(event => {
    event.preventDefault();
    let search = $("#park-search-term").val();
    $("#nightLife").empty();
    $("#grocery").empty();
    $("#outdoors").empty();
    getReviews(search);
  });
}


function getReviews(query) {
  const params = {
    near: query,
    client_id: reviewAPIKeyClient,
    client_secret: reviewApiKey,
    v: 20190811,
    // ll: "40.7,-74"
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
      $('#js-error-message').text(`Something went wrong: ${err.message}`)
    });
}

function formatQueryParamsReviews(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}


function displayReviewResults(responseJson) {
  console.log(responseJson);
  const nightLife = [];
  const grocery = [];
  const outdoors = [];
  $("#attractionResults").removeClass("hidden");
  $("#navigateUp2").html("<a href='#js-form'><p>Back to the Parks List</p></a>")

  for (let j = 0; j < responseJson.response.groups[0].items.length; j++) {
    // $('#nearbyResults').append(`<li><h3 class='venueName'>${[j+1]}: ${responseJson.response.groups[0].items[j].venue.name}</h3><h4>Type: ${responseJson.response.groups[0].items[j].venue.categories[0].name}</h4></li>`);
    if (`${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Bar" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Brewery") {
      nightLife.push(`${responseJson.response.groups[0].items[j].venue.name}`)
    }
    else if (`${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Grocery Store" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Sandwich Place") {
      grocery.push(`${responseJson.response.groups[0].items[j].venue.name}`)
    }
    else if (`${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Lake" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Harbor Marina" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Bay" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Bike Trail" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Yoga Studio" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Campground" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Botanical Garden" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "State / Provincial Park") {
      outdoors.push(`${responseJson.response.groups[0].items[j].venue.name}`)
    }
  };

  if (nightLife.length > 0) {
    for (let i = 0; i < nightLife.length; i++) {
      $("#nightLife").append(`<li>${[i + 1]}: ${nightLife[i]}</li>`);
    }
  }
  else $("#nightLife").append("<p>None</p>")



  if (grocery.length > 0) {
    for (let i = 0; i < grocery.length; i++) {
      $("#grocery").append(`<li>${[i + 1]}: ${grocery[i]}</li>`);
    }
  }
  else $("#grocery").append("<p>None</p>")



  if (outdoors.length > 0) {
    for (let i = 0; i < outdoors.length; i++) {
      $("#outdoors").append(`<li>${[i + 1]}: ${outdoors[i]}</li>`);
    }
  }
  else $("#outdoors").append("<p>None</p>")

}



function createApp() {
  watchForm();
  watchReset();
  watchReviews();
}

$(createApp);
