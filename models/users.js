const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        admin: {
            type: Boolean,
            default: false
        }
    }
);

userSchema.plugin(passportLocalMongoose);

const user = mongoose.model('user', userSchema);

module.exports = user;