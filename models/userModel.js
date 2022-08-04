const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter name to create account'],
    },
    email: {
        type: String,
        required: [true, 'Please enter email to create account'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email address'],
    },
    photo: {
        type: String,
    },
    password: {
        type: String,
        required: [true, 'Please enter a password to create an account'],
        minLength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // this only works on .CREATE or .SAVE, not update
            validator: function (pw) {
                return pw === this.password;
            },
            message: 'Please enter matching passwords',
        },
    },
    passwordChangedAt: {
        type: Date,
        // select: false,
    },
});

// pre-save middleware:
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

// instance method: is a method that is availible on all docs of a certain collection
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// instance method:
// to check if the password was changed after the timeStamp was created
userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
    if (this.passwordChangedAt) {
        // getting passwords in seconds
        const passwordChangedTimeStamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        // if token was created before passwordChanged
        return JWTTimeStamp < passwordChangedTimeStamp;
    }

    // false means NOT changed
    return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
