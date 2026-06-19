const Listing = require("../models/listing");

module.exports.index = async (req,res)=>{
    const allListing = await Listing.find({});
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

          newlisting.image ={
            url:req.file.path,
            filename:req.file.filename,
          };

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
        await Listing.findByIdAndUpdate(id, {...req.body.listing});

        if(req.file){
            updatelisting.image = {
                url:req.file.path,
                filename:req.file.filename,
            };
            await listing.save();
        }
        req.flash("success", "Listing updated");
        res.redirect(`/listings/${id}`);
      };


      module.exports.destroyListing = async(req,res)=>{
        let {id} = req.params;
        await Listing.findByIdAndDelete(id);
        req.flash('success' , "Listing Deleted");
        res.redirect("/listings");
      };