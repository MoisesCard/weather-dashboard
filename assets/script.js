const formEl = document.querySelector(".search-form")
const citySearchEl = document.querySelector("#city");
const currentDayContainer = document.querySelector(".current-day-content")
var fiveDayWrapper = document.querySelector(".five-day-wrapper");

const formSubmitHandler = function (event) {
    event.preventDefault();
    const cityName = citySearchEl.value.trim();
    if (cityName) {
        getCurrentCityWeather(cityName);
        getFiveDayForcast(cityName);
        citySearchEl.value = "";
    } else {
        alert("Please input a city!");
    }
};

const getCurrentCityWeather = function(city) {
    const weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?q="+ city + "&appid=0938c05e8d987103f9ba5cb07b6b876e&units=imperial";
    fetch(weatherApiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                displayCurrentCityWeather(data);
                getCurrentUvIndex(data);
            })
        } else {
            alert("Please insert a valid city!");
        }
    });
};

var getFiveDayForcast = function (city) {
    var fiveDayUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=0938c05e8d987103f9ba5cb07b6b876e&units=imperial";
    fetch(fiveDayUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                displayFiveDayForcast(data);
                console.log(data)
            });
        } else {
            alert("Could not find 5-day forcast");
        }
    });
};

const getCurrentUvIndex = function(data) {
    const uvApiUrl = "http://api.openweathermap.org/data/2.5/uvi?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&appid=0938c05e8d987103f9ba5cb07b6b876e";
    fetch(uvApiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                displayCurrentUvIndex(data);
                console.log(data)
            });
        } else {
            alert('There was a problem fetching UV Index!');
        }
    });
};

const displayCurrentCityWeather = function (data) {
    const currentCityEl = document.querySelector("#current-city");
    const weatherImg = document.querySelector(".weather-img");
    const tempEl = document.querySelector("#temp");
    const humidityEl = document.querySelector("#humidity");
    const windEl = document.querySelector("#wind");

    const currentCity = data.name;

    currentCityEl.textContent = currentCity + "    " + dayjs().format('MM/DD/YYYY');
    weatherImg.setAttribute("src", "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");
    tempEl.textContent = Math.floor(data.main.temp);
    humidityEl.textContent = data.main.humidity;
    windEl.textContent = data.wind.speed;
};

var displayFiveDayForcast = function (data) {
    fiveDayWrapper.textContent = ""

    for (var i = 5; i < 38; i += 8) {
        var fiveDayCard = document.createElement("div");
        fiveDayCard.className = "five-day-card";
        fiveDayWrapper.appendChild(fiveDayCard);

        var fiveDayDate = dayjs(data.list[i].dt_txt).format('MM/DD/YYYY');
        var fiveDayDates = document.createElement("h3");
        fiveDayDates.textContent = fiveDayDate;
        fiveDayCard.appendChild(fiveDayDates);

        var fiveDayImg = document.createElement("img")
        fiveDayImg.setAttribute("src", "http://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + "@2x.png");
        fiveDayCard.appendChild(fiveDayImg);

        var fiveDayTemp = document.createElement("p");
        fiveDayTemp.textContent = "Temp: " + Math.floor(data.list[i].main.temp) + " F";
        fiveDayCard.appendChild(fiveDayTemp);

        var fiveDayHumidity =  document.createElement("p");
        fiveDayHumidity.textContent = "Humidity: " + data.list[i].main.humidity + "%";
        fiveDayCard.appendChild(fiveDayHumidity)
    }
}

const displayCurrentUvIndex = function(data) {
    const uvEl = document.querySelector("#uv");

    uvEl.textContent = data.value;
    if (parseInt(uvEl.textContent) <= 2) {
        uvEl.className = "safe-index";
    } else if (3 >= parseInt(uvEl.textContent) <= 5) {
        uvEl.className = "moderate-index";
    } else if (6 >= parseInt(uvEl.textContent) <= 7) {
        uvEl.className = "high-index";
    } else if (8 >= parseInt(uvEl.textContent) <= 10) {
        uvEl.className = "very-high-index";
    } else if (parseInt(uvEl.textContent) > 11) {
        uvEl.className = "extreme-index";
    }

}

formEl.addEventListener("submit", formSubmitHandler);