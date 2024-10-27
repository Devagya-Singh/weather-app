document.getElementById('getWeather').addEventListener('click', function() {
    const city = document.getElementById('city').value;
    fetchWeather(city);
});

document.getElementById('getCurrentLocation').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchWeather(`latitude=${latitude}&longitude=${longitude}`);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

function fetchWeather(city) {
    const apiKey = '5fbfe587f7ea4e9aa4480350242710';
    const currentUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3`;

    document.getElementById('loader').style.display = 'block'; // Show loader

    // Fetch current weather
    fetch(currentUrl)
        .then(response => response.json())
        .then(data => {
            document.getElementById('loader').style.display = 'none'; // Hide loader
            if (data.error) {
                document.getElementById('weatherResult').innerHTML = `<p class="text-danger">${data.error.message}</p>`;
            } else {
                const { name, region, country } = data.location;
                const { temp_c, condition } = data.current;
                document.getElementById('weatherResult').innerHTML = 
                    `<h2>Weather in ${name}, ${region}, ${country}</h2>
                    <p>Temperature: ${temp_c}°C</p>
                    <p>Condition: ${condition.text}</p>
                    <img src="${condition.icon}" alt="${condition.text}">`;
            }
        })
        .catch(error => {
            document.getElementById('loader').style.display = 'none'; // Hide loader
            document.getElementById('weatherResult').innerHTML = `<p class="text-danger">Error fetching data</p>`;
        });

    // Fetch forecast
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            const forecastDays = data.forecast.forecastday;
            let forecastHtml = '<h3 class="mt-4">Next 3 Days Forecast</h3><div class="row">';

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
                                <img src="${condition.icon}" alt="${condition.text}" class="card-img-bottom">
                            </div>
                        </div>
                    </div>`;
            });

            forecastHtml += '</div>';
            document.getElementById('forecast').innerHTML = forecastHtml;
        })
        .catch(error => {
            document.getElementById('forecast').innerHTML = `<p class="text-danger">Error fetching forecast data</p>`;
        });
}
