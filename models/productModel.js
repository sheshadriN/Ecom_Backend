const mongoose = require('mongoose'); 

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim: true
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase: true
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        // type:mongoose.Schema.Types.ObjectId,
        type: String,
        // ref: "Category"
        required: true
    },
    brand:{
      type: String,
    //   enum: ["Apple", "Samsung", "Vivo"]
    required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    sold:{
      type:Number,
      default:0,
    //   select:false  to hide in response
    },
    images:[],
    color: {
        type: String,
        // enum: ['Black', 'Brown', "Red"]
        required: true
    },
    ratings:[
        {
            star: Number,
            comment: String,
            postedby:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"User"
            }
        }
    ],
    totalRating:{
        type:String,
        default:0
    }    
},
{
    timestamps:true
});

//Export the model
module.exports = mongoose.model('Product', productSchema);