document.addEventListener('DOMContentLoaded', () => {
const apikey = "c8ed76bb15c094b69f5fcb9169d4b02b"
const searchBarInput = document.querySelector(".input");
const searchBtn = document.querySelector(".searchBtn");
const defaultCity = "Karachi";
const tempToggleBtn = document.getElementById('temp-toggle');
    let isCelsius = true;

function userInput(){
    const input = searchBarInput.value.trim();
    // console.log(input)
    if (input) {
        dataFetching(input);
        searchBarInput.value = ""
    } else {
        displayError("Please enter a city name.");
    }
}
dataFetching(defaultCity)

function dataFetching(city){
const apiUrl = ` https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apikey}&units=metric`;
clearError()

if(city){
    fetch(apiUrl)
    .then((res)=>{
        if(!res.ok){
            throw new error ("City not Found")
        }
       return  res.json()
    })
    .then((data)=>{
        clearError()
        clearForecast()
             // console.log(data.city.name)
             // console.log(data)
             updateLocationData(data)
             weatherInfo(data)
             fiveDaysForecaste(data)
             hourlyForecast(data)       
         })
     .catch((err)=>{
        console.log(err)
        displayError("City Not Found, Please check the spelling and try again.")
     })

}
else  {
    displayError("Please Search city and try again")
}
}

//Error Handling (if city not found or empty search)
function displayError(errorMessage){
const errorContainer = document.getElementById("error-container");
if(!errorContainer){
    const newErrorContainer = document.createElement("div");
    newErrorContainer.id = "error-container";
    newErrorContainer.classList.add("alert");
    newErrorContainer.classList.add("alert-danger");
    newErrorContainer.textContent = errorMessage;

    document.body.prepend(newErrorContainer)
}
else{
    errorContainer.textContent = errorMessage
}
}
//Removing Error 
function clearError(){
const errorContainer = document.getElementById("error-container");
   if(errorContainer){
errorContainer.remove()
   } 
}

function clearForecast() {
    const forecastCard = document.querySelector(".forecast-card");
    const hrForecastColumn = document.querySelector(".hr-forcast-column");
    forecastCard.innerHTML = '';
    hrForecastColumn.innerHTML = '';
}

searchBtn.addEventListener("click",userInput)

function fetchingDateFromCurrentDate(date){
    const options = { weekday: 'long', day: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-US', options);
}

function updateLocationData(data){
    const cityName = document.getElementById("city");
    const country = document.getElementById("country");
    const time = document.getElementById("time");
    const date = document.getElementById("date");

    cityName.innerText = `${data.city.name}`
    country.innerText = `City of ${data.city.country}`

    const currentTimeandDate = new Date((Date.now() + data.city.timezone ));
    console.log(currentTimeandDate)

    time.innerText = `${currentTimeandDate.toLocaleTimeString().slice(0,5)} ${(currentTimeandDate.getHours()) >=12 ? "PM" : "AM" }`
   
    date.innerText = fetchingDateFromCurrentDate(currentTimeandDate)
}
function toCamelCase(weatherDescription){
    return weatherDescription.split(' ').map(word=>word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
}
function unixTimeStamptoReadableTime(unixTime,timezoneOffset){
const date = new Date (unixTime *1000)

const localDate = new Date(date.getTime() + timezoneOffset * 1000);

const hrs = localDate.getUTCHours();
const minutes = localDate.getUTCMinutes();

const formattedTime = `${hrs % 12 || 12}:${minutes.toString().padStart(2, '0')} ${hrs >= 12 ? 'PM' : 'AM'}`; 
return formattedTime;
}

function weatherInfo(data){
    document.getElementById("temp").innerText = `${Math.round((data.list[0].main.temp))} °C`
   document.getElementById("feel-like").innerText = `Feels Like ${data.list[0].main.feels_like} °C`;
  document.getElementById("description").innerText = toCamelCase(data.list[0].weather[0].description);
const timezoneOffset  = 18000;
   document.getElementById("sunrise-time").innerText = unixTimeStamptoReadableTime(data.city.sunrise,timezoneOffset)
   document.getElementById("sunset-time").innerText = unixTimeStamptoReadableTime(data.city.sunset,timezoneOffset);
  document.getElementById("weather-icon").src = `http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`

   document.getElementById("humidity-text").textContent = `${data.list[0].main.humidity}% Humidity`;
   document.getElementById("wind-text").textContent = `${data.list[0].wind.speed} km/h Wind`

}

const forcastCard = document.querySelector(".forecast-card");

function fiveDaysForecaste(data){

    for(let i = 1; i< 6;i++){
        const intervals = data.list[i * 7];
        // console.log(intervals)

        const forcastElement = document.createElement("div");
        forcastElement.classList.add("forecast-item")
        forcastElement.classList.add("row")
        forcastElement.classList.add("align-items-center");

        const forcasteImage = document.createElement("div");
        forcasteImage.classList.add("col-3")
        const img = document.createElement("img");
        img.src = `http://openweathermap.org/img/wn/${intervals.weather[0].icon}@2x.png`;
        img.alt = `${intervals.weather[0].description}`
       const iconDescription = document.createElement("p");
       iconDescription.classList.add("col-2");
       iconDescription.innerText = `${intervals.weather[0].description}`
        const temperature = document.createElement("p");
        temperature.classList.add("col-2")
        temperature.innerText = `${Math.round((intervals.main.temp))}°C `
        const forcasteDate = document.createElement("p");
        forcasteDate.classList.add("col-5")
        forcasteDate.innerText = fetchingDateFromCurrentDate(new Date(intervals.dt * 1000));

  forcasteImage.appendChild(img);
  forcastElement.appendChild(forcasteImage);
  forcastElement.appendChild(iconDescription);
  forcastElement.appendChild(temperature);
  forcastElement.appendChild(forcasteDate);

  forcastCard.appendChild(forcastElement)
        }
}

const hourly_Forecast = document.querySelector(".hr-forcast-column");

function hourlyForecast(data){
for(let i = 0; i<=5 ;i++){
    const forcast = data.list[i]
// console.log(forcast)

    const hourlyColumn = document.createElement("div");
    hourlyColumn.classList.add("col-3")
    hourlyColumn.classList.add("mx-4")
    hourlyColumn.classList.add("mt-3")
    const hourlyItem = document.createElement("div");
    hourlyItem.classList.add("hourly-item");
    hourlyItem.classList.add("py-2");
    const hrlyTime = document.createElement("p");
    hrlyTime.innerText = `${forcast.dt_txt.slice(11,16)}`;
    const weather_Img = document.createElement("p");
    const weatherImg = document.createElement("img");
    weatherImg.src = `http://openweathermap.org/img/wn/${forcast.weather[0].icon}@2x.png`
    const tempe = document.createElement("p");
    tempe.innerText = `${Math.round((forcast.main.temp))}°C`
    const windSpeed = document.createElement("p");
windSpeed.innerText = `${forcast.wind.speed} km/h`

weather_Img.appendChild(weatherImg);
    hourlyItem.appendChild(hrlyTime);
    hourlyItem.appendChild(weather_Img);
    hourlyItem.appendChild(tempe);
    hourlyItem.appendChild(windSpeed);
hourlyColumn.appendChild(hourlyItem);

hourly_Forecast.appendChild(hourlyColumn);
}
}

//Conversion ceslcius to farheinhet
tempToggleBtn.addEventListener('click', () => {
    const tempElement = document.getElementById('temp');
    const feelLikeElement = document.getElementById('feel-like');
    let temp = parseFloat(tempElement.textContent);
    let feelLike = parseFloat(feelLikeElement.textContent.split(' ')[2]);

    if (isCelsius) {
        temp = (temp * 9/5) + 32;
        feelLike = (feelLike * 9/5) + 32;
        tempElement.textContent = `${Math.round(temp)} °F`;
        feelLikeElement.textContent = `Feels Like ${Math.round(feelLike)} °F`;
        tempToggleBtn.textContent = '°C';
    } else {
        temp = (temp - 32) * 5/9;
        feelLike = (feelLike - 32) * 5/9;
        tempElement.textContent = `${Math.round(temp)} °C`;
        feelLikeElement.textContent = `Feels Like ${Math.round(feelLike)} °C`;
        tempToggleBtn.textContent = '°F';
    }
    isCelsius = !isCelsius;
});
})




