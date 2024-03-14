const Brand = require('../models/brandModel');
const asyncHandler = require('express-async-handler');
const {validateMongoDbId} =  require("../utils/validateMongodbid");


const createBrand = asyncHandler(async(req, res)=>{
    try{
      const newBrand  = await Brand.create(req.body);
      res.json(newBrand);
    }catch(error){
        throw new Error(error);
    }
});

const updateBrand = asyncHandler(async(req, res)=>{
  const {id} = req.params;
  validateMongoDbId(id);
  try{
    const updatedBrand  = await Brand.findByIdAndUpdate(id,req.body, {new:true});
    res.json(updatedBrand);
  }catch(error){
      throw new Error(error);
  }
});


const removeBrand = asyncHandler(async(req, res)=>{
  const {id} = req.params;
  validateMongoDbId(id);
  try{
    const deleteBrand  = await Brand.findByIdAndDelete(id);
    res.json(deleteBrand);
  }catch(error){
      throw new Error(error);
  }
});

const getBrand = asyncHandler(async(req, res)=>{
  const {id} = req.params;
  validateMongoDbId(id);
  try{
    const findBrand  = await Brand.findById(id);
    res.json(findBrand);
  }catch(error){
      throw new Error(error);
  }
});

const getAllBrand = asyncHandler(async(req, res)=>{
  try{
    const allBrand  = await Brand.find();
    res.json(allBrand);
  }catch(error){
      throw new Error(error);
  }
});


module.exports = {createBrand, updateBrand, removeBrand, getBrand, getAllBrand};