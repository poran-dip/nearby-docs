const express = require("express");
const axios = require("axios");
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
    { id: 1, name: "Dr. Sharma", specialization: "Cardiologist", qualification: "MBBS, MD", lat: 26.1445, lng: 92.1362, rating: 4.8, status: "available" },
    { id: 2, name: "Dr. Das", specialization: "Neurologist", qualification: "MBBS, DM", lat: 26.1500, lng: 91.7400, rating: 4.5, status: "free" },
    { id: 3, name: "Dr. Sen", specialization: "Pediatrician", qualification: "MBBS, DCH", lat: 26.1390, lng: 91.7350, rating: 4.2, status: "DND" },
    { id: 4, name: "Dr. Goswami", specialization: "Orthopedic", qualification: "MBBS, MS", lat: 26.1412, lng: 91.7425, rating: 4.7, status: "available" },
    { id: 5, name: "Dr. Patowary", specialization: "Dermatologist", qualification: "MBBS, MD", lat: 26.1478, lng: 91.7501, rating: 4.3, status: "free" },
    { id: 6, name: "Dr. Borah", specialization: "ENT Specialist", qualification: "MBBS, MS", lat: 26.1456, lng: 91.7389, rating: 4.6, status: "available" },
    { id: 7, name: "Dr. Saikia", specialization: "Oncologist", qualification: "MBBS, MCh", lat: 26.1499, lng: 91.7433, rating: 4.1, status: "DND" },
    { id: 8, name: "Dr. Barman", specialization: "Psychiatrist", qualification: "MBBS, MD", lat: 26.1423, lng: 91.7465, rating: 4.9, status: "available" },
    { id: 9, name: "Dr. Kalita", specialization: "Gynecologist", qualification: "MBBS, MD", lat: 26.1482, lng: 91.7398, rating: 4.4, status: "free" },
    { id: 10, name: "Dr. Dutta", specialization: "General Physician", qualification: "MBBS, MD", lat: 26.1437, lng: 91.7412, rating: 4.5, status: "available" }
];

// Fetch real distance using Google Maps Distance Matrix API
async function getDistance(origin, destination) {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

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
app.get("/api/v1/doctor/request", async (req, res) => {
    const { lat, lng } = req.query;
    const userLocation = `${lat},${lng}`;

    const doctorsWithDistance = await Promise.all(doctors.map(async (doc) => {
        const doctorLocation = `${doc.lat},${doc.lng}`;
        const { distance, duration } = await getDistance(userLocation, doctorLocation);
        return { ...doc, distance, duration };
    }));

    res.json({ doctors: doctorsWithDistance });
});
