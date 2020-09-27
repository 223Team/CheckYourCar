const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require('bcrypt')
const saltRounds = 10;

var userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: [true, "This can not be empty"]
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            unqiue: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Email is not valid!")
                }
            }
        },
        password: {
            type: String,
            // minlength: 8,
            required: [true, "This can not be empty"]
        },
        retypedPassword: {
            type: String,
        },
        carWork: {
            type: String,
            required: [true, "This can not be empty"]
        },
        carModel: {
            type: String,
            required: [true, "This can not be empty"]
        },
    }
)

userSchema.pre('save', function (next) {
    var user = this;
    bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err)
            return next(err);
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err)
                return next(err);

            user.password = hash;
            user.retypedPassword = hash;

            next();
        })
    })

})

userSchema.methods.comparePassword = function (cadidatePassword, cb) {
    bcrypt.compare(cadidatePassword, this.password, function (err, isMatch) {
        if (err)
            return cb(err);
        cb(null, isMatch);
    })
}


module.exports = mongoose.model("User", userSchema)
