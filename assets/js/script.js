
// variables

let APIKey = "56753a59062baeaae0d9efab9fa5986c";
let storedSearches;
let forecastHigh = -100;
let forecastLow = 200;
let averageWindSpeed = 0;
let averageHumidity = 0;
let current = document.getElementById("current");
let forecast = document.getElementById("forecast");
let searchForm = document.getElementById("searchForm");
let searchInput = document.getElementById("searchInput");
let searchHistory = document.getElementById("searchHistory");




// let date = new Date(data.dt * 1000).toLocaleTimeString("en-US", {
//     weekday: "long",
//     year: "numeric",
//     month: "short",
//     day: "numeric",
// });
// console.log(date);
// console.log(date.toLocaleTimeString("en-US"));




// functions

function renderLocalStorage() {
    searchHistory.innerHTML = "";
    
    for (let i = 0; i < storedSearches.length; i++){
        let searchHistoryDiv = document.createElement("div");
        searchHistoryDiv.className - "searchHistoryDiv";

        let searchHistoryBtn = document.createElement("button");
        searchHistoryBtn.textContent = storedSearches[i];
        searchHistoryDiv.append(searchHistoryBtn);
        searchHistory.append(searchHistoryDiv);
    }
}

function getLocalStorage() {
    storedSearches = [];
    storedSearches = JSON.parse(localStorage.getItem("searches")) || [];
    renderLocalStorage();
}

function renderCurrentWeather(data) {
    current.innerHTML = "";
    let name = document.createElement("div");
    name.textContent = data.name;
    current.append(name);

    let date = document.createElement("div");
    date.textContent = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
    });
    // console.log(date);
    // console.log(date.toLocaleTimeString("en-US"));
    current.append(date);

    let temp = document.createElement("div");
    temp.textContent = data.main.temp;
    // console.log(temp);
    current.append(temp);

    let humidity = document.createElement("div");
    humidity.textContent = data.main.humidity;
    current.append(humidity);

    let windspeed = document.createElement("div");
    windspeed.textContent = data.main.windspeed;
    current.append(windspeed);

    let icon = document.createElement("img");
    icon.src = "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
    current.append(icon);

}

function displayCurrent(name) {
    let cityName = name;
    let cityQuery = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial" + "&appid=" + APIKey;

    fetch(cityQuery)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            console.log(data);
            renderCurrentWeather(data);
        })
        .catch(function (err) {
            console.log(err);
        });
}

function renderForecast(data) {
    let infoIndex = [7, 15, 23, 31, 39];
    forecastHigh.innerHTML = "";
    for (let i = 0; i < data.list.length; i++) {
        let forecastCard = document.createElement("div");
        let forecastIcon = document.createElement("img");

        if (data.list[i].main.temp_max > forecastHigh) {
            forecastHigh = data.list[i].main.temp_max;
        }
        if (data.list[i].main.temp_max > forecastLow) {
            forecastLow = data.list[i].main.temp_min;
        }

        averageHumidity = averageHumidity + data.list[i].main.humidity;
        averageWindSpeed = averageWindSpeed + data.list[i].wind.speed;

        if (infoIndex.includes(i)) {
            console.log("i", i);
            highTemp = document.createElement("div");
            highTemp.textContent = "High: " + parseInt(forecastHigh);
            forecastCard.append(highTemp);
            forecastHigh = -100;

            lowTemp = document.createElement("div");
            lowTemp.textContent = "Low: " + parseInt(forecastLow);
            forecastCard.append(lowTemp);
            forecastLow = 200;

            humidity = document.createElement("div");
            humidity.textContent = "Humidity: " + parseInt(averageHumidity / 8);
            forecastCard.append(humidity);
            averageHumidity = 0;

            windSpeed = document.createElement("div");
            windSpeed.textContent = "Wind: " + parseInt(averageWindSpeed / 8);
            forecastCard.append(windSpeed);
            forecastHigh = 0;

            forecastIcon.src = "https://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + "@2x.png"
            forecast.append(forecastIcon);
            forecast.append(forecastCard);
        }
    }
}

function displayForecast(name) {
    let cityName = name;
    let forecastQuery = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial" + "&appid=" + APIKey;

    fetch(forecastQuery)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            console.log(data);
            renderForecast(data);
        })
        .catch(function (err) {
            console.log(err);
        });
}

function searchCity(e) {
    e.preventDefault();
    displayCurrent(searchInput.value);
    displayForecast(searchInput.value);
    storedSearches.push(searchInput.value);
    localStorage.setItem("search", JSON.stringify(storedSearches))
}

// calls - listeners

searchForm.addEventListener("submit", searchCity);

getLocalStorage();