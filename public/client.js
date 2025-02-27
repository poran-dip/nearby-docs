async function loadGoogleMaps() {
    const res = await fetch("/api/config");
    const data = await res.json();
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${data.googleMapsApiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}
loadGoogleMaps();

function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const map = new google.maps.Map(document.getElementById("map"), {
                center: { lat, lng },
                zoom: 14
            });

            new google.maps.Marker({
                position: { lat, lng },
                map,
                title: "You are here",
                icon: { url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" } // different color for user
            });

            const response = await fetch(`/api/v1/doctor/request?lat=${lat}&lng=${lng}`);
            const data = await response.json();

            data.doctors.forEach(doc => {
                new google.maps.Marker({
                    position: { lat: doc.lat, lng: doc.lng },
                    map,
                    title: `${doc.name} - ${doc.specialization}`,
                    icon: { url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" } // red for doctors
                });
            });
        }, () => alert("Geolocation failed."));
    } else {
        alert("Geolocation not supported.");
    }
}

window.initMap = initMap;

async function fetchDoctors() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const response = await fetch(`/api/v1/doctor/request?lat=${lat}&lng=${lng}`);
            const data = await response.json();
            displayDoctors(data.doctors);
        }, () => alert("Geolocation failed."));
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function displayDoctors(doctors) {
    const list = document.getElementById("doctor-list");
    list.innerHTML = "";
    doctors.forEach(doc => {
        const item = document.createElement("li");
        item.innerHTML = `
            ${doc.name} - ${doc.specialization} - Rating: ${doc.rating} 
            - Distance: ${doc.distance} - Travel Time: ${doc.duration}
            <button id="request-btn-${doc.id}" onclick="requestDoctor('${doc.id}')">Request</button>
        `;
        list.appendChild(item);
    });
}
