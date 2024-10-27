document.getElementById('getWeather').addEventListener('click', function() {
    const city = document.getElementById('city').value;
    fetchWeather(city);
});

document.getElementById('getCurrentLocation').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchWeather(`${latitude},${longitude}`);
        }, () => {
            alert("Unable to retrieve your location. Please try again.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

function fetchWeather(query) {
    const apiKey = '5fbfe587f7ea4e9aa4480350242710';
    const currentUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${query}`;
    const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=7`; // 7 days forecast

    document.getElementById('loader').style.display = 'block'; // Show loader

    // Fetch current weather and forecast simultaneously
    Promise.all([
        fetch(currentUrl).then(response => response.json()),
        fetch(forecastUrl).then(response => response.json())
    ])
    .then(([currentData, forecastData]) => {
        document.getElementById('loader').style.display = 'none'; // Hide loader
        
        // Handle current weather data
        if (currentData.error) {
            document.getElementById('weatherResult').innerHTML = `<p class="text-danger">${currentData.error.message}</p>`;
            document.getElementById('additionalInfo').innerHTML = ''; // Clear additional info
            return; // Exit if there's an error
        }

        const { name, region, country } = currentData.location;
        const { temp_c, condition, humidity, wind_kph } = currentData.current;

        // Display current weather and additional info
        document.getElementById('weatherResult').innerHTML = 
            `<h2>Weather in ${name}, ${region}, ${country}</h2>
            <p>Temperature: ${temp_c}°C</p>
            <p>Condition: ${condition.text}</p>
            <img src="${condition.icon}" alt="${condition.text}" class="condition-icon">`;
        
        document.getElementById('additionalInfo').innerHTML = 
            `<p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${wind_kph} km/h</p>`;

        // Handle forecast data
        const forecastDays = forecastData.forecast.forecastday;
        let forecastHtml = '<h3 class="mt-4">Next 7 Days Forecast</h3><div class="row">';

        forecastDays.forEach(day => {
            const date = new Date(day.date).toLocaleDateString();
            const { avgtemp_c, condition } = day.day;
            forecastHtml += 
                `<div class="col-md-4">
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">${date}</h5>
                            <p class="card-text">Avg Temp: ${avgtemp_c}°C</p>
                            <p class="card-text">${condition.text}</p>
                            <img src="${condition.icon}" alt="${condition.text}" class="forecast-icon card-img-bottom">
                        </div>
                    </div>
                </div>`;
        });

        forecastHtml += '</div>';
        document.getElementById('forecast').innerHTML = forecastHtml;
    })
    .catch(error => {
        document.getElementById('loader').style.display = 'none'; // Hide loader
        document.getElementById('weatherResult').innerHTML = `<p class="text-danger">Error fetching data</p>`;
        document.getElementById('additionalInfo').innerHTML = ''; // Clear additional info
        document.getElementById('forecast').innerHTML = ''; // Clear forecast info
    });

    // Display current date and time
    const currentDateTime = new Date();
    document.getElementById('currentDateTime').innerText = currentDateTime.toLocaleString();
}
