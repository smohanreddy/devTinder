const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid email address" + value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error("Invalid password" + value);
            }
        }
    },
    age: {
        type: Number,
        min:18,
    },
    gender: {
        type: String,
    },
    about:{
        type: String,
    },
    skills: {
        type: [String],
    },
    photoUrl:{
        type: String,
    }
},{
    timestamps: true,
});

userSchema.methods.getJWT = function() {
    const user = this;
    const token = jwt.sign({_id: user._id}, "mohan@1808$03", {expiresIn: '7d'});
    return token;
}

userSchema.methods.passwordValidate = function(password) {
    const user = this;
    return bcrypt.compare(password, user.password);
}

const User = mongoose.model('User', userSchema);

module.exports = User;