import React, { useState } from 'react';
import classes from './AddDetectionRuleComponent.module.scss'; // Ensure this CSS module exists and styles the form appropriately
import { toast } from 'react-toastify';
import { SERVER_URL } from '../../consts';

const AddDetectionRuleComponent = ({ onSuccess }) => {
  const [detectionState, setDetectionState] = useState('ON');
  const [lightState, setLightState] = useState('ON');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const ruleData = {
      description: `If detection is equal to ${detectionState}, then turn light ${lightState.toLowerCase()}.`,
      condition: {
        variable: "detection",
        operator: "is equal to",
        value: detectionState === 'on' ? 1 : 0, // Assuming 'on' is represented by 1 and 'off' by 0
      },
      action: `Turn light ${lightState}`
    };

    try {
      const response = await fetch(`${SERVER_URL}/api-rules/rules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ruleData),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      toast.success('Detection rule added successfully!');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('There was an error!', error);
      toast.error(`Failed to add the detection rule. ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={classes.formContainer}>
      <div className={classes.formRow}>
        <label htmlFor="detectionStateSelector" className={classes.labelColumn}>If Motion Detection:</label>
        <select
          id="detectionStateSelector"
          name="detectionStateSelector"
          value={detectionState}
          onChange={(e) => setDetectionState(e.target.value)}
          required
          className={classes.inputColumn}
          aria-label="Select detection state"
        >
          <option value="">Select Option</option>
          <option value="on">On</option>
          <option value="off">Off</option>
        </select>
      </div>

      <div className={classes.formRow}>
        <label htmlFor="lightStateSelector" className={classes.labelColumn}>Then Turn Light:</label>
        <select
          id="lightStateSelector"
          name="lightStateSelector"
          value={lightState}
          onChange={(e) => setLightState(e.target.value)}
          required
          className={classes.inputColumn}
          aria-label="Select light state"
        >
          <option value="">Select Option</option>
          <option value="on">On</option>
          <option value="off">Off</option>
        </select>
      </div>

      <div className={classes.formRow}>
        <button type="submit" className={classes.RulesDashboardButton} disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add'}
        </button>
      </div>
    </form>
  );
};

export default AddDetectionRuleComponent;