const cityField = document.getElementById('city');
const cityErrorMessage = document.getElementById('city-error-message');
const locationField = document.getElementById('location');
const weatherField = document.getElementById('weather');
const tempField = document.getElementById('temp');
const feelsLikeField = document.getElementById('feels-like');
const sunriseField = document.getElementById('sunrise');
const sunsetField = document.getElementById('sunset');
const humidityField = document.getElementById('humidity');
const pressureField = document.getElementById('pressure');
const windField = document.getElementById('wind');

// Clears the input field, when refreshing the page.
cityField.value = '';

let cityName = "";
let temp = "";
let feels_like_temp = "";
let sunrise = "";
let sunset = "";
let humidity = "";
let pressure = "";
let weather = "";
let windSpeed = "";
let locationName = "";



cityField.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    search();
  }
})

function search() {
  cityName = cityField.value;
  // For empty search clicks
  if (!cityName) {
    hideDetails();
    locationField.innerHTML = 'Enter a city name';
    return;
  }
  console.log(cityName);
  fetchData(cityName);
}

function fetchData(cityName) {
  const url = `.netlify/functions/fetch-weather?cityName=${cityName}`
  fetch(url)
    .then(response => response.json() )
    .then((json) => {
      const data = json.res

      // Checking for cod !== 200 : As there could be other cod errors like 400, 401 etc.
      if (data.cod !== 200) {
        locationField.innerHTML = 'City not found';
        hideDetails();
        return;
      }

      console.log(data);
      locationName = data.name + ', ' + data.sys['country'];
      temp = data.main["temp"];
      // converting Kelvin to Celsius upto 2 decimal digits
      temp = Math.round(temp - 273.15);
      feels_like_temp = data.main["feels_like"];
      feels_like_temp = Math.round(feels_like_temp - 273.5);
      sunrise = convertToTime(data.sys["sunrise"]);
      sunset = convertToTime(data.sys["sunset"]);
      humidity = data.main["humidity"];
      pressure = data.main["pressure"];
      iconId = data.weather[0]["icon"];
      weather = capitalise(data.weather[0]["description"]);
      // converting wind speed from m/s to km/hr
      windSpeed = (data.wind["speed"] * 3.6).toFixed(2);
      showDetails();
    })
}

function showDetails() {
  locationField.innerHTML = locationName;
  tempField.innerHTML = temp + '&#176;' + 'C';
  feelsLikeField.innerHTML = 'Feels like ' + feels_like_temp + '&deg;C';
  sunriseField.innerHTML = sunrise;
  sunsetField.innerHTML = sunset;
  weatherField.innerHTML = weather;
  humidityField.innerHTML = humidity + '%';
  pressureField.innerHTML = pressure + ' mb';
  windField.innerHTML = windSpeed + ' km/h';
}

function hideDetails() {
  temp = '';
  humidity = '';
  pressure = '';
  weather = '';
  windSpeed = '';
  tempField.innerHTML = '___';
  weatherField.innerHTML = '___';
  humidityField.innerHTML = '___';
  pressureField.innerHTML = '___';
  windField.innerHTML = '___';
}

const convertToTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const time = date.toLocaleTimeString();
  return time.substring(0, 4) + time.substring(7,);
}

const capitalise = (sentence) => {
  const words = sentence.split(" ");
  const str = words.map((word) => {
    return word[0].toUpperCase() + word.substring(1);
  }).join(" ");
  return str;
}



