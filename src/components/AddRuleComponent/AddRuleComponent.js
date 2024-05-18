// Import necessary dependencies
import React, { useState } from 'react';
import classes from './AddRuleComponent.module.scss'; // Ensure the corresponding CSS module is present
import { toast } from 'react-toastify'; // Assuming react-toastify is used for notifications
import { SERVER_URL } from '../../consts'; // Assuming SERVER_URL is defined in your constants
import Space from '../Spaces/Space';

const AddRuleComponent = ({ onSuccess, spaceId }) => {
  // State hooks for form fields
  const [temperature, setTemperature] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('is above');
  const [acTemperature, setAcTemperature] = useState(22); // Default starting value
  const [acMode, setAcMode] = useState('cool');
  const [acState, setAcState] = useState('ON');
  const [acSpace_ID, setAcSpaceID] = useState(spaceId);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission status
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Indicate that submission has started

    // Construct rule data from form fields
    const ruleData = {
      description: `If temperature ${selectedOperator} ${temperature}°C, then turn AC ${acMode} to ${acTemperature}°C.`,
      condition: {
        variable: "temperature",
        operator: selectedOperator,
        value: parseInt(temperature, 10),
      },
      action: `Turn AC ${acState} to ${acMode} mode at ${acTemperature}`,
      space_id: acSpace_ID
    };

    try {
      const response = await fetch(`${SERVER_URL}/api-rules/rules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ruleData),
      });
    
      const contentType = response.headers.get('content-type');
      
      // Check if the response is JSON
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json(); // Safely parse JSON
        console.log(data); // For debugging
        toast.success('Rule added successfully!');
      } else {
        // If response is not JSON, read it as text
        const textResponse = await response.text();
        console.log(textResponse); // For debugging
        if (response.ok) {
          toast.success(textResponse);
        } else {
          throw new Error(`HTTP error! status: ${response.status}, ${textResponse}`);
        }
      }
      
      if (onSuccess) onSuccess(); // Execute callback if provided
    } catch (error) {
      console.error('There was an error!', error);
      toast.error(`Failed to add the rule. ${error.message}`);
    }
    
  };

  // Render form
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
        <label htmlFor="acTemperatureSelector" className={classes.labelColumn}>Turn AC on to (°C):</label>
        <select
          id="acTemperatureSelector"
          name="acTemperatureSelector"
          value={acTemperature}
          onChange={(e) => setAcTemperature(parseInt(e.target.value, 10))}
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

      {/* AC mode selection */}
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

      {/* AC state selection */}
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
        {/* AC state selection */}
        <div className={classes.formRow}>
          <label htmlFor="acSpace_ID" className={classes.labelColumn}>Space ID:</label>
          <input
            id="acSpace_ID"
            name="acSpace_ID"
            type="text"
            value={acSpace_ID} 
            readOnly 
            required
            className={classes.inputColumn}
            aria-label="Space ID"
          />
        </div>

      {/* Submit button with dynamic label based on submission status */}
      <div className={classes.formRow}>
        <button type="submit" className={classes.RulesDashboardButton} disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add'}
        </button>
      </div>
    </form>
  );
};


AddRuleComponent.defaultProps = {
  spaceId: '', // Provide a default value for Space_ID if not provided
};

export default AddRuleComponent;