document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('getWeather').addEventListener('click', fetchAlerts);
    document.getElementById('getCurrentLocation').addEventListener('click', fetchAlerts);
});

function fetchAlerts() {
    const city = document.getElementById('city').value || "Bhubaneswar"; // Default city for demo
    const apiKey = '7898193361d34c54984122045242710';
    const alertUrl = `https://api.weatherapi.com/v1/alerts.json?key=${apiKey}&q=${city}`;

    fetch(alertUrl)
        .then(response => response.json())
        .then(data => {
            if (data.alerts.length > 0) {
                let alertHtml = '<h4 class="text-danger">Severe Weather Alerts</h4>';
                data.alerts.forEach(alert => {
                    alertHtml += `
                        <div class="alert alert-danger">
                            <strong>${alert.event}</strong>
                            <p>${alert.description}</p>
                        </div>`;
                });
                document.getElementById('weatherAlerts').innerHTML = alertHtml;
            } else {
                document.getElementById('weatherAlerts').innerHTML = "<p>No severe weather alerts.</p>";
            }
        })
        .catch(error => {
            document.getElementById('weatherAlerts').innerHTML = `<p class="text-danger">Error fetching alerts</p>`;
        });
}
