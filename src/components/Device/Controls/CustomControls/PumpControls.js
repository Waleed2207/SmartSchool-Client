import React from 'react';
export const PumpControls = ({ pumpDuration, setPumpDuration }) => (
    <div>
        <label>
            Pump duration (minutes):
            <input
                type="number"
                min="0.05"
                step="0.05"
                value={pumpDuration}
                onChange={e => setPumpDuration(parseFloat(e.target.value))}
            />
        </label>
    </div>
);
