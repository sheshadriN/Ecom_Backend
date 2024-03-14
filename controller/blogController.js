const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const {validateMongoDbId} = require("../utils/validateMongodbid");
const asyncHandler = require("express-async-handler");
const cloudinaryUploadImg = require('../utils/cloudinary');
const fs = require('fs');

const createBlog =  asyncHandler(async(req, res)=>{
   try{
    const newBlog = await Blog.create(req.body);
    res.json(newBlog);
   }catch(error){
    throw new Error(error);
   }
});

const updateBlog = asyncHandler(async(req, res)=>{
   const { id } = req.params;
   validateMongoDbId(id);

   try{
    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new:true
    });
    res.json(updatedBlog);
   }catch(error){
      throw new Error(error);
   }
})

const getAllBlogs = asyncHandler(async(req, res)=>{
   try{
     const allBlogs =  await Blog.find();
     res.json(allBlogs);
   }catch(error){
      throw new Error(error);
   }
});

const getSingleBlog = asyncHandler(async(req, res)=>{
   const {id} = req.params;
   validateMongoDbId(id);

   try{
     const singleBlog =  await Blog.findById(id).populate("likes").populate("dislikes");
     await Blog.findByIdAndUpdate(id, {
         $inc: {numViews: 1}
     },
     {
      new:true
     }
     );
     res.json(singleBlog);
   }catch(error){
      throw new Error(error);
   }
})

const deleteSingleBlog = asyncHandler(async(req, res)=>{
   const {id} = req.params;
   validateMongoDbId(id);
   try{
     const deletedBlog =  await Blog.findByIdAndDelete(id);
     res.json(deletedBlog);
   }catch(error){
      throw new Error(error);
   }
});

const dislikeTheBlog =  asyncHandler(async(req, res)=>{
   const {blogId} = req.body;
   validateMongoDbId(blogId);

   //find the blog which you want to dislike
   const blog = await Blog.findById(blogId);
   //find the login user
   const loginUserId = req?.user?._id;
   //find if the user has liked the blog
   const isDisliked = blog.isDisliked;
   //find if user has dislked the post
   const alreadyLiked = blog?.likes?.find(
      (userId) => userId?.toString() === loginUserId?.toString()
   );
   if(alreadyLiked) {
      const blog = await Blog.findByIdAndUpdate(
         blogId,
         {
            $pull: { likes: loginUserId},
            isLiked: false
         },
         {
            new: true
         }
      );
      res.json(blog);
   }
   if(isDisliked){
      const blog = await Blog.findByIdAndUpdate(
         blogId,
         {
            $pull: { dislikes: loginUserId},
            isDisliked: false
         },
         {
            new: true
         }
      );
      res.json(blog);
   }else{
      const blog = await Blog.findByIdAndUpdate(
         blogId,
         {
            $push: { dislikes: loginUserId},
            isDisliked: true
         },
         {
            new: true
         }
      );
      res.json(blog);
   }
});

const likeBlog =  asyncHandler(async(req, res)=>{
   const {blogId} = req.body;
   validateMongoDbId(blogId);

   //find the blog which you want to like
   const blog = await Blog.findById(blogId);
   //find the login user
   const loginUserId = req?.user?._id;
   //find if the user has liked the blog
   const isLiked = blog.isLiked;
   //find if user has dislked the post
   const alreadyDisliked = blog?.dislikes?.find(
      (userId) => userId?.toString() === loginUserId?.toString()
   );
   if(alreadyDisliked) {
      const blog = await Blog.findByIdAndUpdate(
         blogId,
         {
            $pull: { dislikes: loginUserId},
            isDisliked: false
         },
         {
            new: true
         }
      );
      res.json(blog);
   }
   if(isLiked){
      const blog = await Blog.findByIdAndUpdate(
         blogId,
         {
            $pull: { likes: loginUserId},
            isLiked: false
         },
         {
            new: true
         }
      );
      res.json(blog);
   }else{
      const blog = await Blog.findByIdAndUpdate(
         blogId,
         {
            $push: { likes: loginUserId},
            isLiked: true
         },
         {
            new: true
         }
      );
      res.json(blog);
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
     const findBlog = await Blog.findByIdAndUpdate(
       id,
       {
         images: urls.map((file)=> file)
       },
       {
         new:true
       }
     );
     res.json(findBlog);
   }catch(error){
     throw new Error(error);
   }
 });

module.exports = {createBlog, updateBlog, getAllBlogs, getSingleBlog, deleteSingleBlog, likeBlog, dislikeTheBlog, uploadImages};