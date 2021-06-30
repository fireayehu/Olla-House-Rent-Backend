const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
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
        minlength: [2, 'first name should contain atleast 2 characters!'],
        maxlength: [24, 'first name should contain at maximum 24 characters!']
    },
    lastname: {
        type: String,
        required: [true, "last name is required"],
        minlength: [2, 'last name should contain atleast 2 characters!'],
        maxlength: [24, 'last name should contain at maximum 24 characters!']
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
        default: true,
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
    if (!this.isNew) this.passwordChangedAt = Date.now() - 1000;

    this.password = await bcrypt.hash(this.password, 12);
    next();
});

/**
 * fetch only active users
 */
userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});

/**
 * @method
 * Custom method for password comparision
 */
userSchema.methods.comparePassword = async (inputPassword, storedPassword) => {
    return bcrypt.compare(inputPassword, storedPassword);
}

const User = model('User', userSchema);

module.exports = User;