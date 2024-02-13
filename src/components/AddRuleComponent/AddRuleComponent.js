import React, { useState } from 'react';
import classes from './AddRuleComponent.module.scss'; // Ensure you have the corresponding CSS module or adjust styling as needed
import { toast } from 'react-toastify'; // Assuming you're using react-toastify for notifications

// Assuming SERVER_URL is defined in your constants
import { SERVER_URL } from '../../consts';

const AddRuleComponent = ({ onSuccess }) => {
  const [temperature, setTemperature] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('is above');
  const [acTemperature, setAcTemperature] = useState(22); // Default starting value
  const [acMode, setAcMode] = useState('cool');
  const [acState, setacState] = useState('ON');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ruleData = {
      description: `If temperature ${selectedOperator} ${temperature}°C, then turn AC ${acMode} to ${acTemperature}°C.`,
      condition: {
        variable: "temperature",
        operator: selectedOperator,
        value: parseInt(temperature, 10),
      },
      action: `Turn AC ${acState} to ${acMode} mode at ${acTemperature}°C`
    };

    try {
      const response = await fetch(`${SERVER_URL}/rules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ruleData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data); // For debugging
      toast.success('Rule added successfully!');
      if (onSuccess) onSuccess(); // Callback for any additional actions on success
    } catch (error) {
      console.error('There was an error!', error);
      toast.error('Failed to add the rule.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={classes.formContainer}>
    <div className={classes.formRow}>
      <label htmlFor="conditionTemperature" className={classes.labelColumn}>If Temperature(°C):</label>
      <select
        id="conditionTemperatureselector"
        name="onditionTemperatureselector"
        value={temperature}
        onChange={(e) => setTemperature(e.target.value)}
        required
        className={classes.inputColumn}
      >
        <option value="">Select Temperature</option>
        {Array.from({ length: 17 }, (_, i) => 16 + i).map(temp => (
          <option key={temp} value={temp}>{temp}°C</option>
        ))}
      </select>
    </div>

    <div className={classes.formRow}>
      <label htmlFor="operatorlabel" className={classes.labelColumn}>Condition:</label>
      <select
        id="operatorselector"
        name="operatorselector"
        value={selectedOperator}
        onChange={(e) => setSelectedOperator(e.target.value)}
        required
        className={classes.inputColumn}
      >
        <option value="">Select Condition</option>
        <option value="is above">is above</option>
        <option value="is equal to">is equal to</option>
        <option value="is below">is below</option>
      </select>
    </div>

    <div className={classes.formRow}>
      <label htmlFor="acTemperatureSelect" className={classes.labelColumn}>Turn AC on to (°C):</label>
      <select
        id="acTemperatureSelectselector"
        name="acTemperatureselector"
        value={acTemperature}
        onChange={(e) => setAcTemperature(e.target.value)}
        required
        className={classes.inputColumn}
      >
        <option value="">Select Temperature</option>
        {Array.from({ length: 17 }, (_, i) => 16 + i).map(temp => (
          <option key={temp} value={temp}>{temp}°C</option>
        ))}
      </select>
    </div>

    <div className={classes.formRow}>
      <label htmlFor="acMode" className={classes.labelColumn}>And on Mode:</label>
      <select
        id="acMode"
        name="acMode"
        value={acMode}
        onChange={(e) => setAcMode(e.target.value)}
        required
        className={classes.inputColumn}
      >
        <option value="">Select Mode</option>
        <option value="cool">Cool</option>
        <option value="heat">Heat</option>
        <option value="fan">Fan</option>
        <option value="dry">Dry</option>
        <option value="auto">Auto</option>
      </select>
    </div>

    <div className={classes.formRow}>
      <label htmlFor="acState" className={classes.labelColumn}>AC State:</label>
      <select
        id="acState"
        name="acState"
        value={acState}
        onChange={(e) => setacState(e.target.value)}
        required
        className={classes.inputColumn}
      >
        <option value="">Select AC State</option>
        <option value="ON">On</option>
        <option value="OFF">Off</option>
      </select>
    </div>

    <div className={classes.formRow}>
      <button type="submit" className={classes.RulesDashboardButton}>
        Add
      </button>
    </div>
  </form>
  );
};

export default AddRuleComponent;

