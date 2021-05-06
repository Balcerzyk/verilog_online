import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose'

const User = mongoose.Schema({
    username: String,

},{
    timestamps: true
})

User.plugin(passportLocalMongoose, {usernameField: 'username'})

export default mongoose.model("User", User);