import { useState, useEffect, useContext } from 'react';
import WaterDisplay from './WaterDisplay';
import ActionButtons from './ActionButtons';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';
import './WaterTracker.css';

function WaterTracker() {
    const [waterData, setWaterData] = useState({ goal: 2700, consumed: 0 });
    const [percentage, setPercentage] = useState(0);
    const [goalReached, setGoalReached] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isEditingGoal, setIsEditingGoal] = useState(false);
    const [newGoal, setNewGoal] = useState(waterData.goal);
    const { userInfo } = useContext(AuthContext);

    const getTodayDateString = () => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // YYYY-MM-DD
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!userInfo) return;
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const date = getTodayDateString();
                const { data } = await axios.get(`http://localhost:5000/api/water/${date}`, config);
                setWaterData(data);
                setNewGoal(data.goal);
            } catch (error) {
                console.error('Failed to fetch water data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userInfo]);

    useEffect(() => {
        const newPercentage = waterData.goal > 0 ? Math.min((waterData.consumed / waterData.goal) * 100, 100) : 0;
        setPercentage(newPercentage);

        if (waterData.consumed >= waterData.goal && waterData.goal > 0) {
            setGoalReached(true);
        } else {
            setGoalReached(false);
        }
    }, [waterData]);

    const handleSetGoal = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const date = getTodayDateString();
            const { data } = await axios.post('http://localhost:5000/api/water/goal', { goal: newGoal, date }, config);
            setWaterData(data);
            setIsEditingGoal(false);
        } catch (error) {
            console.error('Failed to set goal', error);
        }
    };

    const addWater = async (amount) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const date = getTodayDateString();
            const { data } = await axios.post('http://localhost:5000/api/water/drink', { amount, date }, config);
            setWaterData(data);
        } catch (error) {
            console.error('Failed to add water', error);
        }
    };

    const resetIntake = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const date = getTodayDateString();
            const { data } = await axios.put('http://localhost:5000/api/water/reset', { date }, config);
            setWaterData(data);
        } catch (error) {
            console.error('Failed to reset water', error);
        }
    };

    // Helper to format last drink time
    const formatLastDrink = (dateString) => {
        if (!dateString) return 'No drinks yet';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMin = Math.floor(diffMs / 60000);
        if (diffMin < 1) return 'Just now';
        if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
        // Show time in HH:MM AM/PM
        return `at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };

    return (
        <div className="app-container">
            {loading && <LoadingSpinner />}
            <div className="goal-container">
                <h1 className="title">Your Daily Water Intake</h1>
                <button onClick={() => setIsEditingGoal(!isEditingGoal)} className="edit-goal-button">
                    {isEditingGoal ? 'Cancel' : 'Edit Goal'}
                </button>
            </div>
            {isEditingGoal && (
                <form onSubmit={handleSetGoal} className="goal-edit-form">
                    <input
                        type="number"
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        className="goal-input"
                    />
                    <button type="submit" className="save-goal-button">Save</button>
                </form>
            )}
            {goalReached && (
                <div className="goal-reached-message">
                    🎉 Well done! You've reached your goal! 🎉
                </div>
            )}
            {/* Show last drink time */}
            <div style={{ color: '#007bff', fontWeight: 500, marginBottom: '1rem', fontSize: '1.1rem' }}>
                Last drink: {formatLastDrink(waterData.lastDrinkAt)}
            </div>
            <WaterDisplay percentage={percentage} intake={waterData.consumed} goal={waterData.goal} />
            <ActionButtons addWater={addWater} resetIntake={resetIntake} />
        </div>
    );
}

export default WaterTracker; 