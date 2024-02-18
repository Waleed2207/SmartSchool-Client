import React, { useState } from 'react';
import classes from './AddRuleComponent.module.scss'; // Ensure the corresponding CSS module is present
import { toast } from 'react-toastify'; // Assuming react-toastify is used for notifications

// Assuming SERVER_URL is defined in your constants
import { SERVER_URL } from '../../consts';

const AddRuleComponent = ({ onSuccess }) => {
  const [temperature, setTemperature] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('is above');
  const [acTemperature, setAcTemperature] = useState(22); // Default starting value
  const [acMode, setAcMode] = useState('cool');
  const [acState, setAcState] = useState('ON'); // Corrected setter name to follow convention

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
      const response = await fetch(`${SERVER_URL}/api-rule/rules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ruleData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Check if the response content type is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        const data = await response.json();
        console.log(data); // For debugging
        toast.success('Rule added successfully!');
      } else {
        throw new Error('Received non-JSON response from the server.');
      }
  
      if (onSuccess) onSuccess(); // Callback for any additional actions on success
    } catch (error) {
      console.error('There was an error!', error);
      toast.error('Failed to add the rule. Please try again later.');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className={classes.formContainer}>
      {/* Temperature selection */}
      <div className={classes.formRow}>
        <label htmlFor="conditionTemperatureSelector" className={classes.labelColumn}>If Temperature(°C):</label>
        <select
          id="conditionTemperatureSelector"
          name="conditionTemperatureSelector"
          value={temperature}
          onChange={(e) => setTemperature(e.target.value)}
          required
          className={classes.inputColumn}
          aria-label="Select temperature condition"
        >
          <option value="">Select Temperature</option>
          {Array.from({ length: 17 }, (_, i) => 16 + i).map(temp => (
            <option key={temp} value={temp}>{temp}°C</option>
          ))}
        </select>
      </div>

      {/* Condition selection */}
      <div className={classes.formRow}>
        <label htmlFor="operatorSelector" className={classes.labelColumn}>Condition:</label>
        <select
          id="operatorSelector"
          name="operatorSelector"
          value={selectedOperator}
          onChange={(e) => setSelectedOperator(e.target.value)}
          required
          className={classes.inputColumn}
          aria-label="Select condition operator"
        >
          <option value="">Select Condition</option>
          <option value="is above">is above</option>
          <option value="is equal to">is equal to</option>
          <option value="is below">is below</option>
        </select>
      </div>

      {/* AC temperature and mode selection */}
      <div className={classes.formRow}>
        {/* Temperature */}
        <label htmlFor="acTemperatureSelector" className={classes.labelColumn}>Turn AC on to (°C):</label>
        <select
          id="acTemperatureSelector"
          name="acTemperatureSelector"
          value={acTemperature}
          onChange={(e) => setAcTemperature(e.target.value)}
          required
          className={classes.inputColumn}
          aria-label="Select AC temperature"
        >
          <option value="">Select Temperature</option>
          {Array.from({ length: 17 }, (_, i) => 16 + i).map(temp => (
            <option key={temp} value={temp}>{temp}°C</option>
          ))}
        </select>
      </div>

      {/* AC mode */}
      <div className={classes.formRow}>
        <label htmlFor="acMode" className={classes.labelColumn}>And on Mode:</label>
        <select
          id="acMode"
          name="acMode"
          value={acMode}
          onChange={(e) => setAcMode(e.target.value)}
          required
          className={classes.inputColumn}
          aria-label="Select AC mode"
        >
          <option value="">Select Mode</option>
          <option value="cool">Cool</option>
          <option value="heat">Heat</option>
          <option value="fan">Fan</option>
          <option value="dry">Dry</option>
          <option value="auto">Auto</option>
        </select>
      </div>

      {/* AC state */}
      <div className={classes.formRow}>
        <label htmlFor="acState" className={classes.labelColumn}>AC State:</label>
        <select
          id="acState"
          name="acState"
          value={acState}
          onChange={(e) => setAcState(e.target.value)}
          required
          className={classes.inputColumn}
          aria-label="Select AC state"
        >
          <option value="">Select AC State</option>
          <option value="ON">On</option>
          <option value="OFF">Off</option>
        </select>
      </div>

      {/* Submit button */}
      <div className={classes.formRow}>
        <button type="submit" className={classes.RulesDashboardButton}>
          Add
        </button>
      </div>
    </form>
  );
};

export default AddRuleComponent;
