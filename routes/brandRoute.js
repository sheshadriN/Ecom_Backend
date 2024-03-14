const express = require('express');
const { createBrand, updateBrand, removeBrand, getAllBrand, getBrand } = require('../controller/brandController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router =  express.Router();

router.get("/", getAllBrand);
router.get("/:id", getBrand);
router.post("/", authMiddleware, isAdmin, createBrand);
router.put("/:id", authMiddleware, isAdmin, updateBrand);
router.delete("/:id", authMiddleware, isAdmin, removeBrand);


module.exports = router;