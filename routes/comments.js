var express = require ("express");
var router = express.Router({mergeParams: true});
var campground = require ("../models/campground");
var comment = require ("../models/Comment");
var middleware = require("../Middleware");

router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req, res){
    comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});



router.get("/new",middleware.isLoggedIn, function(req, res){
    // find campground by id
    campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    });
});
//==========================
router.post("/", middleware.isLoggedIn, function(req, res){
   //lookup campground using ID
   campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash("error", "Something went wrong")
               console.log(err);
           } else {
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               comment.save();
               campground.comments.push(comment);
               campground.save();
               req.flash("success","Comment successfully added")
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
});
router.put("/:comment_id", function(req, res){
    comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){
   comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else{
           req.flash("success","Comment deleted")
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});

module.exports = router;