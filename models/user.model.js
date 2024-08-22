/**
 * User model schema
 * @module models/user.model
 * @requires mongoose
 * 
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userSchema = new Schema({
    userID: {
        type: String,
        default: `USER${Math.floor(1000 + Math.random() * 9000)}`,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
    },
   
    
    },{
        timestamps: true,
    });

    module.exports = mongoose.model("User", userSchema);
