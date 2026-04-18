const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");


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


app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.listen(8080,()=>{
    console.log("server is running");
});


app.get("/listings", async (req,res)=>{
    const allListing = await listing.find({});
    res.render("listing/index.ejs", {allListing});
});

app.get("/listings/new", (req,res)=>{
    res.render("listing/new.ejs");
});

app.get("/listings/:id", async(req,res)=>{
    let {id}= req.params;
   const singlelisting = await listing.findById(id);
   res.render("listing/show.ejs",{singlelisting});
})

app.post("/listings",async(req,res)=>{
    const newlisting = new listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
});

app.get("/listings/:id/edit",async(req,res)=>{
    let {id}= req.params;
   const singlelisting = await listing.findById(id);
   res.render("listing/edit.ejs", { singlelisting });
});

app.put("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    await listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
});

  app.delete("/listings/:id", async (req,res)=>{
      let {id} = req.params;
      let deletelisting = await listing.findByIdAndDelete(id);
      res.redirect("/listings");
});

app.get("/",(req,res)=>{
    res.send("hi im ready to work");
});