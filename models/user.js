var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose")

var userSchema = new mongoose.Schema ({
    username: String,
    passsword: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", userSchema);