const apiKey = '69c3075bd46da15fbd74e47dc3a82632'; // Replace with your OpenWeatherMap API key
const weatherIcon = document.getElementById('weatherIcon');
const temperature = document.getElementById('temperature');
const city = document.getElementById('city');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const pressure = document.getElementById('pressure');
const error = document.getElementById('error');
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');

async function fetchWeatherByCity(cityName) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`
        );
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();
        displayWeather(data);
        error.classList.add('hidden');
    } catch (err) {
        showError();
    }
}

async function fetchWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        );
        if (!response.ok) throw new Error('Location not found');
        const data = await response.json();
        displayWeather(data);
        error.classList.add('hidden');
    } catch (err) {
        showError();
    }
}

function displayWeather(data) {
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    city.textContent = data.name;
    description.textContent = data.weather[0].description;
    humidity.textContent = `${data.main.humidity}%`;
    wind.textContent = `${data.wind.speed} km/h`;
    pressure.textContent = `${data.main.pressure} hPa`;
}

function showError() {
    error.classList.remove('hidden');
    city.textContent = 'Not Found';
    temperature.textContent = '--°C';
    description.textContent = '--';
    humidity.textContent = '--%';
    wind.textContent = '-- km/h';
    pressure.textContent = '-- hPa';
    weatherIcon.src = '';
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoords(latitude, longitude);
            },
            () => {
                showError();
            }
        );
    } else {
        showError();
    }
}

searchBtn.addEventListener('click', () => {
    const cityName = cityInput.value.trim();
    if (cityName) fetchWeatherByCity(cityName);
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const cityName = cityInput.value.trim();
        if (cityName) fetchWeatherByCity(cityName);
    }
});

locationBtn.addEventListener('click', getLocation);

// Fetch weather for default city on load
fetchWeatherByCity('London');