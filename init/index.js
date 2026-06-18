const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing");

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(mongo_url);
}

const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, Owner: "6a341471ef3c6866da45a6ee"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
    await mongoose.connection.close();
};

initDB();
