import React from 'react';

function WaterDisplay({ percentage, intake, goal }) {
  return (
    <>
      <div className="water-container">
        <div className="water-level" style={{ height: `${percentage}%` }}>
          <div className="water-info">
            <span>{Math.round(percentage)}%</span>
          </div>
        </div>
      </div>
      <div className="info">
        <p className="intake-info">{intake} ml / {goal} ml</p>
      </div>
    </>
  );
}

export default WaterDisplay; 