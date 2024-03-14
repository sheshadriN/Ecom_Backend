const Product = require('../models/productModel');
const User = require("../models/userModel");
const {validateMongoDbId} = require('../utils/validateMongodbid');
const cloudinaryUploadImg = require("../utils/cloudinary");
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const fs = require('fs');

const createProduct = asyncHandler(async(req, res)=>{
  try{
    if(req.body.title){
        req.body.slug = slugify(req.body.title);
    }
     const newProduct = await Product.create(req.body);
     res.json(newProduct);
  }catch(error){
    throw new Error(error);
  }
});

const updateProduct = asyncHandler(async(req, res) => {
     const {id} = req.params;
     validateMongoDbId(id);
    	try{
        	if(req.body.title){
            	req.body.slug = slugify(req.body.title);
        	}
         	const updatedProduct = await Product.findByIdAndUpdate(id , req.body, {new: true});
         	res.json(updatedProduct);
      	}catch(error){
        	throw new Error(error);
      	}
})

const removeProduct = asyncHandler(async(req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
       try{
            const deletedProduct = await Product.findByIdAndDelete(id);
            res.json(deletedProduct);
         }catch(error){
           throw new Error(error);
         }
})

const getSingleProduct = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
     const findProduct = await Product.findById(id);
     res.json(findProduct);
    }catch(error){
      throw new Error(error);
    }
});

const getAllProduct = asyncHandler(async(req, res)=>{
    try{

      // filtering 
      const queryObj = {...req.query};
      const excludeFields = ["page", "sort", "limit", "fields"];
      excludeFields.forEach((el)=> delete queryObj[el]);
       
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
      let query = Product.find(JSON.parse(queryStr));

     //sorting
     if(req.query.sort){
      const sortBy = req.query.sort.split(',').join(" ");
       query = query.sort(sortBy);
     }else{
        query = query.sort("-createdAt")
     }

     //limiting the field
     if(req.query.fields){
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
     }else{
      query = query.select('-__v')
     }

     //pagination

     const page = req.query.page; //this shows in which page number
     const limit = req.query.limit; //how many product you want to show in the page
     const skip = (page - 1) * limit; //calculating how many items we have to skip
     query = query.skip(skip).limit(limit);
     //if skipped product is greater tHan product we have
     if(req.query.page){
      const productCount = await Product.countDocuments();
      if(skip>= productCount) throw new Error("This Page Doesnot exist.");
     }
          
     const allProducts = await query;
     res.json(allProducts);
    }catch(error){
      throw new Error(error);
    }
});

const addToWishList =  asyncHandler(async(req, res)=>{
  const {_id} = req.user;
  validateMongoDbId(_id);
  const {prodId} = req.body;
  validateMongoDbId(prodId);
    try{
      const user = await User.findById(_id);
      const alreadyAdded = user.wishlist.find((id)=> id.toString() === prodId.toString());
      if(alreadyAdded){
        let user =  await User.findByIdAndUpdate(_id, {
          $pull: { wishlist: prodId}
        },{
          new:true
        });
        res.json(user);
      }else{
        let user =  await User.findByIdAndUpdate(_id, {
          $push: { wishlist: prodId}
        },{
          new:true
        });
        res.json(user);
      }
    }catch(error){
      throw new Error(error);
    }
});

const rating = asyncHandler(async(req, res)=>{
  const { _id } = req.user;
  validateMongoDbId(_idid);
  const { star, prodId, comment } = req.body;
  validateMongoDbId(prodId);
  try{
    const product = await Product.findById(prodId);
    let alreadyRated = product.ratings.find(
      (userId)=> userId.postedby.toString() === _id.toString()
    );
    if(alreadyRated){
      //for rating update of a product
       await Product.updateOne({
        ratings:{$elemMatch: alreadyRated},
       },
       {
        $set:{"ratings.$.star": star, "ratings.$.comment": comment,}
       },
       {
        new:true
       }
       );
      //  res.json(updateRating);
    }else{
      //for rating a product
      await Product.findByIdAndUpdate(
        prodId,
        {
          $push:{
            ratings:{
              star:star,
              comment: comment,
              postedby:_id
            }
          }
        },
        {
          new:true
        }
      );
      // res.json(rateProduct);
    }
    let totalRatingOfProduct = product.ratings.length;
    let ratingSum = product.ratings.map((item)=> item.star).reduce((prev, curr)=> prev + curr, 0);
    let avgRatingOfProduct = Math.round(ratingSum/totalRatingOfProduct);
    let finalProduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalRating: avgRatingOfProduct
      },
      {
        new: true
      }
      );
      res.json(finalProduct);
  }catch(error){
    throw new Error(error);
  }
});

const uploadImages = asyncHandler(async(req, res)=>{
  const {id} = req.params;
  validateMongoDbId(id);
  try{
    const uploader = (path)=> cloudinaryUploadImg(path, "images");
    const urls= [];
    const files = req.files;
    for(const file of files){
      const {path} = file;
      const newpath = await uploader(path);
      urls.push(newpath); 
      fs.unlinkSync(path);
    };
    const findProduct = await Product.findByIdAndUpdate(
      id,
      {
        images: urls.map((file)=> file)
      },
      {
        new:true
      }
    );
    res.json(findProduct);
  }catch(error){
    throw new Error(error);
  }
});


module.exports = {createProduct, getSingleProduct, getAllProduct, updateProduct, removeProduct, addToWishList, rating, uploadImages};