const mongoose = require('mongoose');


const schema = mongoose.Schema;
const userSchema = new schema({
    name:String,
    email:String
})
const user = mongoose.model('users',userSchema)

module.exports = user;