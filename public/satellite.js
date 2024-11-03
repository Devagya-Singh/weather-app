document.getElementById('getSatelliteFeed').addEventListener('click', function() {
    const city = document.getElementById('city').value || "Bhubaneswar"; // Default city for demo
    const apiKey = 'YSvVi8uIBnefD16xfzvxjaIYSfXEf6w2kQxjcIrB';

    // Use the same logic to get coordinates as in your main script
    const weatherApiKey = '7898193361d34c54984122045242710';
    const geocodingUrl = `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${city}`;

    fetch(geocodingUrl)
        .then(response => response.json())
        .then(data => {
            const { lat, lon } = data.location; // Extract coordinates
            const date = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format
            const satelliteUrl = `https://api.nasa.gov/planetary/earth/assets?lon=${lon}&lat=${lat}&date=${date}&dim=0.1&api_key=${apiKey}`;

            return fetch(satelliteUrl);
        })
        .then(response => response.json())
        .then(data => {
            if (!data.url) {
                throw new Error("No satellite image available for this location and date");
            }
            document.getElementById('satelliteImage').innerHTML = 
                `<img src="${data.url}" alt="Satellite Image" class="satellite-img" />`;
        })
        .catch(error => {
            document.getElementById('satelliteImage').innerHTML = 
                `<p class="text-danger">Error fetching satellite image: ${error.message}</p>`;
        });
});
