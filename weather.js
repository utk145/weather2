let weather = {
  "apiKey": "e61b773d1831015a8e2a84c455feac68",
  fetchWeather: function (city) {
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + this.apiKey)
      // .then((response)=>response.json())
      // .then((data)=>this.displayWeather(data));
      .then((response) => {
        if (!response.ok) {
          alert("No weather found for this city. Please try again later or check city name.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => this.displayWeather(data));
  },
  displayWeather: function (data) {
    console.log(data);
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    console.log(name, icon, description, temp, humidity, speed);
    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + " °C";
    document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
    document.querySelector(".windy").innerText = "Wind speed: " + speed + " km/h";
    document.querySelector(".weather").classList.remove("loading");
    document.body.style.backgroundImage =
      "url('https://source.unsplash.com/1600x900/?" + name + "')";
  },
  search: function () {
    this.fetchWeather(document.querySelector(".search-bar").value);
  },
};


// https://opencagedata.com/tutorials/geocode-in-javascript
let geoLocCode = {
  reverseGeoCode: function (latitude, longitude) {
    var api_key = 'a95b120ea56947378b4a5ce939f589c7';

    // reverse geocoding example (coordinates to address)

    var query = latitude + ',' + longitude;

    // forward geocoding example (address to coordinate)
    // var query = 'Philipsbornstr. 2, 30165 Hannover, Germany';
    // note: query needs to be URI encoded (see below)

    var api_url = 'https://api.opencagedata.com/geocode/v1/json'

    var request_url = api_url
      + '?'
      + 'key=' + api_key
      + '&q=' + encodeURIComponent(query)
      + '&pretty=1'
      + '&no_annotations=1';

    // see full list of required and optional parameters:
    // https://opencagedata.com/api#forward

    var request = new XMLHttpRequest();
    request.open('GET', request_url, true);

    request.onload = function () {
      // see full list of possible response codes:
      // https://opencagedata.com/api#codes

      if (request.status === 200) {
        // Success!
        var data = JSON.parse(request.responseText);
        // console.log(data.results[0].components.city); // print the location
        if(data.results[0].components.city!==undefined){
          weather.fetchWeather(data.results[0].components.city);
        }else{
          weather.fetchWeather("Hyderabad")
        }

      } else if (request.status <= 500) {
        // We reached our target server, but it returned an error

        console.log("unable to geocode! Response code: " + request.status);
        var data = JSON.parse(request.responseText);
        console.log('error msg: ' + data.status.message);
      } else {
        console.log("server error");
      }
    };

    request.onerror = function () {
      // There was a connection error of some sort
      console.log("unable to connect to server");
    };

    request.send();  // make the request

  },
  getLocation: function () {
    function success(data) {
      geoLocCode.reverseGeoCode(data.coords.latitude, data.coords.longitude);
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, console.error)
    }else{
      weather.fetchWeather("Hyderabad");
    }
  }
}

document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

document
  .querySelector(".search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      weather.search();
    }
  });

geoLocCode.getLocation();





let isCelsius = true;

function celsiusToFahrenheit(celsius) {
  return (celsius * 9/5) + 32;
}

// toggle between Celsius and Fahrenheit
function toggleUnits() {
  const temperatureElement = document.querySelector(".temp");
  const temperatureValue = parseFloat(temperatureElement.innerText);
  
  if (isCelsius) {
    // Converting to Fahrenheit and update the unit
    const fahrenheit = celsiusToFahrenheit(temperatureValue);
    temperatureElement.innerText = fahrenheit.toFixed(2) + " °F";
  } else {
    // Converting back to Celsius and update the unit
    const celsius = (temperatureValue - 32) * 5/9;
    temperatureElement.innerText = celsius.toFixed(2) + " °C";
  }
  
  isCelsius = !isCelsius; 
}

document.querySelector("#toggleButton").addEventListener("click", toggleUnits);
