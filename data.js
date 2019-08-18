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
      // getWeather(arr[j], names[j])

    }

    for (let i = 0; i < responseJson.data.length; i++) {
      getWeather(arr[i], names[i])
      $('#results-list').append(
        `<li><h3 class='parkName'>${responseJson.data[i].name}</h3>
      <p>${responseJson.data[i].description}</p><ul class="parkAddress">Address<li>${responseJson.data[i].addresses[1].line1}</li><li>${responseJson.data[i].addresses[1].line2}</li><li>${responseJson.data[i].addresses[1].line3}</li><li>${responseJson.data[i].addresses[1].city},${responseJson.data[i].addresses[1].stateCode} ${responseJson.data[i].addresses[1].postalCode} </li></ul><p>Click the icons for more info:</p><section id="logos"><ul class="grid-holder"><li class="grid-hold">Park Website: </li><li class="grid-hold">Forecast: </li><li class="grid-hold">Nearby Attractions: </li><li class="grid-hold"></li></ul><ul class="grid-holder"><li><a href='${responseJson.data[i].url}' target="_blank"><i  class="fas fa-tree"></i></a></li><li class="grid-hold"><a href="#weather"><i id="postal-form" class="fas fa-temperature-low"></i></a></li><li class="grid-hold"><a href="#park-form" ><i class="fab fa-foursquare"></i></a></li></ul></section>`);

        if(`${responseJson.data[i].name}`==names[i]){
        $('#results-list').append(`<p>${weatherStr[i]}</p>`)
        }
      // getWeather(arr[i]);
      $("#numberResults").html(`${responseJson.data.length} results`)
      $("#park-search-term").val(names[0]);


    };
    
  }

}

// function clearAttractions(){
//   $(".fa-foursquare").click(event =>{
//     $("#attractionResults").addClass("hidden");
//   });



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
let weatherStr = [];

function displayWeatherResults(responseJson, name) {
  console.log(responseJson);
  console.log(arr);
  console.log(names);
  // $('#weather').append(`<p class="bold">${name}:</p><section class='grid-container'> <ul> <li class='grid-item'>Today: ${responseJson.data[0].rh}&deg F</li><li class='grid-item'> ${responseJson.data[0].weather.description}</li></ul><ul><li class='grid-item'>${responseJson.data[1].datetime}: ${responseJson.data[1].rh}&deg F</li><li class='grid-item'>${responseJson.data[1].weather.description}</li></ul><ul><li class='grid-item'>${responseJson.data[2].datetime}: ${responseJson.data[2].rh}&deg F</li><li class='grid-item'>${responseJson.data[2].weather.description}</li></ul></section></p>`);
  weatherStr.push(`<p class="bold">Forecast for ${name}:</p><section class='grid-container'> <ul> <li class='grid-item'>Today: ${responseJson.data[0].rh}&deg F</li><li class='grid-item'> ${responseJson.data[0].weather.description}</li></ul><ul><li class='grid-item'>${responseJson.data[1].datetime}: ${responseJson.data[1].rh}&deg F</li><li class='grid-item'>${responseJson.data[1].weather.description}</li></ul><ul><li class='grid-item'>${responseJson.data[2].datetime}: ${responseJson.data[2].rh}&deg F</li><li class='grid-item'>${responseJson.data[2].weather.description}</li></ul></section></p>`);

  $("#navigateUp1").html("<a href='#js-form'><p>Back to the Parks List</p></a>")
  // weatherStr.push(`${responseJson.data[0].datetime}`);
  console.log(weatherStr);
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

  for (let j = 0; j < responseJson.response.groups[0].items.length; j++) {
    // $('#nearbyResults').append(`<li><h3 class='venueName'>${[j+1]}: ${responseJson.response.groups[0].items[j].venue.name}</h3><h4>Type: ${responseJson.response.groups[0].items[j].venue.categories[0].name}</h4></li>`);
    if (`${`${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Sports Bar" || responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Bar" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Brewery") {
      nightLife.push(`${responseJson.response.groups[0].items[j].venue.name}`)
    }
    else if (`${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Café" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Diner" ||`${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Coffee Shop" ||`${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Deli / Bodega" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Fast Food Restaurant" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Grocery Store" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Sandwich Place") {
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
  // clearAttractions();
}

$(createApp);
