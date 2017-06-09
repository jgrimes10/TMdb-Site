// Variable to store my key
var APPID = "5781af763ba07122222476cb2a4032ee";
// Variables to store weather info
var temp, loc, icon, humidity, wind, direction;

// Function to call weather information using entered zip code if HTML could not find geolocation
function UpdateByZip(zip)
{
    var url = "http://api.openweathermap.org/data/2.5/weather?zip=" + zip + "&APPID=" + APPID;

    sendRequest(url);
}

// Function to handle sending the request for weather information
function sendRequest(url)
{
    // Create the request
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            // Parse the response
            var data = JSON.parse(xmlhttp.responseText);
            // Create the weather object
            var weather = {};
            // Set weather variables based on info received from api
            weather.icon = data.weather[0].icon;
            weather.humidity = data.main.humidity;
            weather.wind = data.wind.speed;
            weather.direction = DegtoDirection(data.wind.deg);
            weather.loc = data.name;
            weather.temp = KtoF(data.main.temp);

            // Update the weather in the widget
            Update(weather);
        }
    };
    // Send the request
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

// Function to handle updating the weather info in the widget
function Update(weather)
{
    wind.innerHTML = weather.wind;
    direction.innerHTML = weather.direction;
    humidity.innerHTML = weather.humidity;
    loc.innerHTML = weather.loc;
    temp.innerHTML = weather.temp;
    icon.src = "http://openweathermap.org/img/w/" + weather.icon + ".png";
}

// Get references to HTML elements in the site
window.onload = function()
{
    temp = document.getElementById("temperature");
    loc = document.getElementById("location");
    icon = document.getElementById("icon");
    humidity = document.getElementById("humidity");
    wind = document.getElementById("wind");
    direction = document.getElementById("direction");

    var weather = {};

    // Try to grab the user's geolocation if supported
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(ShowPosition);
    }
    // If cannot get geolocation, pop up a prompt to ask for zipcode to use for weather request
    else
    {
        var zip = window.prompt("Could not discover location. Please enter zip code for weather data.");
        UpdateByZip(zip);
    }
}

// Grab the coordinates if obtained and pass them on to the update function
function ShowPosition(position)
{
    UpdateByGeo(position.coords.latitude, position.coords.longitude);
}
// Uses it's own url for api request, this one uses latitude and longitude from geolocation if applicable
function UpdateByGeo(lat, long)
{
    var url = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&APPID=" + APPID;

    sendRequest(url);
}

// Temp received is in Kelvin by default, this function converts it to celcius if needed
function KtoC(kelvin)
{
    return Math.round(kelvin - 273.15);
}
// The default, convert the Kelvin temperature to F
function KtoF(kelvin)
{
    return Math.round(kelvin*(9/5)-459.67);
}

// The wind direction is received in degrees, conver that to the directions
// most people are familiar with
function DegtoDirection(degrees)
{
    // Divide the 360 degree circle into the amount of options you want to use (4, 8, or 16)
    var range = 360/16;
    // Get the low part of the range for each division of the circle for directions
    var low = 0 - range / 2;
    // Get the high part of the range for each division of the circle for directions
    var high = (low + range) % 360;
    // Create an array for each of the degrees we want to use, must change these if you want to use only 4 or 8 divisions
    var angles = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];

    // Go through each of directions and test it's low and high part of the range to see where it falls in
    for (i = 0; i < angles.length; i++)
    {
        // If we are in the range
        if (degrees >= low && degrees < high || degrees > 360 - range / 2)
        {
            // Return the direction where the degree falls in the range
            return angles[i];
        }

        // If we get down here, then it wasn't in this range, move the low and high to the next division
        low = (low + range) % 360;
        high = (high + range) % 360;
    }
}