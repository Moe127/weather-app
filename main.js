const currentCondition = document.querySelector(".current-condition");
const cityName = document.querySelector(".city-name");
const date = document.querySelector(".date");
const time = document.querySelector(".time");
const currTemp = document.querySelector(".temp");
const currTempIcon = document.querySelector(".temp-icon");
const search = document.querySelector("#search");
const body = document.querySelector("body");
const futureWeather = document.querySelector(".future-weather");
/***************************************************************************************/
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
key = "e593c6df54604972a69165024231802";
/***************************************************************************************/

async function weatherApp(searchInput) {
  let endpoint;
  const cityRegexp = /^[a-zA-Z\u0080-\u024F\s\/\-\)\(\`\.\"\']+$/;
  if (cityRegexp.test(searchInput)) {
    endpoint = `
  http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${searchInput}&days=3&aqi=no&alerts=no`;
  } else {
    searchInput = "cairo";

    endpoint = `
  http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${searchInput}&days=3&aqi=no&alerts=no`;
  }

  var weather = await fetch(endpoint);
  weather = await weather.json();
  try {
    let currentDay = weather.current.last_updated;
    let days = getDaysName(currentDay);
    let month = getMonth();
    let currentTime = weather.location.localtime;
    let currentTemp = weather.current.temp_c;
    let weatherConditions = getWeatherConditions(
      weather.current.condition.text,
      weather.forecast.forecastday[1].day.condition.text,
      weather.forecast.forecastday[2].day.condition.text
    );
    let weatherConditionsIcons = getWeatherConditionsIcons(
      weather.current.condition.icon,
      weather.forecast.forecastday
    );
    let weatherMinMaxTemp = getWeatherMinMax(weather.forecast.forecastday);

    displayConditions(weatherConditions);
    displayCityName(weather.location.name);
    displayDate(days, month);
    displayCurrentTime(currentTime);
    displayTemp(currentTemp, weatherMinMaxTemp);
    displayTempIcon(weatherConditionsIcons);
    displayFutureWeather(
      days,
      weatherConditionsIcons,
      weatherMinMaxTemp,
      weatherConditions
    );
  } catch (error) {
    console.log(error);
  }
}

/***************************************************************************************/

// get the data
function getDaysName(currentDay) {
  const d = new Date();
  let threeDays = [];
  threeDays.push(days[d.getDay() % 7]);
  threeDays.push(days[(d.getDay() + 1) % 7]);
  threeDays.push(days[(d.getDay() + 2) % 7]);
  return threeDays;
}

function getMonth() {
  const d = new Date();
  let monthName = months[d.getMonth()];
  return [d.getDate(), monthName];
}

function getWeatherConditions(
  currentCondition,
  tomorrowCondition,
  dayAfterTomorrow
) {
  let conditions = [];
  conditions.push(currentCondition);
  conditions.push(tomorrowCondition);
  conditions.push(dayAfterTomorrow);
  return conditions;
}
function getWeatherConditionsIcons(currentConditionIcon, condition) {
  let conditions = [];
  conditions.push(currentConditionIcon);
  conditions.push(condition[1].day.condition.icon);
  conditions.push(condition[2].day.condition.icon);
  return conditions;
}

function getWeatherMinMax(forecast) {
  let minAndMax = [
    { min: forecast[1].day.mintemp_c, max: forecast[1].day.maxtemp_c },
    { min: forecast[2].day.mintemp_c, max: forecast[2].day.maxtemp_c },
  ];

  return minAndMax;
}

// display current day data
function displayConditions(weatherConditions) {
  currentCondition.innerHTML = weatherConditions[0];
}
function displayCityName(city) {
  cityName.innerHTML = city;
}
function displayDate(days, month) {
  date.innerHTML = days[0] + " " + month[0] + " " + month[1];
}
function displayCurrentTime(currTime) {
  let hours = currTime.split(" ")[1].split(":")[0];
  let minutes = currTime.split(" ")[1].split(":")[1];
  hours = hours == 0 ? 12 : hours;
  time.innerHTML = `${hours % 12}:${minutes}${hours > 12 ? " PM" : " AM"}`;
}
function displayTemp(tempNow, weatherMinMaxTemp) {
  currTemp.innerHTML = tempNow + " °C";
}
function displayTempIcon(weatherTempIcons) {
  let currentIcon = "https:" + weatherTempIcons[0];
  currTempIcon.setAttribute("src", currentIcon);
}
// display weather for future days
function displayFutureWeather(
  days,
  getWeatherConditionsIcons,
  weatherMinMaxTemp,
  weatherConditions
) {
  // weather for the next two days
  futureWeather.innerHTML = "";
  for (let i = 1; i <= 2; i++) {
    futureWeather.innerHTML += `<div class="col-md-6 ">
        <div class="row flex-column  text-center mt-5">
          <span class="day h4">${days[i]}</span>
         
          <img src="https:${
            getWeatherConditionsIcons[i]
          }" class="w-25 m-auto" alt="${weatherConditions[i]}">
          <span class="temp-max h3">${
            weatherMinMaxTemp[i - 1].max + "°C"
          }</span>
          <span class="temp-min h5 fw-light">${
            weatherMinMaxTemp[i - 1].min + "°"
          }</span>
          <span class="condition">${weatherConditions[i]}</span>
          </div>
        </div>`;
  }
}

/***************************************************************************************/
// make weatherApp on every keypress on keyboard
search.addEventListener("keypress", (e) => {
  // getting the search input value and pass it to the weatherApp as param
  weatherApp(e.target.value);
});
/***************************************************************************************/

/***************************************************************************************/

// call weatherApp when the page load with cairo as default city
// this will be execute one time
weatherApp("cairo");
