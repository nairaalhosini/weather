const API_KEY = '5add6b5a9eee4922a72201239240912';
const BASE_URL = 'http://api.weatherapi.com/v1/forecast.json';

const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('searchBtn');
const weatherContainer = document.getElementById('weather-container');

async function fetchWeather(query) {
  const url = `${BASE_URL}?key=${API_KEY}&q=${query}&days=3`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error fetching weather data');
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

function displayWeather(data) {
    const locationName = data.location.name; 
    const currentDate = new Date(data.location.localtime); 
    const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'long' }); 
    const date = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); 
  
    const currentWeather = data.current; 
  
    weatherContainer.innerHTML = '';
  
    
    const currentWeatherCard = document.createElement('div');
    currentWeatherCard.className = 'weather-card current-weather';
  
    currentWeatherCard.innerHTML = `
      <h2>${locationName}</h2>
      <h3>${dayOfWeek}, ${date}</h3>
      <img src="http:${currentWeather.condition.icon}" alt="Weather Icon" />
      <p>${currentWeather.condition.text}</p>
      <p><strong>Temperature:</strong> ${currentWeather.temp_c}°C</p>
      <p><strong>Humidity:</strong> ${currentWeather.humidity}%</p>
      <p><strong>Wind:</strong> ${currentWeather.wind_kph} km/h</p>
    `;
  
    weatherContainer.appendChild(currentWeatherCard);
  
    const forecast = data.forecast.forecastday.slice(1); 
    forecast.forEach(day => {
      const date = new Date(day.date);
      const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
  
      const iconUrl = `http:${day.day.condition.icon}`;
  
      const weatherCard = document.createElement('div');
      weatherCard.className = 'weather-card';
  
      weatherCard.innerHTML = `
        <h3>${weekday}</h3>
        <img src="${iconUrl}" alt="Weather Icon" />
        <p>${day.day.condition.text}</p>
        <p><strong></strong> ${day.day.maxtemp_c}°C</p>
        <p><strong></strong> ${day.day.mintemp_c}°C</p>
      `;
  
      weatherContainer.appendChild(weatherCard);
    });
  }
  

function fetchUserLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        fetchWeather(`${latitude},${longitude}`);
      },
      error => {
        console.error('Error getting location:', error);
        alert('Unable to retrieve your location. Please search manually.');
      }
    );
  } else {
    alert('Geolocation is not supported by your browser.');
  }
}

searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchWeather(query);
  } else {
    alert('Please enter a country or city name!');
  }
});

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim();
  if (query.length > 2) {
    fetchWeather(query);
  }
});

fetchUserLocationWeather();
