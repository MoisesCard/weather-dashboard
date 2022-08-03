const formEl = document.querySelector(".search-form")
var citySearchEl = document.querySelector("#city");
var currentDayContainer = document.querySelector(".current-day-content")

const formSubmitHandler = function(event) {
    event.preventDefault();
    var cityName = citySearchEl.value.trim();
    if (cityName) {
        getCityWeather(cityName)
        citySearchEl.value = "";
    } else {
        alert("Please input a city!")
    }
    
};

const getCityWeather = function(city) {
    var weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?q="+ city + "&appid=0938c05e8d987103f9ba5cb07b6b876e&units=imperial";
    fetch(weatherApiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
            displayCityWeather(data);
            console.log(data)
            })
        } else {
            alert("Please insert a valid city!")
        }
    });
};

var displayCityWeather = function(data) {
    var currentCityEl = document.querySelector("#current-city");
    var tempEl = document.querySelector("#temp");
    var humidityEl = document.querySelector("#humidity");
    var windEl = document.querySelector("#wind");
    var uvEl = document.querySelector("#uv");

    var currentCity = data.name;

    currentCityEl.textContent = currentCity + "    " + dayjs().format('MM/DD/YYYY');
    tempEl.textContent = Math.floor(data.main.temp);
    humidityEl.textContent = data.main.humidity;
    windEl.textContent = data.wind.speed;
};

formEl.addEventListener("submit", formSubmitHandler);