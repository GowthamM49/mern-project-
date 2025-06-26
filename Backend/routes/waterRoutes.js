const express = require('express');
const router = express.Router();
const { getWaterData, setWaterGoal, addConsumedWater, resetWater } = require('../controllers/waterController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:date').get(protect, getWaterData);
router.route('/goal').post(protect, setWaterGoal);
router.route('/drink').post(protect, addConsumedWater);
router.route('/reset').put(protect, resetWater);

module.exports = router; 