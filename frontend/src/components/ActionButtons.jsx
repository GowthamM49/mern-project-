import React from 'react';

function ActionButtons({ addWater, resetIntake }) {
  return (
    <div className="actions">
      <button className="water-button" onClick={() => addWater(250)}>+250 ml</button>
      <button className="water-button" onClick={() => addWater(500)}>+500 ml</button>
      <button className="reset-button" onClick={resetIntake}>Reset</button>
    </div>
  );
}

export default ActionButtons; 