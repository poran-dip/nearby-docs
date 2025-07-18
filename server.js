const express = require("express");
require("dotenv").config(); // load API keys from .env

const app = express();
const PORT = 3000;

app.use(express.static("public")); // serve frontend files

app.get("/api/config", (req, res) => {
    res.json({ googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY });
});

console.log("Loaded API Key:", process.env.GOOGLE_MAPS_API_KEY);

app.listen(3000, () => console.log(`Server running on http://localhost:${PORT}`));

// Dummy doctors
const doctors = [
    { 
        id: 1, 
        name: "Dr. Priya Iyer", 
        specialization: "Cardiologist", 
        qualification: "MBBS, MD", 
        lat: 28.6139, 
        lng: 77.2090, 
        rating: 4.9, 
        status: "available" 
    },
    { 
        id: 2, 
        name: "Dr. Jean Dupont", 
        specialization: "Neurologist", 
        qualification: "MD", 
        lat: 48.8566, 
        lng: 2.3522, 
        rating: 4.7, 
        status: "free" 
    },
    { 
        id: 3, 
        name: "Dr. Hiroshi Tanaka", 
        specialization: "Pediatrician", 
        qualification: "MD, PhD", 
        lat: 35.6895, 
        lng: 139.6917, 
        rating: 4.2, 
        status: "DND" 
    },
    {
        id: 4,
        name: "Dr. Ethan Park",
        specialization: "Internal Medicine",
        qualification: "MD, FACP",
        lat: 40.7128,
        lng: -74.0060,
        rating: 4.8,
        status: "available"
    },
    { 
        id: 5, 
        name: "Dr. Carlos Mendoza", 
        specialization: "Dermatologist", 
        qualification: "MD", 
        lat: -34.6037, 
        lng: -58.3816, 
        rating: 4.5, 
        status: "free" 
    },
    { 
        id: 6, 
        name: "Dr. Emily Clarke", 
        specialization: "ENT Specialist", 
        qualification: "MBBS, MS", 
        lat: 51.5072, 
        lng: -0.1276, 
        rating: 4.6, 
        status: "available" 
    },
    { 
        id: 7, 
        name: "Dr. Wang Wei", 
        specialization: "Oncologist", 
        qualification: "MD, PhD", 
        lat: 31.2304, 
        lng: 121.4737, 
        rating: 4.8, 
        status: "DND" 
    },
    { 
        id: 8, 
        name: "Dr. Bongani Mthembu", 
        specialization: "Psychiatrist", 
        qualification: "MBBS, MD", 
        lat: -26.2041, 
        lng: 28.0473, 
        rating: 4.9, 
        status: "available" 
    },
    { 
        id: 9, 
        name: "Dr. Anastasia Volkov", 
        specialization: "Gynecologist", 
        qualification: "MD, PhD", 
        lat: 55.7558, 
        lng: 37.6173 , 
        rating: 4.4, 
        status: "free" 
    },
    { 
        id: 10, 
        name: "Dr. Lucas Silva", 
        specialization: "General Physician", 
        qualification: "MBBS", 
        lat: -23.5505, 
        lng: -46.6333, 
        rating: 4.5, 
        status: "available" 
    }
];

// Fetch real distance using Google Maps Distance Matrix API
async function getDistance(origin, destination) {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.rows[0].elements[0].status === "OK") {
            return {
                distance: data.rows[0].elements[0].distance.text, // e.g., "5.2 km"
                duration: data.rows[0].elements[0].duration.text, // e.g., "12 mins"
            };
        } else {
            return { distance: "N/A", duration: "N/A" };
        }
    } catch (error) {
        console.error("Error fetching distance:", error);
        return { distance: "Error", duration: "Error" };
    }
}

// Endpoint: Find nearby doctors with real road distance
app.get("/api/doctor/request", async (req, res) => {
    const { lat, lng } = req.query;
    const userLocation = `${lat},${lng}`;

    const doctorsWithDistance = await Promise.all(doctors.map(async (doc) => {
        const doctorLocation = `${doc.lat},${doc.lng}`;
        const { distance, duration } = await getDistance(userLocation, doctorLocation);
        return { ...doc, distance, duration };
    }));

    res.json({ doctors: doctorsWithDistance });
});
