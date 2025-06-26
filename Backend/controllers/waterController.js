const asyncHandler = require('express-async-handler');
const Water = require('../models/waterModel');

// @desc    Get water data for a specific date
// @route   GET /api/water/:date
// @access  Private
const getWaterData = asyncHandler(async (req, res) => {
    const { date } = req.params;
    const user = req.user._id;

    let waterData = await Water.findOne({ user, date: new Date(date) });

    if (!waterData) {
        waterData = await Water.create({
            user,
            userName: req.user.name,
            date: new Date(date),
            goal: 2000,
            consumed: 0,
        });
    }

    res.json(waterData);
});

// @desc    Set water goal
// @route   POST /api/water/goal
// @access  Private
const setWaterGoal = asyncHandler(async (req, res) => {
    const { goal, date } = req.body;
    const user = req.user._id;

    let waterData = await Water.findOne({ user, date: new Date(date) });

    if (waterData) {
        if (!waterData.userName) {
            waterData.userName = req.user.name;
        }
        waterData.goal = goal;
        await waterData.save();
    } else {
        waterData = await Water.create({
            user,
            userName: req.user.name,
            date: new Date(date),
            goal,
        });
    }

    res.json(waterData);
});


// @desc    Add consumed water
// @route   POST /api/water/drink
// @access  Private
const addConsumedWater = asyncHandler(async (req, res) => {
    const { amount, date } = req.body;
    const user = req.user._id;

    let waterData = await Water.findOne({ user, date: new Date(date) });

    if (waterData) {
        if (!waterData.userName) {
            waterData.userName = req.user.name;
        }
        waterData.consumed += amount;
        waterData.lastDrinkAt = new Date();
        await waterData.save();
    } else {
        waterData = await Water.create({
            user,
            userName: req.user.name,
            date: new Date(date),
            consumed: amount,
            lastDrinkAt: new Date(),
        });
    }

    res.json(waterData);
});

// @desc    Reset consumed water for a date
// @route   PUT /api/water/reset
// @access  Private
const resetWater = asyncHandler(async (req, res) => {
    const { date } = req.body;
    const user = req.user._id;

    let waterData = await Water.findOne({ user, date: new Date(date) });

    if (waterData) {
        waterData.consumed = 0;
        const updatedWaterData = await waterData.save();
        res.json(updatedWaterData);
    } else {
        // If for some reason there's no data to reset, create it.
        waterData = await Water.create({
            user,
            userName: req.user.name,
            date: new Date(date),
            consumed: 0,
        });
        res.status(201).json(waterData);
    }
});

module.exports = { getWaterData, setWaterGoal, addConsumedWater, resetWater }; 