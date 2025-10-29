
// Combine location + country for more accurate geocoding
const locationText = loc;
const countryText = coun;
const fullAddress = `${locationText}, ${countryText}`;
//   console.log(fullAddress);
fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`)
    .then(response => response.json())
    .then(data => {
        if (data.length > 0) {
            console.log(data);
            const lat = data[0].lat;
            const lon = data[0].lon;

            var map = L.map('map').setView([lat, lon], 13);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);
            var marker = L.marker([lat,lon]).addTo(map);

            L.marker([lat, lon]).addTo(map)
          .bindPopup(`<b>${locationText}</b><br>${countryText}`)
          .openPopup();
            // console.log(lat, lon);
        }
    })
    .catch(err => console.error('Geocoding error:', err));


//         // Initialize Leaflet map
//         const map = L.map('map').setView([lat, lon], 13);

//         // Add OpenStreetMap tiles
//         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//           attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
//         }).addTo(map);

//         // Add marker to geocoded location
        
//       } else {
//         console.error('No location found for:', fullAddress);
//         document.getElementById('map').innerHTML =
//           '<p class="text-muted">📍 Location not found on map.</p>';
//       }
//     })
// new L.Control.Geocoder().addTo(map);