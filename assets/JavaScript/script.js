var apiKey = "d9b099fc04a5210096f59561e00d0156"
var weatherData = []
var pastChoices = JSON.parse(localStorage.getItem("Cities")) || []
var searchForm = document.querySelector("#search-form")

// TODO: get user selected city, get coordinates
searchForm.addEventListener("submit", chooseCity)


function chooseCity(event){
    event.preventDefault()
    var userInput = document.querySelector("#city-search").value.toLowerCase()
    var requestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${userInput}&limit=5&appid=${apiKey}`
    fetch(requestUrl)
    .then(function (response) {
      return response.json(); 
    })
    .then(function(data){
        var latitude = data[0].lat;
        var longitude = data[0].lon;
        getWeather(latitude, longitude)
    })
    .catch(err => {
      alert("Error- Please enter a valid city name")
    })
    searchForm.reset()
    }

    function getWeather(lat, lon){
      var requestUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
      var requestUrlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`

      fetch(requestUrlForecast)
      .then(function(response){
        return response.json();
      })
      .then(function(data){
       saveCities(data.city.name)
       fiveDayForecast(data)
        console.log(data)
      })

      fetch(requestUrlCurrent)
      .then(function(response){
        return response.json();
      })
      .then(function(data){
        currentForecast(data)
        console.log(data)
      })

    }

// TODO: Save cities in local storage, generate buttons to search for them again
function saveCities(city){
  if(city !== "") {
    var x = pastChoices.includes(city)
    if (!x) {
    pastChoices.unshift(city)
    localStorage.setItem("Cities", JSON.stringify(pastChoices));
}
  }
  renderCities()
}
function renderCities(){
  var cityListEl = document.querySelector("#favorites")
  var newList = pastChoices.slice(0,5)
  cityListEl.innerHTML=""
  for (var i = 0; i < newList.length; i++){
    var cityList = document.createElement("li")
    cityList.setAttribute("class", "list-group-item favorite-city text-center")
    cityListEl.appendChild(cityList)
    cityList.innerHTML = `${newList[i].toUpperCase()}`
  }
cityListEl.addEventListener("click", function(event){
  var text = event.target.textContent
  var input = document.querySelector("#city-search")
  input.value = text
})
}
// TODO: generate current weather card with API info

function currentForecast(data){
  var weatherCardEl = document.querySelector("#current-weather")
  weatherCardEl.innerHTML = 
`<div class = "card p-2">
<h1>${data.name}</h1>
<h2>${dayjs().format("M/D")}</h2>
<h2>${Math.floor(data.main.temp)}°</h2>
<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather icon" height="100px" width = "100px">
<ul id = "current-forecast-ul">
    <li>Wind Speed: ${data.wind.speed}</li>
    <li>Humidity: ${data.main.humidity}%</li>
</ul>
</div>`

}


// TODO: Generate five day forcast with API info

function fiveDayForecast(data){
  var forecastEl = document.querySelector("#five-day-forecast")
  forecastEl.innerHTML = ""
  for (var i = 7; i < 40; i+=8){
  var forecast = document.createElement("div")
  forecast.setAttribute("class", "card col-md-2 col-sm-6 m-3")
  forecast.innerHTML = 
  `<h2 class = "card-title">${dayjs(data.list[i].dt_txt).format("M/D")}</h2>
  <h3 class= "card-subtitle">${Math.floor(data.list[i].main.temp)}°</h3>
  <img src="https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png" alt="Weather icon" height="100px" width="100px">
  <ul class = "list-group list-group-flush">
      <li class="list-group-item">Wind Speed: ${data.list[i].wind.speed}</li>
      <li class="list-group-item">Humidity: ${data.list[i].main.humidity}%</li>
  </ul>`
    forecastEl.appendChild(forecast)
  }
}

renderCities()