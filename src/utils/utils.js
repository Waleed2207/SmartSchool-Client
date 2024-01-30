export function getGreeting() {
    const currentHour = new Date().getHours();
    let greeting;
  
    if (currentHour >= 5 && currentHour < 12) {
      greeting = "Good morning";
    } else if (currentHour >= 12 && currentHour < 18) {
      greeting = "Good afternoon";
    } else if (currentHour >= 18 && currentHour < 22) {
      greeting = "Good evening";
    } else {
      greeting = "Good night";
    }
  
    return greeting;
  }

  export const getMonthlyData = (data) => {
    const monthlyData = {};
  
    data.forEach((entry) => {
      if (entry.timestamp) {
        const month = entry.timestamp.slice(0, 7);
        const energySum = entry.ac_energy + entry.heater_energy + entry.lights_energy + entry.laundry_energy;
  
        if (!monthlyData[month]) {
          monthlyData[month] = energySum;
        } else {
          monthlyData[month] += energySum;
        }
      }
    });
  
    return Object.entries(monthlyData).map(([month, energy]) => ({ x: month, y: energy }));
  };
  
  export const getYearlyData = (data) => {
    const yearlyData = {};
  
    data.forEach((entry) => {
      if (entry.timestamp) {
        const year = entry.timestamp.slice(0, 4);
        const energySum = entry.ac_energy + entry.heater_energy + entry.lights_energy + entry.laundry_energy;
  
        if (!yearlyData[year]) {
          yearlyData[year] = energySum;
        } else {
          yearlyData[year] += energySum;
        }
      }
    });
  
    return Object.entries(yearlyData).map(([year, energy]) => ({ x: year, y: energy }));
  };


  export const generateYears = (startYear, endYear) => {
    const years = [];
    for (let i = startYear; i <= endYear; i++) {
      years.push(i);
    }
    return years;
  };

  // utils.js
export const generateMonthLabels = (year) => {
  const monthLabels = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date(year, i, 1);
    monthLabels.push(date.toLocaleString('en-US', { month: 'short' }));
  }
  return monthLabels;
};

  


  
  