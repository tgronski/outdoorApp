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
    let arr=[];
    let names=[];
    // let newArr=[];
    
    for (let i = 0; i < responseJson.data.length; i++) {

      $('#results-list').append(
        `<li><h3 class='parkName'>${responseJson.data[i].name}</h3>
      <p>${responseJson.data[i].description}</p><a href='${responseJson.data[i].url}' target="_blank">Check it out!</a></section><section id="logos"><a href="#weather"><i id="postal-form" class="fas fa-temperature-low"></i></a><a href="#nearbyResults" ><i class="fab fa-foursquare"></i></a></section></li><p class="hidden" id='postalCode'>${responseJson.data[i].addresses[1].postalCode}</p>`);
      arr.push(`${responseJson.data[i].addresses[1].postalCode}`);
      names.push(`${responseJson.data[i].name}`);
      getWeather(arr[i]);
      $("#numberResults").html(`${responseJson.data.length} results`)
      $("#park-search-term").val(names[0]);
    
        
    };
    console.log(newArr);
  }
  
  
}




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
    $('#js-error-message').addClass('hidden');
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getParks(searchTerm, maxResults);
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
      $('#js-error-message').text(`Something went wrong: ${err.message}`)
    });
}

function formatQueryParamsWeather(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}


function displayWeatherResults(responseJson) {
  console.log(responseJson);
  $('#weather').append(`<p>Forecast for ${responseJson.city_name}, ${responseJson.state_code}: <ul> <li>${responseJson.data[0].datetime}: ${responseJson.data[0].rh} degrees</li></ul></p>`);
  
}
//show reivews 
function watchReviews() {
  $('#park-form').submit(event => {
    event.preventDefault();
    let search = $("#park-search-term").val();
    $("#nearbyResults").empty();
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
  for (let j = 0; j < responseJson.response.groups[0].items.length; j++) {
    $('#nearbyResults').append(`<li><h3 class='venueName'>${[j+1]}: ${responseJson.response.groups[0].items[j].venue.name}</h3></li>`);
  };

}



function createApp() {
  watchForm();
  watchReviews();
}

$(createApp);
