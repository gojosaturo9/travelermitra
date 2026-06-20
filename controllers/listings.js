const Listing = require("../models/listing");

async function geocodeLocation(locationText) {
    const url = `https://nominatim.openstreetmap.org/search?
    q=${encodeURIComponent(locationText)}&format=json&limit=1`;

    const response = await fetch(url, {
        headers: { 'User-Agent':'Wanderlust/1.0'}
    });

    const data = await response.json();
    if(data.length>0){
        return {lat:parseFloat(data[0].lat), lng:parseFloat(data[0].lon)};
    }
    return {lat:20.5937,lng:78.9629};
}
module.exports.index = async (req,res)=>{
    let {title} = req.query;
    let query = {};
    if(title){
        query = {
            $or:[
            {title:{$regex:title, $options:"i"}},
            {location: {$regex: title , $options:"i"}},
            {country:{$regex:title , $options:"i"}}
            ]
        };
    }
    const allListing = await Listing.find(query);

    if(title && allListing.length === 0){
        req.flash("error" , "No listings found matching your search!");
        return res.redirect("/listings");
    }
    res.render("listing/index.ejs", {allListing});
};

module.exports.renderNewForm = (req,res)=>{   
    res.render("listing/new.ejs");
};

module.exports.showListing = async(req,res)=>{
          let {id}= req.params;
          const singlelisting = await Listing.findById(id)
          .populate({
            path:"reviews",
            populate:{
                path:"author",
            },
          })
          .populate("Owner");

          if(!singlelisting){
              req.flash("error", "Listing you requested for does not exist");
              return res.redirect("/listings");
          }

          res.render("listing/show.ejs",{singlelisting});
      };

        module.exports.createListing = async(req,res , next)=>{
          const newlisting = new Listing(req.body.listing);
          newlisting.Owner = req.user._id;

        
          newlisting.coordinates = await geocodeLocation(req.body.listing.location);

          if (req.file) {
              newlisting.image = {
                  url: req.file.path,
                  filename: req.file.filename,
              };
          } else {
              newlisting.image = {
                  url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3",
                  filename: "defaultlistingimage"
              };
          }

          await newlisting.save();
          req.flash("success", "Successfully made a new listing!");
          res.redirect(`/listings/${newlisting._id}`);
      };

      module.exports.renderEditForm = async(req,res)=>{
        let {id} = req.params;
        const singlelisting = await Listing.findById(id);
        if(!singlelisting){
            req.flash("error" , "Listing you requested for does not exist");
            return res.redirect("/listings");
        }
        res.render("listing/edit.ejs", {singlelisting});
      };


      module.exports.updateListing = async(req,res)=>{
        let {id} = req.params;
        let updateListing = await Listing.findByIdAndUpdate(id, {...req.body.listing}, { new: true });
        
        if(req.body.listing.location){
            updateListing.coordinates = await geocodeLocation(req.body.listing.location);
        }

        if(req.file){
            updateListing.image = {
                url:req.file.path,
                filename:req.file.filename,
            };
        }
        
        await updateListing.save();
        req.flash("success", "Listing updated");
        res.redirect(`/listings/${id}`);
      };


      module.exports.destroyListing = async(req,res)=>{
        let {id} = req.params;
        await Listing.findByIdAndDelete(id);
        req.flash('success' , "Listing Deleted");
        res.redirect("/listings");
      };