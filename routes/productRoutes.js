const express = require('express');
const { createProduct, getSingleProduct, getAllProduct, updateProduct, removeProduct, addToWishList, rating, uploadImages } = require('../controller/productController');
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImages');
const router = express.Router();

router.get("/:id", getSingleProduct);
router.get("/", getAllProduct);
router.put("/upload/:id", authMiddleware, isAdmin, uploadPhoto.array('images',10), productImgResize, uploadImages);
router.put("/wishlist", authMiddleware, addToWishList);
router.put("/ratings", authMiddleware, rating);
router.post("/",  authMiddleware, isAdmin, createProduct);
router.put("/:id",  authMiddleware, isAdmin, updateProduct);
router.delete("/:id",  authMiddleware, isAdmin, removeProduct);


module.exports = router;