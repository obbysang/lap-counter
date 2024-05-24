document.getElementById('get-started').addEventListener('click', () => {
    document.getElementById('landing-page').classList.add('hidden');
    document.getElementById('setup-page').classList.remove('hidden');
});

document.getElementById('enable-gps').addEventListener('click', () => {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            document.getElementById('current-position').textContent = `${latitude}, ${longitude}`;
        });
    } else {
        alert('Geolocation is not supported by your browser');
    }
});

document.getElementById('start-tracking').addEventListener('click', () => {
    document.getElementById('setup-page').classList.add('hidden');
    document.getElementById('tracking-page').classList.remove('hidden');

    if ('geolocation' in navigator) {
        navigator.geolocation.watchPosition(position => {
            const { latitude, longitude } = position.coords;
            document.getElementById('current-position').textContent = `${latitude}, ${longitude}`;
            // Additional logic for tracking laps and distance goes here
        });
    }

    startTimer();
});

document.getElementById('stop-tracking').addEventListener('click', () => {
    document.getElementById('tracking-page').classList.add('hidden');
    document.getElementById('summary-page').classList.remove('hidden');
    // Display summary data
});

function startTimer() {
    let startTime = Date.now();
    setInterval(() => {
        let elapsedTime = Date.now() - startTime;
        let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
        let minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
        document.getElementById('timer').textContent = 
            `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }, 1000);
}

function pad(number) {
    return number.toString().padStart(2, '0');
}

//////////////////////MAPS FUNCTIONALITY///////////////////////
document.addEventListener('DOMContentLoaded', function () {
    const mapElement = document.getElementById('map');
    if (mapElement) {
        // Initialize the map
        const map = L.map('map').setView([0, 0], 13); // Default view

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // Function to update map with user's location
        function updateMap(position) {
            const { latitude, longitude } = position.coords;
            const latLng = [latitude, longitude];

            // Set map view to user's location
            map.setView(latLng, 13);

            // Add a marker for the user's location
            L.marker(latLng).addTo(map).bindPopup('You are here!').openPopup();

            // Update the current position display
            document.getElementById('current-position').textContent = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        }

        // Handle geolocation success
        function handleGeolocationSuccess(position) {
            updateMap(position);
        }

        // Handle geolocation error
        function handleGeolocationError(error) {
            console.error('Geolocation error:', error);
            alert('Unable to retrieve your location.');
        }

        // Get the user's current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(handleGeolocationSuccess, handleGeolocationError);
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    }
});

