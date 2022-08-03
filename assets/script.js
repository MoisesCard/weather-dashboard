var formEl = document.querySelector(".search-form")
var citySearchEl = document.querySelector("#city");
var currentDayContainer = document.querySelector(".current-day-content")
var fiveDayWrapper = document.querySelector(".five-day-wrapper");
var historyWrapper = document.querySelector(".history")
var deleteBtn = document.querySelector(".delete-btn")



var formSubmitHandler = function (event) {
    event.preventDefault();
    var cityName = citySearchEl.value.trim();
    cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);

    if (cityName) {
        getCurrentCityWeather(cityName);
        getFiveDayForcast(cityName);
        citySearchEl.value = "";
        createHistoryButton();
    } else {
        alert("Please input a city!");
        formSubmitHandler();
    }
}

var saveCities = function (city) {
    var currentCity = JSON.parse(localStorage.getItem('cityItems')) || [];
    let set =new Set(currentCity);
    set.add(city);
    var newArr = Array.from(set);
    localStorage.setItem('cityItems', JSON.stringify(newArr));
};

var deleteHistory = function() {
    localStorage.clear();
    location.reload();
}

var historyClickHandler = function (event) {
    var historyEl = event.target.getAttribute("data-city");
    if (historyEl) {
        getCurrentCityWeather(historyEl);
        getFiveDayForcast(historyEl)
    }
};

var getCurrentCityWeather = function(city) {
    
    var weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?q="+ city + "&appid=0938c05e8d987103f9ba5cb07b6b876e&units=imperial";
    fetch(weatherApiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                displayCurrentCityWeather(data);
                getCurrentUvIndex(data);
                saveCities(city);
            })
        } else {
            alert("Please insert a valid city!");
        }
    });
};

var createHistoryButton = function() {
    var cityName = JSON.parse(localStorage.getItem('cityItems')) || [];

    historyWrapper.innerHTML = "";
    for (var i = 0; i < cityName.length; i++) {
        var historyBtn = document.createElement("button");
        historyBtn.className = "historybtn"
        historyBtn.textContent = cityName[i];
        historyBtn.setAttribute("data-city",  cityName[i]);
        historyWrapper.appendChild(historyBtn);
    }
}
createHistoryButton();


var getFiveDayForcast = function (city) {
    var fiveDayUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=0938c05e8d987103f9ba5cb07b6b876e&units=imperial";
    fetch(fiveDayUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                displayFiveDayForcast(data);
            });
        } else {
            alert("Could not find 5-day forcast");
        }
    });
};

var getCurrentUvIndex = function(data) {
    var uvApiUrl = "http://api.openweathermap.org/data/2.5/uvi?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&appid=0938c05e8d987103f9ba5cb07b6b876e";
    fetch(uvApiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                displayCurrentUvIndex(data);
            });
        } else {
            alert('There was a problem fetching UV Index!');
        }
    });
};

var displayCurrentCityWeather = function (data) {
    var currentCityEl = document.querySelector("#current-city");
    var weatherImg = document.querySelector(".weather-img");
    var tempEl = document.querySelector("#temp");
    var humidityEl = document.querySelector("#humidity");
    var windEl = document.querySelector("#wind");

    var currentCity = data.name;

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
        fiveDayDates.className = "five-day-date";
        fiveDayDates.textContent = fiveDayDate;
        fiveDayCard.appendChild(fiveDayDates);

        var fiveDayImg = document.createElement("img")
        fiveDayImg.setAttribute("src", "http://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + "@2x.png");
        fiveDayImg.setAttribute("class", "five-day-img");
        fiveDayCard.appendChild(fiveDayImg);

        var fiveDayTemp = document.createElement("p");
        fiveDayTemp.textContent = "Temp: " + Math.floor(data.list[i].main.temp) + " F";
        fiveDayTemp.className = "five-day-temp";
        fiveDayCard.appendChild(fiveDayTemp);

        var fiveDayHumidity = document.createElement("p");
        fiveDayHumidity.textContent = "Humidity: " + data.list[i].main.humidity + "%";
        fiveDayHumidity.className = "five-day-humidity";
        fiveDayCard.appendChild(fiveDayHumidity);
    }
}

var displayCurrentUvIndex = function(data) {
    var uvEl = document.querySelector("#uv");

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
historyWrapper.addEventListener("click", historyClickHandler);
deleteBtn.addEventListener("click", deleteHistory);