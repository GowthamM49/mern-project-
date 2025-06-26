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

// @desc    Get hydration history for the past N days
// @route   GET /api/water/history?days=7
// @access  Private
const getHydrationHistory = asyncHandler(async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            console.error('getHydrationHistory: No user found in request', { user: req.user });
            return res.status(401).json({ message: 'Not authorized, user missing' });
        }
        const user = req.user._id;
        const days = parseInt(req.query.days) || 7;
        // Set startDate to 00:00:00 of the first day
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - (days - 1));
        // Set endDate to 23:59:59 of today
        const endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999);

        console.log('HydrationHistory:', { user, startDate, endDate, query: req.query });

        let records = [];
        try {
            records = await Water.find({
                user,
                date: { $gte: startDate, $lte: endDate },
            }).sort({ date: 1 });
        } catch (findErr) {
            console.error('Error querying Water.find in getHydrationHistory:', findErr.stack || findErr);
            records = [];
        }
        if (!records) records = [];
        console.log('HydrationHistory records:', records);

        // Build a map for quick lookup
        const dateMap = {};
        records.forEach(r => {
            const d = r.date.toISOString().split('T')[0];
            dateMap[d] = r.consumed;
        });

        // Build the result for each day in the range
        const result = [];
        for (let i = 0; i < days; i++) {
            const d = new Date(startDate);
            d.setDate(startDate.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];
            result.push({
                date: dateStr,
                consumed: dateMap[dateStr] || 0,
            });
        }
        res.json(result);
    } catch (error) {
        console.error('Error in getHydrationHistory:', error.stack || error);
        res.status(500).json({ message: error.message || 'Server error in hydration history' });
    }
});

module.exports = { getWaterData, setWaterGoal, addConsumedWater, resetWater, getHydrationHistory }; 