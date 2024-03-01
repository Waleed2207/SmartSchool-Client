import React from 'react';

const YearSelector = ({ selectedYear, availableYears, onChange }) => {
  return (
    <div>
      <label>Year:</label>
      <select value={selectedYear} onChange={(e) => onChange(e, 'year')}>
        {availableYears.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default YearSelector;
