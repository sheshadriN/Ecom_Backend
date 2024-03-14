const express = require("express");
const { createBlog, updateBlog, getAllBlogs, getSingleBlog, deleteSingleBlog, likeBlog, dislikeTheBlog, uploadImages } = require("../controller/blogController");
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");
const { blogImgResize, uploadPhoto } = require("../middlewares/uploadImages");
const router = express.Router();


router.get("/", getAllBlogs); 
router.get("/:id", getSingleBlog); 
router.post("/likes", authMiddleware, likeBlog);
router.post("/dislikes", authMiddleware, dislikeTheBlog);
router.put("/upload/:id", authMiddleware, isAdmin, uploadPhoto.array('images',2), blogImgResize, uploadImages);
router.post("/", authMiddleware, isAdmin, createBlog);
router.put("/:id", authMiddleware, isAdmin, updateBlog);
router.delete("/:id", authMiddleware, isAdmin, deleteSingleBlog);

module.exports = router;