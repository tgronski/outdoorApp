"use strict";

const npsApiKey = "Xc8Z9iz4eukphHpAZIMXwKaQ8bfP6Tl4dBhXoXiR";
const npsSearchURL = "https://developer.nps.gov/api/v1/parks?api_";

const weatherApiKey = "77e0f092ff8c489aa8fe507cb942e633";
const weatherSearchURL = "https://api.weatherbit.io/v2.0/forecast/daily?";

const reviewAPIKeyClient = "J2OYBRJYIRVZJCLVFDQZNXJUIUYT2JZYIYQ3OFJ0D2WQ0D0N";
const reviewApiKey = "XGXG155FFGLLKP3PT4OEHFJNPPIMS0Z0VFDKQOBUQ24A25MU";
const reviewSearchURL = "https://api.foursquare.com/v2/venues/explore?";



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

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join("&");
}
let answers = {};
let answersArr = [];

function watchReset() {
  $(".reset").click(event => {
    $(".loader").addClass("hidden")
    $("#results").addClass("hidden");
    $("#js-search-term").val("WI");

  });
  watchForm();
}
let arr = [];
let arrayZip=[];


function displayResults(responseJson) {

  if (responseJson.total == 0) {
    $(".loader").addClass("hidden");
    $("#js-error-message").text("No results. Try another search!");
    $("#js-error-message").removeClass("hidden");
    $("#results").addClass("hidden");

  }
  else {
    let arrayItems=[]
    $("#results-list").empty();
    
    for (let i = 0; i < responseJson.data.length; i++) {
      arr.push(responseJson.data[i].name);
      arrayItems.push(arr[i]);
    }
    
    $("#results-list").append(`<p>${arrayItems.length} Search Results</p>`);
    for (let i=0; i<arrayItems.length; i++){
      answers[i]={};
      let weatherResults={};
      answers[i].name = responseJson.data[i].name;
      answers[i].description= responseJson.data[i].description;
      answers[i].address = {};
      answers[i].address.line1 = responseJson.data[i].addresses[1].line1;
      answers[i].address.line2= responseJson.data[i].addresses[1].line2;
      answers[i].address.line3 = responseJson.data[i].addresses[1].line3;
      answers[i].address.city = responseJson.data[i].addresses[1].city;
      answers[i].address.state= responseJson.data[i].addresses[1].stateCode;
      answers[i].address.zip = responseJson.data[i].addresses[1].postalCode;
      answers[i].url= responseJson.data[i].url; 
      answers[i].weather={};
      answers[i].entertainment={};
      getWeather(answers[i].address.zip);
      getReviews(answers[i].address.zip);
      for(let j=0; j<forecastArr.length; j++){
        if (forecastArr[j].zipCode===answers[i].address.zip){
          answers[i].weather=forecastArr[j];
        }
      }
      getReviews(answers[i].address.zip);
      for(let j=0; j<nightList.length; j++){
        if (nightList[j].zipCode===answers[i].address.zip){
          answers[i].entertainment.nightLife=nightList[j].nightlife;
        }
      }
      for(let j=0; j<nightList.length; j++){
        if (nightList[j].zipCode===answers[i].address.zip){
          answers[i].entertainment.nightLife=nightList[j].nightlife;
        }
      }
      for(let j=0; j<groceryStore.length; j++){
        if (groceryStore[j].zipCode===answers[i].address.zip){
          answers[i].entertainment.grocery=groceryStore[j].grocery;
        }
      }
      for(let j=0; j<outdoorLife.length; j++){
        if (outdoorLife[j].zipCode===answers[i].address.zip){
          answers[i].entertainment.outdoors=outdoorLife[j].outdoors;
        }
      }
      $("#results-list").append(`<h2 class="parkName">${answers[i].name}</h2><p>${answers[i].description}</p><section class="grid-holder"><ul class="grid-hold" class="parkAddress">Address<li>${answers[i].address.line1}</li><li>${answers[i].address.line2}</li><li>${answers[i].address.line3}</li><li>${answers[i].address.city}, ${answers[i].address.state} ${answers[i].address.zip} </li></ul><ul class="grid-hold"><a href="${answers[i].url}" target="_blank"><li>Park Website</a></li></ul></section><p><img src="weather.png"></p><h2>Check out the forecast</h2><p class="bold">Forecast for ${answers[i].name}:</p><section class="grid-container"> <ul> <li class="grid-item">Today: ${answers[i].weather.today}&deg F</li><li class="grid-item"> ${answers[i].weather.description1}</li></ul><ul><li class="grid-item">Tomorrow: ${answers[i].weather.tomorrow}&deg F</li><li class="grid-item">${answers[i].weather.description2}</li></ul><ul><li class="grid-item">Next Day: ${answers[i].weather.nextDay}&deg F</li><li class="grid-item">${answers[i].weather.description3}</li></ul></section><p><img src="park.png"><h2>Check out the Nearby Attractions for ${answers[i].name}</h2></p><ul><h3>Night Life:</h3><li> ${answers[i].entertainment.nightLife}</li></ul><ul><h3>Grocery & Fast food:</h3> <li> ${answers[i].entertainment.grocery}</li></ul><ul><h3>Outdoor Recreation:</h3> <li> ${answers[i].entertainment.outdoors}</li></ul>`)
    }    


    
    $(".loader").addClass("hidden")
    $("#results").removeClass("hidden");
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
  $(".loader").removeClass("hidden");
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
      $("#results-list").append("<p>Something went wrong, please try again.</p>");
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
   .then(responseJson => displayWeatherResults(responseJson,query))
    .catch(err => {
      $("#js-error-message").text("Something went wrong! Try Another Search")
    });
}

function formatQueryParamsWeather(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join("&");
}

let forecast = {};
let forecastArr = [];
function displayWeatherResults(responseJson,query) {
  forecast={}
  forecast = {
    zipCode: query,
    today: responseJson.data[0].rh,
    description1: responseJson.data[0].weather.description,
    tomorrow: responseJson.data[1].rh,
    description2: responseJson.data[1].weather.description,
    nextDay: responseJson.data[2].rh,
    description3: responseJson.data[2].weather.description
  };
  forecastArr.push(forecast);
}


// //per API restrictions, had to switch from reviews of parks to nearby attractions

function getReviews(query) {
  const params = {
    near: query,
    client_id: reviewAPIKeyClient,
    client_secret: reviewApiKey,
    v: 20190811,

  };
  const queryString = formatQueryParamsReviews(params)
  const url = reviewSearchURL + queryString;

 

  fetch(url)
  .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayReviewResults(responseJson,query))
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`)
    });
    
}

function formatQueryParamsReviews(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join("&");
}

let nightList = [];
let grocery = {};
let outdoors = {};
let nightLifeArr = [];
let nightLife = {};
let groceryStore = [];
let groceryArr = [];
let outdoorsArr = [];
let outdoorLife = [];

function displayReviewResults(responseJson,query) {
  nightLifeArr=[];
  nightLife={};
  groceryArr=[];
  grocery={};
  outdoorsArr=[];
  outdoors={};
  for (let j = 0; j < responseJson.response.groups[0].items.length; j++) {
    if (`${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Sports Bar" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Bar" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Brewery") {
      nightLifeArr.push(` ${responseJson.response.groups[0].items[j].venue.name}`)
    }
  
   
    if (nightLifeArr.length > 0) {
      nightLife = { zipCode: query, nightlife: nightLifeArr };
    }
    else nightLife = { zipCode: query, nightlife: "None" };
    nightList.push(nightLife);
    
    if (`${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Café" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Diner" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Coffee Shop" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Deli / Bodega" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Fast Food Restaurant" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Grocery Store" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Sandwich Place") {
      groceryArr.push(` ${responseJson.response.groups[0].items[j].venue.name}`)
    }
    if (groceryArr.length > 0) {
      grocery = { zipCode: query, grocery: groceryArr };
    }
    else grocery = { zipCode: query, grocery: "None" };

    groceryStore.push(grocery);

    if (`${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Lake" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Harbor Marina" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Bay" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Bike Trail" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Yoga Studio" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Campground" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "Botanical Garden" || `${responseJson.response.groups[0].items[j].venue.categories[0].name}` === "State / Provincial Park") {
      outdoorsArr.push(` ${responseJson.response.groups[0].items[j].venue.name}`)
    }
    if (outdoorsArr.length > 0) {
      outdoors = { zipCode: query, outdoors: outdoorsArr };
    }
    else outdoors = {zipCode: query,  outdoors: "None" };
  


  outdoorLife.push(outdoors);
  }

}



function createApp() {
  $(".loader").addClass("hidden");
  watchForm();
  watchReset();
}




$(createApp);
