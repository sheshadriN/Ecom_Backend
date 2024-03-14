const express = require('express');
const { createCoupon, getSingleCoupon, getAllCoupon, updateCoupon, deleteCoupon } = require('../controller/couponController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, isAdmin, createCoupon);
router.get('/', authMiddleware, isAdmin, getAllCoupon);
router.get('/:id', authMiddleware, isAdmin, getSingleCoupon);
router.put('/:id', authMiddleware, isAdmin, updateCoupon);
router.delete('/:id', authMiddleware, isAdmin, deleteCoupon);

  
module.exports = router;