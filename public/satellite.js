document.getElementById('getSatelliteFeed').addEventListener('click', function() {
    const city = document.getElementById('city').value || "Bhubaneswar"; // Default city for demo
    const apiKey = 'YOUR_SATELLITE_API_KEY';
    const satelliteUrl = `https://api.nasa.gov/planetary/earth/assets?lon=YOUR_LON&lat=YOUR_LAT&date=YOUR_DATE&dim=0.1&api_key=${apiKey}`;

    fetch(satelliteUrl)
        .then(response => response.json())
        .then(data => {
            document.getElementById('satelliteImage').innerHTML = 
                `<img src="${data.url}" alt="Satellite Image" class="satellite-img" />`;
        })
        .catch(error => {
            document.getElementById('satelliteImage').innerHTML = `<p class="text-danger">Error fetching satellite feed</p>`;
        });
});
