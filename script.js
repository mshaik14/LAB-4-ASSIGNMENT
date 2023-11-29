document.addEventListener('DOMContentLoaded', function () {
    const geolocationBtn = document.getElementById('geolocation-btn');
    const locationSelect = document.getElementById('location-select');
    const locationInput = document.getElementById('location-input');
    const searchBtn = document.getElementById('search-btn');
    const dashboardSection = document.getElementById('dashboard');
    const errorMessageSection = document.getElementById('error-message');

    // Event listener for "Use Current Location" button
    geolocationBtn.addEventListener('click', function () {
        getLocationAndFetchData();
    });

    // Event listener for "Search" button
    searchBtn.addEventListener('click', function () {
        const location = locationInput.value || locationSelect.value;

        if (location) {
            displayLoader();
            fetchData(location);
        } else {
            displayErrorMessage('Please enter a location.');
        }
    });

    // Function to get current geolocation and fetch data
    function getLocationAndFetchData() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const { latitude, longitude } = position.coords;
                    displayLoader();
                    fetchData(`${latitude},${longitude}`);
                },
                function (error) {
                    hideLoader();
                    displayErrorMessage('Error getting current location.');
                    console.error('Geolocation error:', error);
                }
            );
        } else {
            displayErrorMessage('Geolocation is not supported by your browser.');
        }
    }

    // Function to make API request and update the dashboard
    function fetchData(location) {
        const apiUrl = `https://api.sunrise-sunset.org/json?lat=${location.split(',')[0]}&lng=${location.split(',')[1]}`;

        // Log the API URL to the console
        console.log('API URL:', apiUrl);

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                // Log the API response to the console
                console.log('API Response:', data);

                hideLoader();
                if (data.status === 'OK') {
                    updateDashboard(data.results);
                } else {
                    displayErrorMessage(`Error: ${data.status}`);
                }
            })
            .catch(error => {
                hideLoader();
                displayErrorMessage('An error occurred while fetching data.');
                console.error('Fetch error:', error);
            });
    }

    // Function to update the dashboard with sunrise/sunset data
    function updateDashboard(results) {
        // Update the dashboard section with the data from the API response
        dashboardSection.innerHTML = `
            <h2>Today's Sunrise: ${results.sunrise}</h2>
            <h2>Today's Sunset: ${results.sunset}</h2>
            <h2>Today's Dawn: ${results.dawn}</h2>
            <h2>Today's Dusk: ${results.dusk}</h2>
            <h2>Today's Day Length: ${results.day_length}</h2>
            <h2>Today's Solar Noon: ${results.solar_noon}</h2>
            
            <h2>Tomorrow's Sunrise: ${results.tomorrow_sunrise}</h2>
            <h2>Tomorrow's Sunset: ${results.tomorrow_sunset}</h2>
            <h2>Tomorrow's Dawn: ${results.tomorrow_dawn}</h2>
            <h2>Tomorrow's Dusk: ${results.tomorrow_dusk}</h2>
            <h2>Tomorrow's Day Length: ${results.tomorrow_day_length}</h2>
            <h2>Tomorrow's Solar Noon: ${results.tomorrow_solar_noon}</h2>
        `;
        errorMessageSection.style.display = 'none';
    }

    // Function to display error messages
    function displayErrorMessage(message) {
        errorMessageSection.textContent = message;
        errorMessageSection.style.display = 'block';
        dashboardSection.innerHTML = ''; // Clear the dashboard on error
    }

    // Function to display loader
    function displayLoader() {
        dashboardSection.innerHTML = '<div class="loader"></div>';
        errorMessageSection.style.display = 'none';
    }

    // Function to hide loader
    function hideLoader() {
        dashboardSection.innerHTML = '';
    }
});
