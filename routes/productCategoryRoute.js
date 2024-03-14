const express = require('express');
const { createCategory, updateCategory, removeCategory, getAllCategory, getCategory } = require('../controller/productCategoryController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router =  express.Router();

router.get("/", getAllCategory);
router.get("/:id", getCategory);
router.post("/", authMiddleware, isAdmin, createCategory);
router.put("/:id", authMiddleware, isAdmin, updateCategory);
router.delete("/:id", authMiddleware, isAdmin, removeCategory);


module.exports = router;