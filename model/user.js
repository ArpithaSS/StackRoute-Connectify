const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    city: String,
    password: String
});

module.exports= mongoose.model("User", userSchema,"Users");