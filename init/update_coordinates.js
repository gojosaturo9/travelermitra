const mongoose = require("mongoose");
const Listing = require("../models/listing");

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("Connected to DB for geocoding update");
    updateAllCoordinates();
})
.catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(mongo_url);
}

async function geocodeLocation(locationText) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationText)}&format=json&limit=1`;
    try {
        const response = await fetch(url, {
            headers: { 'User-Agent': 'TravelMitra/1.0' }
        });
        const data = await response.json();
        if(data && data.length > 0) {
            return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        }
    } catch(err) {
        console.error(`Geocoding failed for: ${locationText}`, err);
    }
    return { lat: 20.5937, lng: 78.9629 }; // India default coordinates fallback
}

// Delay helper to respect Nominatim API rate limit (1 request/sec)
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function updateAllCoordinates() {
    try {
        const listings = await Listing.find({
            $or: [
                { coordinates: { $exists: false } },
                { "coordinates.lat": { $exists: false } }
            ]
        });

        console.log(`Found ${listings.length} listings needing coordinates. Starting update...`);

        for (let i = 0; i < listings.length; i++) {
            const listing = listings[i];
            console.log(`[${i + 1}/${listings.length}] Geocoding: ${listing.location}, ${listing.country}`);
            
            const coords = await geocodeLocation(`${listing.location}, ${listing.country}`);
            listing.coordinates = coords;
            await listing.save();
            
            // Respect API rate limit
            await delay(1000);
        }

        console.log("All listings updated successfully with coordinates!");
    } catch (err) {
        console.error("Error during coordinates update:", err);
    } finally {
        await mongoose.connection.close();
        console.log("Database connection closed.");
    }
}
