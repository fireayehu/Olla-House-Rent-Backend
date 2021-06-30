const { Schema, Model } = require('mongoose');
const bycrypt = require('bycrypt');
const validator = require('validator');
/**
 * User Schema 
 * @param {String} firstname - first name of the user
 * @param {String} lastname - last name of the user 
 * @param {string} password - user password
 */
const userSchema = new Schema({
    firstname: {
        type: String,
        required: [true, "first name is required"],
        minlength: [2, 'User name should contain atleast 2 characters!'],
        maxlength: [24, 'User name should contain at maximum 24 characters!']
    },
    lastname: {
        type: String,
        required: [true, "last name is required"],
        minlength: [2, 'User name should contain atleast 2 characters!'],
        maxlength: [24, 'User name should contain at maximum 24 characters!']
    },
    email: {
        type: String,
        required: [true, 'user should have email!'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Invalid email. Please use valid email!"]
    },
    phone: {
        type: String,
        required: [true, "phone number is required"],
        minlength: [10, "invalid phone number format, too short"],
        maxlength: [14, "invalid phone number format, too long"]
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    avatar: {
        type: String,
    },
    password: {
        type: String,
        required: [true, 'user should have password!'],
        minlength: 6,
        maxlength: 24,
        select: false
    },
    passwordChangedAt: Date,
    createdAt: {
        type: Date,
        default: Date.now(),
        validate: [validator.isDate, "wrong date format"]
    },
    active: {
        type: Boolean,
        default: false,
        select: false
    }
});

/**
 * Pre database save operations 
 */
userSchema.pre('save', async function (next) {
    //don't hash if not modified password
    if (!this.isModified('password')) return next();

    //set password change date is password is not set for first time
    if (!this.isNew('password')) this.passwordChangedAt = Date.now() - 1000;

    this.password = await bycrypt.hash(this.password, 12);
    next();
});

/**
 * fetch only active users
 */
userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});


const User = new Model('User', userSchema);

module.exports = User;