const apikey = "c8ed76bb15c094b69f5fcb9169d4b02b"
const searchBarInput = document.querySelector(".input");
const searchBtn = document.querySelector(".searchBtn");


function userInput(){
    const input = searchBarInput.value;
    // console.log(input)
    dataFetching(input)
}


function dataFetching(city){
const apiUrl = ` https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apikey}&units=metric`;

   fetch(apiUrl)
   .then((res)=> res.json()
        .then((data)=>{
            // console.log(data.city.name)
            console.log(data)
            updateLocationData(data)
            weatherInfo(data)
            fiveDaysForecaste(data)
        })
    ).catch((err)=>console.log(err))
    
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

    time.innerText = `${currentTimeandDate.toLocaleTimeString().slice(0,5)}`
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
    document.getElementById("temp").innerText = `${data.list[0].main.temp} °C`
   document.getElementById("feel-like").innerText = `Feels Like ${data.list[0].main.feels_like} °C`;
  document.getElementById("description").innerText = toCamelCase(data.list[0].weather[0].description);
const timezoneOffset  = 18000;
   document.getElementById("sunrise-time").innerText = unixTimeStamptoReadableTime(data.city.sunrise,timezoneOffset)
   document.getElementById("sunset-time").innerText = unixTimeStamptoReadableTime(data.city.sunset,timezoneOffset);

   document.getElementById("humidity").innerText = `${data.list[0].main.humidity}% Humidity`;
   document.getElementById("wind").innerText = `${data.list[0].wind.speed} km/h Wind`
}

function fiveDaysForecaste(data){

}

