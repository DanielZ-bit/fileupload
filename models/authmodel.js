const mongoose = require("mongoose");
bcryptjs = require("bcryptjs");
jwt = require("jsonwebtoken");
const authSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter Name'],
        minLength: 3,
        maxLength: 50,
    },
    email: {
        type: String,
        required: [true, 'Please Enter Email'],
        match: [
           /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1, 3}\.[0-9]{1, 3}\.[0-9]{1, 3}\.[0-9]{1, 3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'please provide valid email'
        ],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please Enter Password'],
        minLength: 6,
}
})

authSchema.pre("save", async function(){
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
})

authSchema.methods.createJWT= function(){return jwt.sign({UserID: this._id, name: this.name},process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME})};

authSchema.methods.comparePasswords = async function(userPassword){
    const passmatch =  await bcryptjs.compare( userPassword, this.password)
    return passmatch;
}

module.exports = mongoose.model("user", authSchema)