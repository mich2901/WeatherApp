const app = document.querySelector('.weather-app');
const temp = document.querySelector('.temp');
const dateOutput = document.querySelector('.date');
const timeOutput = document.querySelector('.time');
const conditionOutput = document.querySelector('.condition');
const nameOutput = document.querySelector('.name')
const icon = document.querySelector('.icon');
const cloudOutput = document.querySelector('.cloud');
const humidityOutput = document.querySelector('.humidity');
const windOutput = document.querySelector('.wind');
const form = document.getElementById('locationInput');
const city = document.getElementById('city');
const country = document.getElementById('country');
const btn = document.querySelector('.submit');
const cities = document.querySelectorAll('.city');
const countries = document.querySelector('.country');

var countryInput = "England";
var cityInput = "London";
var countryCode = "EN";
var lang = "en"

cities.forEach((city) => {
    city.addEventListener('click', async (e) =>{
        let cityClicked = e.target.innerHTML;
        const parts = cityClicked.split(',');
        cityInput = parts[0].trim();
        countryInput = parts[1].trim();
        app.style.opacity = "0";
        await fetchCountryCode();
        await fetchWeatherData();
        sleep(300)
        app.style.opacity = "1";
    });
})

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if((city.value.length == 0) || (country.value.length == 0)){
        alert('Please write country and city');
    } else {
        cityInput = city.value;
        countryInput = country.value;
        app.style.opacity = "0";

        await fetchCountryCode();
        await fetchWeatherData();
        
        city.value = "";
        country.value = "";
        sleep(300)
        app.style.opacity = "1";
    }
});

function dayOfTheWeek(day, month, year) {
    const weekday = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return weekday[new Date(dateStr).getDay()];
}

async function fetchCountryCode(){
    const request = `https://restcountries.com/v3.1/name/${countryInput}`;
    await fetch(request)
    .then(response => response.json())
    .then(data => {
        if (data && data.length > 0) {
            countryCode = data[0].cca2; // Obtener el código del país (ISO 3166-1 alpha-2)
            console.log(`Country code for ${countryInput} is ${countryCode}`);
        } else {
            console.log(`No country found with name ${countryInput}`);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

async function fetchWeatherData() {
    const apiId = 'f85504dfcb4f4aaf85a03854241806';
    request = `https://api.weatherapi.com/v1/current.json?key=${apiId}&q=${cityInput},${countryCode}&aqi=no&lang=${lang}`
    await fetch(request)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        temp.innerHTML = data.current.temp_c + "&#176;";
        conditionOutput.innerHTML = data.current.condition.text;

        const date = data.location.localtime;
        const y = parseInt(date.substr(0,4));
        const m = parseInt(date.substr(5,2));
        const d = parseInt(date.substr(8,2));
        const time = date.substr(11);

        dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}, ${m} ${y}`;
        timeOutput.innerHTML = time;
        nameOutput.innerHTML = data.location.name;


        cloudOutput.innerHTML = data.current.cloud + "%";
        humidityOutput.innerHTML = data.current.humidity + "%";
        windOutput.innerHTML = data.current.wind_kph + "km/h";

        let timeOfDay = "day";
        const code = data.current.condition.code;

        if(!data.current.is_day){
            timeOfDay = "night";
        }

        if(code == 1000){
            app.style.backgroundImage = `url(./src/images/${timeOfDay}/clear.jpg)`;
            btn.style.background = "#e5ba92";
            icon.src = 'src/icons/day/clear.png';
            if(timeOfDay == "night"){
                btn.style.background = "#181e27"
                icon.src = 'src/icons/night/clear.png';;
            }
        }else if(
            code == 1003 ||
            code == 1006 ||
            code == 1009 ||
            code == 1030 ||
            code == 1069 ||
            code == 1087 ||
            code == 1135 ||
            code == 1273 ||
            code == 1276 ||
            code == 1279 ||
            code == 1282
        ){
            app.style.backgroundImage = `url(./src/images/${timeOfDay}/cloudy.jpg)`;
            btn.style.background = "#fa6d1b";
            icon.src = 'src/icons/day/cloudy.png';
            if(timeOfDay == "night"){
                btn.style.background = "#181e27";
                icon.src = 'src/icons/night/cloudy.png';
            }
        }else if(
            code == 1063 ||
            code == 1069 ||
            code == 1072 ||
            code == 1150 ||
            code == 1153 ||
            code == 1180 ||
            code == 1183 ||
            code == 1186 ||
            code == 1189 ||
            code == 1192 ||
            code == 1195 ||
            code == 1204 ||
            code == 1207 ||
            code == 1240 ||
            code == 1243 ||
            code == 1249 ||
            code == 1252
        ){
            app.style.backgroundImage = `url(./src/images/${timeOfDay}/rainy.jpg)`;
            btn.style.background = "#647d75";
            icon.src = 'src/icons/day/rainy.png';
            if(timeOfDay == "night"){
                btn.style.background = "#325c80";
                icon.src = 'src/icons/night/rainy.png';
            }
        }else{
            app.style.backgroundImage = `url(./src/images/${timeOfDay}/snowy.jpg)`;
            btn.style.background = "#4d72aa";
            icon.src = 'src/icons/day/snowy.png';
            if(timeOfDay == "night"){
                btn.style.background = "#1b1b1b";
                icon.src = 'src/icons/night/snowy.png';
            }
        }
    })
    .catch(() => {
        alert('City not found, please try again');
    });
    sleep(300);
    app.style.opacity = "1";
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

fetchWeatherData();
