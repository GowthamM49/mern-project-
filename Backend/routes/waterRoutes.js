const express = require('express');
const router = express.Router();
const { getWaterData, setWaterGoal, addConsumedWater, resetWater, getHydrationHistory } = require('../controllers/waterController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:date').get(protect, getWaterData);
router.route('/goal').post(protect, setWaterGoal);
router.route('/drink').post(protect, addConsumedWater);
router.route('/reset').put(protect, resetWater);
router.route('/history').get(protect, getHydrationHistory);

module.exports = router; 