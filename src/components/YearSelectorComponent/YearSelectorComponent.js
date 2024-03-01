import React, { useState } from 'react';

const YearSelectorComponent = (props) => {
  // Assume availableYears is passed as a prop, else define it here
  const { availableYears } = props;

  // State to hold the selected year
  const [selectedYear, setSelectedYear] = useState(availableYears[0] || '');

  // Handler for selection change
  const handleSelectionChange = (e) => {
    setSelectedYear(e.target.value);
    // Perform any additional logic when the year changes
    // For example, you could call a parent component's function via props
    // props.onYearChange(e.target.value);
  };

  return (
    <div>
      <label>Year:</label>
      <select
        value={selectedYear}
        onChange={(e) => handleSelectionChange(e)}
      >
        {availableYears.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default YearSelectorComponent;
