const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type: String,
        default:"user"
    },
    isBlocked: {
       type: Boolean,
       default: false
    },
    cart: {
        type: Array,
        default: []
    },
    address:{
        type: String
    },
    wishlist:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Product"
    }],
    refreshToken:{
        type:String
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
},
{
    timestamps:true
}
);

//to store hash password in db
userSchema.pre("save", async function(next){
    if(!this.isModified('password')){
        next();
    }
    const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_VALUE));
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

//to checked password is matched or not
userSchema.methods.isPasswordMatched = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

//createPasswordResetToken
userSchema.methods.createPasswordResetToken = async function(){
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000; //10 min
    return resetToken;
}

//Export the model
module.exports = mongoose.model('User', userSchema);