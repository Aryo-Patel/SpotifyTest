/*
   This is information that is stored when a user creates an account. We hash in our actual project much more thoroughly
*/

const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    }
})

const User = new mongoose.model("Users", UserSchema);

module.exports = User;