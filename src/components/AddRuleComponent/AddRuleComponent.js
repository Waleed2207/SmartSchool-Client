// import React, { useState, useEffect } from 'react';
// import classes from './AddRuleComponent.module.scss';
// import { toast } from 'react-toastify';
// import { SERVER_URL } from '../../consts';
// import { getGreeting_rule } from '../../utils/utils';

// const predefinedActivities = ["Studying", "Sleeping", "watching_tv", "Eating", "Cooking", "Playing", "Outside"];
// const predefinedSeasons = ["Spring", "Summer", "Fall", "Winter"];
// const conditionKeywords = ["in", "not in"];
// const conditionTypes = ["motion", "temperature", "time"];
// const timePeriods = ["morning", "afternoon", "evening", "night"];
// const operators = ["and", "or"];

// const AddRuleComponent = ({ onSuccess, spaceId, fullName }) => {
//   const greeting = getGreeting_rule();
//   const [conditionType, setConditionType] = useState('motion');
//   const [person, setPerson] = useState(fullName);
//   const [conditionKeyword, setConditionKeyword] = useState('in');
//   const [roomName, setRoomName] = useState('');
//   const [activity, setActivity] = useState('');
//   const [season, setSeason] = useState('');
//   const [acTemperature, setAcTemperature] = useState(25);
//   const [acMode, setAcMode] = useState('cool');
//   const [acState, setAcState] = useState('on');
//   const [lightState, setLightState] = useState('on');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [rooms, setRooms] = useState([]);
//   const [devices, setDevices] = useState([]);
//   const [selectedDevices, setSelectedDevices] = useState({});
//   const [temperatureCondition, setTemperatureCondition] = useState('is above');
//   const [temperatureValue, setTemperatureValue] = useState(25);
//   const [humidityCondition, setHumidityCondition] = useState('is above');
//   const [humidityValue, setHumidityValue] = useState(50);
//   const [timePeriod, setTimePeriod] = useState(greeting);
//   const [operatorBefore, setOperatorBefore] = useState('and');
//   const [operatorAfter, setOperatorAfter] = useState('and');
//   const [includeHumidity, setIncludeHumidity] = useState(false);
//   const [includeTemperature, setIncludeTemperature] = useState(true);

//   useEffect(() => {
//     const fetchRooms = async () => {
//       try {
//         const response = await fetch(`${SERVER_URL}/api-room/rooms/space/${spaceId}`);
//         if (response.ok) {
//           const data = await response.json();
//           const roomNames = data.map(room => room.name);
//           setRooms(roomNames);
//         } else {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//       } catch (error) {
//         console.error('Failed to fetch rooms:', error);
//         toast.error(`Failed to fetch rooms. ${error.message}`);
//       }
//     };

//     fetchRooms();
//   }, [spaceId]);

//   useEffect(() => {
//     const fetchDevices = async () => {
//       if (roomName) {
//         try {
//           const response = await fetch(`${SERVER_URL}/api-device/device/space/${spaceId}/${encodeURIComponent(roomName)}`);
//           if (response.ok) {
//             const data = await response.json();
//             setDevices(data);
//           } else {
//             throw new Error(`HTTP error! status: ${response.status}`);
//           }
//         } catch (error) {
//           console.error('Failed to fetch devices:', error);
//           toast.error(`Failed to fetch devices. ${error.message}`);
//         }
//       }
//     };

//     fetchDevices();
//   }, [roomName, spaceId]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     const controlVariables = Object.entries(selectedDevices).reduce((acc, [device, state]) => {
//       if (device.includes('AC')) {
//         acc[device] = {
//           state: acState,
//           temperature: acTemperature,
//           mode: acMode
//         };
//       } else {
//         acc[device] = state;
//       }
//       return acc;
//     }, {});

//     const thenActions = Object.entries(selectedDevices).map(([device, state]) => {
//       if (device.includes('AC')) {
//         return `turn ${device} ${acMode} mode ${acTemperature} on`;
//       } else {
//         return `turn ${device} ${state}`;
//       }
//     }).join(' and ');

//     let condition = '';
//     if (conditionType === 'motion') {
//       condition = `If ${person} ${conditionKeyword} ${roomName}${
//         conditionKeyword === 'in' && roomName !== 'bathroom' ? ` ${operatorBefore} ${activity} ${operatorAfter} season is ${season}` : ''
//       }`;
//     } else if (conditionType === 'temperature') {
//       if (includeTemperature && includeHumidity) {
//         condition = `If temperature in ${roomName} ${temperatureCondition} ${temperatureValue} ${operatorBefore} humidity ${humidityCondition} ${humidityValue}`;
//       } else if (includeTemperature) {
//         condition = `If temperature in ${roomName} ${temperatureCondition} ${temperatureValue}`;
//       } else if (includeHumidity) {
//         condition = `If humidity in ${roomName} ${humidityCondition} ${humidityValue}`;
//       }
//     } else if (conditionType === 'time') {
//       condition = `If hour ${conditionKeyword} ${roomName} is ${timePeriod} ${operatorBefore} temperature is ${temperatureCondition} ${temperatureValue}`;
//     }

//     const ruleData = {
//       description: condition + ` then ${thenActions}`,
//       condition: condition,
//       control: controlVariables,
//       space_id: spaceId
//     };

//     try {
//       const response = await fetch(`${SERVER_URL}/api-rule/rules`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(ruleData),
//       });

//       const contentType = response.headers.get('content-type');

//       if (contentType && contentType.includes('application/json')) {
//         const data = await response.json();
//         console.log(data);
//         toast.success('Rule added successfully!');
//       } else {
//         const textResponse = await response.text();
//         console.log(textResponse);
//         if (response.ok) {
//           toast.success(textResponse);
//         } else {
//           throw new Error(`HTTP error! status: ${response.status}, ${textResponse}`);
//         }
//       }

//       if (onSuccess) onSuccess();
//     } catch (error) {
//       console.error('There was an error!', error);
//       toast.error(`Failed to add the rule. ${error.message}`);
//     }

//     setIsSubmitting(false);
//   };

//   const handleDeviceSelectionChange = (device) => {
//     setSelectedDevices(prevState => {
//       if (prevState[device]) {
//         const newState = { ...prevState };
//         delete newState[device];
//         return newState;
//       } else {
//         return { ...prevState, [device]: 'on' };
//       }
//     });
//   };

//   const handleDeviceStateChange = (device, state) => {
//     setSelectedDevices(prevState => ({
//       ...prevState,
//       [device]: state
//     }));
//   };

//   return (
//     <form onSubmit={handleSubmit} className={classes.formContainer}>
//       <h3 className={classes.sectionTitle}>Condition Variable</h3>
//       <div className={classes.formRow}>
//         <label htmlFor="conditionTypeSelector" className={classes.labelColumn}>Condition Type:</label>
//         <select
//           id="conditionTypeSelector"
//           name="conditionTypeSelector"
//           value={conditionType}
//           onChange={(e) => setConditionType(e.target.value)}
//           required
//           className={classes.inputColumn}
//         >
//           {conditionTypes.map((type, index) => (
//             <option key={index} value={type}>{type}</option>
//           ))}
//         </select>
//       </div>

//       {conditionType === 'motion' && (
//         <div className={classes.formRow}>
//           <label htmlFor="personSelector" className={classes.labelColumn}>Motion:</label>
//           <input
//             id="personSelector"
//             name="personSelector"
//             value={person}
//             onChange={(e) => setPerson(e.target.value)}
//             required
//             className={classes.inputColumn}
//             placeholder="Enter Motion name"
//           />
//         </div>
//       )}

//       <div className={classes.formRow}>
//         <label htmlFor="conditionKeywordSelector" className={classes.labelColumn}>Condition Keyword:</label>
//         <select
//           id="conditionKeywordSelector"
//           name="conditionKeywordSelector"
//           value={conditionKeyword}
//           onChange={(e) => setConditionKeyword(e.target.value)}
//           required
//           className={classes.inputColumn}
//         >
//           <option value="">Select Condition</option>
//           {conditionKeywords.map((keyword, index) => (
//             <option key={index} value={keyword}>{keyword}</option>
//           ))}
//         </select>
//       </div>

//       <div className={classes.formRow}>
//         <label htmlFor="locationSelector" className={classes.labelColumn}>Room Name:</label>
//         <select
//           id="locationSelector"
//           name="locationSelector"
//           value={roomName}
//           onChange={(e) => setRoomName(e.target.value)}
//           required
//           className={classes.inputColumn}
//         >
//           <option value="">Select Room</option>
//           {rooms.map((room, index) => (
//             <option key={index} value={room}>{room}</option>
//           ))}
//         </select>
//       </div>

//       {conditionType === 'temperature' && (
//         <>
//           <div className={classes.formRow}>
//             <label htmlFor="includeTemperature" className={classes.labelColumn}>Include Temperature:</label>
//             <input
//               id="includeTemperature"
//               name="includeTemperature"
//               type="checkbox"
//               checked={includeTemperature}
//               onChange={(e) => setIncludeTemperature(e.target.checked)}
//               className={classes.inputColumn}
//             />
//           </div>

//           {includeTemperature && (
//             <>
//               <div className={classes.formRow}>
//                 <label htmlFor="temperatureConditionSelector" className={classes.labelColumn}>Temperature Condition:</label>
//                 <select
//                   id="temperatureConditionSelector"
//                   name="temperatureConditionSelector"
//                   value={temperatureCondition}
//                   onChange={(e) => setTemperatureCondition(e.target.value)}
//                   required
//                   className={classes.inputColumn}
//                 >
//                   <option value="is above">Is Above</option>
//                   <option value="is equal to">Is Equal to</option>
//                   <option value="is below">Is Below</option>
//                   <option value="is less">Is Less</option>
//                 </select>
//               </div>

//               <div className={classes.formRow}>
//                 <label htmlFor="temperatureValue" className={classes.labelColumn}>Temperature (°C):</label>
//                 <input
//                   id="temperatureValue"
//                   name="temperatureValue"
//                   type="number"
//                   value={temperatureValue}
//                   onChange={(e) => setTemperatureValue(parseInt(e.target.value, 10))}
//                   required
//                   className={classes.inputColumn}
//                   min="0"
//                 />
//               </div>
//             </>
//           )}

//           <div className={classes.formRow}>
//             <label htmlFor="includeHumidity" className={classes.labelColumn}>Include Humidity:</label>
//             <input
//               id="includeHumidity"
//               name="includeHumidity"
//               type="checkbox"
//               checked={includeHumidity}
//               onChange={(e) => setIncludeHumidity(e.target.checked)}
//               className={classes.inputColumn}
//             />
//           </div>

//           {includeHumidity && (
//             <>
//               {includeTemperature && (
//                 <div className={classes.formRow}>
//                   <label htmlFor="operatorBeforeHumiditySelector" className={classes.labelColumn}>Operator Before Humidity Condition:</label>
//                   <select
//                     id="operatorBeforeHumiditySelector"
//                     name="operatorBeforeHumiditySelector"
//                     value={operatorBefore}
//                     onChange={(e) => setOperatorBefore(e.target.value)}
//                     required
//                     className={classes.inputColumn}
//                   >
//                     {operators.map((op, index) => (
//                       <option key={index} value={op}>{op}</option>
//                     ))}
//                   </select>
//                 </div>
//               )}

//               <div className={classes.formRow}>
//                 <label htmlFor="humidityConditionSelector" className={classes.labelColumn}>Humidity Condition:</label>
//                 <select
//                   id="humidityConditionSelector"
//                   name="humidityConditionSelector"
//                   value={humidityCondition}
//                   onChange={(e) => setHumidityCondition(e.target.value)}
//                   required
//                   className={classes.inputColumn}
//                 >
//                   <option value="is above">Is Above</option>
//                   <option value="is equal to">Is Equal to</option>
//                   <option value="is below">Is Below</option>
//                   <option value="is less">Is Less</option>

//                 </select>
//               </div>

//               <div className={classes.formRow}>
//                 <label htmlFor="humidityValue" className={classes.labelColumn}>Humidity (%):</label>
//                 <input
//                   id="humidityValue"
//                   name="humidityValue"
//                   type="number"
//                   value={humidityValue}
//                   onChange={(e) => setHumidityValue(parseInt(e.target.value, 10))}
//                   required
//                   className={classes.inputColumn}
//                   min="0"
//                   max="100"
//                 />
//               </div>
//             </>
//           )}
//         </>
//       )}

//       {conditionType === 'time' && (
//         <>
//           <div className={classes.formRow}>
//             <label htmlFor="timePeriodSelector" className={classes.labelColumn}>Time Period:</label>
//             <select
//               id="timePeriodSelector"
//               name="timePeriodSelector"
//               value={timePeriod}
//               onChange={(e) => setTimePeriod(e.target.value)}
//               required
//               className={classes.inputColumn}
//             >
//               <option value="">Select Time Period</option>
//               {timePeriods.map((period, index) => (
//                 <option key={index} value={period}>{period}</option>
//               ))}
//             </select>
//           </div>

//           <div className={classes.formRow}>
//             <label htmlFor="operatorBeforeSelector" className={classes.labelColumn}>Operator Before Temperature Condition:</label>
//             <select
//               id="operatorBeforeSelector"
//               name="operatorBeforeSelector"
//               value={operatorBefore}
//               onChange={(e) => setOperatorBefore(e.target.value)}
//               required
//               className={classes.inputColumn}
//             >
//               {operators.map((op, index) => (
//                 <option key={index} value={op}>{op}</option>
//               ))}
//             </select>
//           </div>

//           <div className={classes.formRow}>
//             <label htmlFor="temperatureConditionSelector" className={classes.labelColumn}>Temperature Condition:</label>
//             <select
//               id="temperatureConditionSelector"
//               name="temperatureConditionSelector"
//               value={temperatureCondition}
//               onChange={(e) => setTemperatureCondition(e.target.value)}
//               required
//               className={classes.inputColumn}
//             >
//                 <option value="is above">Is Above</option>
//                 <option value="is equal to">Is Equal to</option>
//                 <option value="is below">Is Below</option>
//                 <option value="is less">Is Less</option>
//             </select>
//           </div>

//           <div className={classes.formRow}>
//             <label htmlFor="temperatureValue" className={classes.labelColumn}>Temperature (°C):</label>
//             <input
//               id="temperatureValue"
//               name="temperatureValue"
//               type="number"
//               value={temperatureValue}
//               onChange={(e) => setTemperatureValue(parseInt(e.target.value, 10))}
//               required
//               className={classes.inputColumn}
//               min="0"
//             />
//           </div>
//         </>
//       )}

//       {conditionKeyword === 'in' && roomName !== 'bathroom' && conditionType === 'motion' && (
//         <>
//           <div className={classes.formRow}>
//             <label htmlFor="operatorBeforeSelector" className={classes.labelColumn}>Operator Before Activity:</label>
//             <select
//               id="operatorBeforeSelector"
//               name="operatorBeforeSelector"
//               value={operatorBefore}
//               onChange={(e) => setOperatorBefore(e.target.value)}
//               required
//               className={classes.inputColumn}
//             >
//               {operators.map((op, index) => (
//                 <option key={index} value={op}>{op}</option>
//               ))}
//             </select>
//           </div>

//           <div className={classes.formRow}>
//             <label htmlFor="activitySelector" className={classes.labelColumn}>Activity:</label>
//             <select
//               id="activitySelector"
//               name="activitySelector"
//               value={activity}
//               onChange={(e) => setActivity(e.target.value)}
//               required
//               className={classes.inputColumn}
//             >
//               <option value="">Select Activity</option>
//               {predefinedActivities.map((activity, index) => (
//                 <option key={index} value={activity}>{activity}</option>
//               ))}
//             </select>
//           </div>

//           <div className={classes.formRow}>
//             <label htmlFor="operatorAfterSelector" className={classes.labelColumn}>Operator After Activity:</label>
//             <select
//               id="operatorAfterSelector"
//               name="operatorAfterSelector"
//               value={operatorAfter}
//               onChange={(e) => setOperatorAfter(e.target.value)}
//               required
//               className={classes.inputColumn}
//             >
//               {operators.map((op, index) => (
//                 <option key={index} value={op}>{op}</option>
//               ))}
//             </select>
//           </div>

//           <div className={classes.formRow}>
//             <label htmlFor="seasonSelector" className={classes.labelColumn}>Season:</label>
//             <select
//               id="seasonSelector"
//               name="seasonSelector"
//               value={season}
//               onChange={(e) => setSeason(e.target.value)}
//               required
//               className={classes.inputColumn}
//             >
//               <option value="">Select Season</option>
//               {predefinedSeasons.map((season, index) => (
//                 <option key={index} value={season}>{season}</option>
//               ))}
//             </select>
//           </div>
//         </>
//       )}

//       <h3 className={classes.sectionTitle}>Control Variable</h3>

//       <div className={classes.deviceRow}>
//         {devices.map((device, index) => (
//           <div key={index} className={classes.deviceCheckbox}>
//             <label htmlFor={`device_${device}`} className={classes.deviceLabel}>
//               <input
//                 type="checkbox"
//                 id={`device_${device}`}
//                 name={`device_${device}`}
//                 value={device}
//                 onChange={() => handleDeviceSelectionChange(device)}
//               />
//               {device}
//             </label>
//           </div>
//         ))}
//       </div>

//       {Object.keys(selectedDevices).includes('AC') && (
//         <>
//           <div className={classes.formRow}>
//             <label htmlFor="acTemperatureSelector" className={classes.labelColumn}>AC Temperature (°C):</label>
//             <select
//               id="acTemperatureSelector"
//               name="acTemperatureSelector"
//               value={acTemperature}
//               onChange={(e) => setAcTemperature(parseInt(e.target.value, 10))}
//               required
//               className={classes.inputColumn}
//               aria-label="Select AC temperature"
//             >
//               <option value="">Select Temperature</option>
//               {Array.from({ length: 17 }, (_, i) => 16 + i).map(temp => (
//                 <option key={temp} value={temp}>{temp}°C</option>
//               ))}
//             </select>
//           </div>

//           <div className={classes.formRow}>
//             <label htmlFor="acMode" className={classes.labelColumn}>AC Mode:</label>
//             <select
//               id="acMode"
//               name="acMode"
//               value={acMode}
//               onChange={(e) => setAcMode(e.target.value)}
//               required
//               className={classes.inputColumn}
//               aria-label="Select AC mode"
//             >
//               <option value="">Select Mode</option>
//               <option value="cool">Cool</option>
//               <option value="heat">Heat</option>
//               <option value="fan">Fan</option>
//               <option value="dry">Dry</option>
//               <option value="auto">Auto</option>
//             </select>
//           </div>

//           <div className={classes.formRow}>
//             <label htmlFor="acState" className={classes.labelColumn}>AC State:</label>
//             <select
//               id="acState"
//               name="acState"
//               value={acState}
//               onChange={(e) => setAcState(e.target.value)}
//               required
//               className={classes.inputColumn}
//               aria-label="Select AC state"
//             >
//               <option value="">Select AC State</option>
//               <option value="on">On</option>
//               <option value="off">Off</option>
//             </select>
//           </div>
//         </>
//       )}

//       {Object.keys(selectedDevices).filter(device => device !== 'AC').map((device, index) => (
//         <div key={index} className={classes.formRow}>
//           <label htmlFor={`deviceState_${device}`} className={classes.labelColumn}>{device} State:</label>
//           <select
//             id={`deviceState_${device}`}
//             name={`deviceState_${device}`}
//             value={selectedDevices[device] || ''}
//             onChange={(e) => handleDeviceStateChange(device, e.target.value)}
//             required
//             className={classes.inputColumn}
//             aria-label={`Select state for ${device}`}
//           >
//             <option value="">Select State</option>
//             <option value="on">On</option>
//             <option value="off">Off</option>
//           </select>
//         </div>
//       ))}

//       <div className={classes.formRow}>
//         <button type="submit" className={classes.RulesDashboardButton} disabled={isSubmitting}>
//           {isSubmitting ? 'Adding...' : 'Add Rule'}
//         </button>
//       </div>
//     </form>
//   );
// };

// AddRuleComponent.defaultProps = {
//   spaceId: '', // Provide a default value for Space_ID if not provided
//   fullName: '', // Provide a default value for full name if not provided
// };

// export default AddRuleComponent;







import React, { useState, useEffect } from 'react';
import classes from './AddRuleComponent.module.scss';
import { toast } from 'react-toastify';
import { SERVER_URL } from '../../consts';
import { getGreeting_rule } from '../../utils/utils';

const predefinedActivities = ["Studying", "Sleeping", "watching_tv", "Eating", "Cooking", "Playing", "Outside"];
const predefinedSeasons = ["Spring", "Summer", "Fall", "Winter"];
const conditionKeywords = ["in", "not in"];
const conditionTypes = ["motion", "temperature", "time"];
const timePeriods = ["morning", "afternoon", "evening", "night"];
const operators = ["and", "or"];

const AddRuleComponent = ({ onSuccess, spaceId, fullName, onAddRule }) => {
  const greeting = getGreeting_rule();
  const [conditionType, setConditionType] = useState('motion');
  const [person, setPerson] = useState(fullName);
  const [conditionKeyword, setConditionKeyword] = useState('in');
  const [roomName, setRoomName] = useState('');
  const [activity, setActivity] = useState('');
  const [season, setSeason] = useState('');
  const [acTemperature, setAcTemperature] = useState(25);
  const [acMode, setAcMode] = useState('cool');
  const [acState, setAcState] = useState('on');
  const [lightState, setLightState] = useState('on');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState({});
  const [temperatureCondition, setTemperatureCondition] = useState('is above');
  const [temperatureValue, setTemperatureValue] = useState(25);
  const [humidityCondition, setHumidityCondition] = useState('is above');
  const [humidityValue, setHumidityValue] = useState(50);
  const [timePeriod, setTimePeriod] = useState(greeting);
  const [operatorBefore, setOperatorBefore] = useState('and');
  const [operatorAfter, setOperatorAfter] = useState('and');
  const [includeHumidity, setIncludeHumidity] = useState(false);
  const [includeTemperature, setIncludeTemperature] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchRooms = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/api-room/rooms/space/${spaceId}`);
        if (!cancelled && response.ok) {
          const data = await response.json();
          const roomNames = data.map(room => room.name);
          setRooms(roomNames);
        } else if (!cancelled) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to fetch rooms:', error);
          toast.error(`Failed to fetch rooms. ${error.message}`);
        }
      }
    };

    fetchRooms();

    return () => {
      cancelled = true;
    };
  }, [spaceId]);

  useEffect(() => {
    let cancelled = false;

    const fetchDevices = async () => {
      if (roomName) {
        try {
          const response = await fetch(`${SERVER_URL}/api-device/device/space/${spaceId}/${encodeURIComponent(roomName)}`);
          if (!cancelled && response.ok) {
            const data = await response.json();
            setDevices(data);
          } else if (!cancelled) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } catch (error) {
          if (!cancelled) {
            console.error('Failed to fetch devices:', error);
            toast.error(`Failed to fetch devices. ${error.message}`);
          }
        }
      }
    };

    fetchDevices();

    return () => {
      cancelled = true;
    };
  }, [roomName, spaceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const controlVariables = Object.entries(selectedDevices).reduce((acc, [device, state]) => {
      if (device.includes('AC')) {
        acc[device] = {
          state: acState,
          temperature: acTemperature,
          mode: acMode
        };
      } else {
        acc[device] = state;
      }
      return acc;
    }, {});

    const thenActions = Object.entries(selectedDevices).map(([device, state]) => {
      if (device.includes('AC')) {
        return `turn ${device} ${acMode} mode ${acTemperature} on`;
      } else {
        return `turn ${device} ${state}`;
      }
    }).join(' and ');

    let condition = '';
    if (conditionType === 'motion') {
      condition = `If ${person} ${conditionKeyword} ${roomName}${
        conditionKeyword === 'in' && roomName !== 'bathroom' ? ` ${operatorBefore} ${activity} ${operatorAfter} season is ${season}` : ''
      }`;
    } else if (conditionType === 'temperature') {
      if (includeTemperature && includeHumidity) {
        condition = `If temperature in ${roomName} ${temperatureCondition} ${temperatureValue} ${operatorBefore} humidity ${humidityCondition} ${humidityValue}`;
      } else if (includeTemperature) {
        condition = `If temperature in ${roomName} ${temperatureCondition} ${temperatureValue}`;
      } else if (includeHumidity) {
        condition = `If humidity in ${roomName} ${humidityCondition} ${humidityValue}`;
      }
    } else if (conditionType === 'time') {
      condition = `If hour ${conditionKeyword} ${roomName} is ${timePeriod} ${operatorBefore} temperature is ${temperatureCondition} ${temperatureValue}`;
    }

    const ruleData = {
      description: condition + ` then ${thenActions}`,
      condition: condition,
      control: controlVariables,
      space_id: spaceId
    };

    try {
      const response = await fetch(`${SERVER_URL}/api-rule/rules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ruleData),
      });

      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log(data);
        toast.success('Rule added successfully!');
        if (onAddRule) {
          onAddRule(data); // Call the callback function with the new rule
        }
      } else {
        const textResponse = await response.text();
        console.log(textResponse);
        if (response.ok) {
          toast.success(textResponse);
        } else {
          throw new Error(`HTTP error! status: ${response.status}, ${textResponse}`);
        }
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('There was an error!', error);
      toast.error(`Failed to add the rule. ${error.message}`);
    }

    setIsSubmitting(false);
  };

  const handleDeviceSelectionChange = (device) => {
    setSelectedDevices(prevState => {
      if (prevState[device]) {
        const newState = { ...prevState };
        delete newState[device];
        return newState;
      } else {
        return { ...prevState, [device]: 'on' };
      }
    });
  };

  const handleDeviceStateChange = (device, state) => {
    setSelectedDevices(prevState => ({
      ...prevState,
      [device]: state
    }));
  };

  return (
    <form onSubmit={handleSubmit} className={classes.formContainer}>
      <h3 className={classes.sectionTitle}>Condition Variable</h3>
      <div className={classes.formRow}>
        <label htmlFor="conditionTypeSelector" className={classes.labelColumn}>Condition Type:</label>
        <select
          id="conditionTypeSelector"
          name="conditionTypeSelector"
          value={conditionType}
          onChange={(e) => setConditionType(e.target.value)}
          required
          className={classes.inputColumn}
        >
          {conditionTypes.map((type, index) => (
            <option key={index} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {conditionType === 'motion' && (
        <div className={classes.formRow}>
          <label htmlFor="personSelector" className={classes.labelColumn}>Motion:</label>
          <input
            id="personSelector"
            name="personSelector"
            value={person}
            onChange={(e) => setPerson(e.target.value)}
            required
            className={classes.inputColumn}
            placeholder="Enter Motion name"
          />
        </div>
      )}

      <div className={classes.formRow}>
        <label htmlFor="conditionKeywordSelector" className={classes.labelColumn}>Condition Keyword:</label>
        <select
          id="conditionKeywordSelector"
          name="conditionKeywordSelector"
          value={conditionKeyword}
          onChange={(e) => setConditionKeyword(e.target.value)}
          required
          className={classes.inputColumn}
        >
          <option value="">Select Condition</option>
          {conditionKeywords.map((keyword, index) => (
            <option key={index} value={keyword}>{keyword}</option>
          ))}
        </select>
      </div>

      <div className={classes.formRow}>
        <label htmlFor="locationSelector" className={classes.labelColumn}>Room Name:</label>
        <select
          id="locationSelector"
          name="locationSelector"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          required
          className={classes.inputColumn}
        >
          <option value="">Select Room</option>
          {rooms.map((room, index) => (
            <option key={index} value={room}>{room}</option>
          ))}
        </select>
      </div>

      {conditionType === 'temperature' && (
        <>
          <div className={classes.formRow}>
            <label htmlFor="includeTemperature" className={classes.labelColumn}>Include Temperature:</label>
            <input
              id="includeTemperature"
              name="includeTemperature"
              type="checkbox"
              checked={includeTemperature}
              onChange={(e) => setIncludeTemperature(e.target.checked)}
              className={classes.inputColumn}
            />
          </div>

          {includeTemperature && (
            <>
              <div className={classes.formRow}>
                <label htmlFor="temperatureConditionSelector" className={classes.labelColumn}>Temperature Condition:</label>
                <select
                  id="temperatureConditionSelector"
                  name="temperatureConditionSelector"
                  value={temperatureCondition}
                  onChange={(e) => setTemperatureCondition(e.target.value)}
                  required
                  className={classes.inputColumn}
                >
                  <option value="is above">Is Above</option>
                  <option value="is equal to">Is Equal to</option>
                  <option value="is below">Is Below</option>
                  <option value="is less">Is Less</option>
                </select>
              </div>

              <div className={classes.formRow}>
                <label htmlFor="temperatureValue" className={classes.labelColumn}>Temperature (°C):</label>
                <input
                  id="temperatureValue"
                  name="temperatureValue"
                  type="number"
                  value={temperatureValue}
                  onChange={(e) => setTemperatureValue(parseInt(e.target.value, 10))}
                  required
                  className={classes.inputColumn}
                  min="0"
                />
              </div>
            </>
          )}

          <div className={classes.formRow}>
            <label htmlFor="includeHumidity" className={classes.labelColumn}>Include Humidity:</label>
            <input
              id="includeHumidity"
              name="includeHumidity"
              type="checkbox"
              checked={includeHumidity}
              onChange={(e) => setIncludeHumidity(e.target.checked)}
              className={classes.inputColumn}
            />
          </div>

          {includeHumidity && (
            <>
              {includeTemperature && (
                <div className={classes.formRow}>
                  <label htmlFor="operatorBeforeHumiditySelector" className={classes.labelColumn}>Operator Before Humidity Condition:</label>
                  <select
                    id="operatorBeforeHumiditySelector"
                    name="operatorBeforeHumiditySelector"
                    value={operatorBefore}
                    onChange={(e) => setOperatorBefore(e.target.value)}
                    required
                    className={classes.inputColumn}
                  >
                    {operators.map((op, index) => (
                      <option key={index} value={op}>{op}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className={classes.formRow}>
                <label htmlFor="humidityConditionSelector" className={classes.labelColumn}>Humidity Condition:</label>
                <select
                  id="humidityConditionSelector"
                  name="humidityConditionSelector"
                  value={humidityCondition}
                  onChange={(e) => setHumidityCondition(e.target.value)}
                  required
                  className={classes.inputColumn}
                >
                  <option value="is above">Is Above</option>
                  <option value="is equal to">Is Equal to</option>
                  <option value="is below">Is Below</option>
                  <option value="is less">Is Less</option>
                </select>
              </div>

              <div className={classes.formRow}>
                <label htmlFor="humidityValue" className={classes.labelColumn}>Humidity (%):</label>
                <input
                  id="humidityValue"
                  name="humidityValue"
                  type="number"
                  value={humidityValue}
                  onChange={(e) => setHumidityValue(parseInt(e.target.value, 10))}
                  required
                  className={classes.inputColumn}
                  min="0"
                  max="100"
                />
              </div>
            </>
          )}
        </>
      )}

      {conditionType === 'time' && (
        <>
          <div className={classes.formRow}>
            <label htmlFor="timePeriodSelector" className={classes.labelColumn}>Time Period:</label>
            <select
              id="timePeriodSelector"
              name="timePeriodSelector"
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              required
              className={classes.inputColumn}
            >
              <option value="">Select Time Period</option>
              {timePeriods.map((period, index) => (
                <option key={index} value={period}>{period}</option>
              ))}
            </select>
          </div>

          <div className={classes.formRow}>
            <label htmlFor="operatorBeforeSelector" className={classes.labelColumn}>Operator Before Temperature Condition:</label>
            <select
              id="operatorBeforeSelector"
              name="operatorBeforeSelector"
              value={operatorBefore}
              onChange={(e) => setOperatorBefore(e.target.value)}
              required
              className={classes.inputColumn}
            >
              {operators.map((op, index) => (
                <option key={index} value={op}>{op}</option>
              ))}
            </select>
          </div>

          <div className={classes.formRow}>
            <label htmlFor="temperatureConditionSelector" className={classes.labelColumn}>Temperature Condition:</label>
            <select
              id="temperatureConditionSelector"
              name="temperatureConditionSelector"
              value={temperatureCondition}
              onChange={(e) => setTemperatureCondition(e.target.value)}
              required
              className={classes.inputColumn}
            >
              <option value="is above">Is Above</option>
              <option value="is equal to">Is Equal to</option>
              <option value="is below">Is Below</option>
              <option value="is less">Is Less</option>
            </select>
          </div>

          <div className={classes.formRow}>
            <label htmlFor="temperatureValue" className={classes.labelColumn}>Temperature (°C):</label>
            <input
              id="temperatureValue"
              name="temperatureValue"
              type="number"
              value={temperatureValue}
              onChange={(e) => setTemperatureValue(parseInt(e.target.value, 10))}
              required
              className={classes.inputColumn}
              min="0"
            />
          </div>
        </>
      )}

      {conditionKeyword === 'in' && roomName !== 'bathroom' && conditionType === 'motion' && (
        <>
          <div className={classes.formRow}>
            <label htmlFor="operatorBeforeSelector" className={classes.labelColumn}>Operator Before Activity:</label>
            <select
              id="operatorBeforeSelector"
              name="operatorBeforeSelector"
              value={operatorBefore}
              onChange={(e) => setOperatorBefore(e.target.value)}
              required
              className={classes.inputColumn}
            >
              {operators.map((op, index) => (
                <option key={index} value={op}>{op}</option>
              ))}
            </select>
          </div>

          <div className={classes.formRow}>
            <label htmlFor="activitySelector" className={classes.labelColumn}>Activity:</label>
            <select
              id="activitySelector"
              name="activitySelector"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              required
              className={classes.inputColumn}
            >
              <option value="">Select Activity</option>
              {predefinedActivities.map((activity, index) => (
                <option key={index} value={activity}>{activity}</option>
              ))}
            </select>
          </div>

          <div className={classes.formRow}>
            <label htmlFor="operatorAfterSelector" className={classes.labelColumn}>Operator After Activity:</label>
            <select
              id="operatorAfterSelector"
              name="operatorAfterSelector"
              value={operatorAfter}
              onChange={(e) => setOperatorAfter(e.target.value)}
              required
              className={classes.inputColumn}
            >
              {operators.map((op, index) => (
                <option key={index} value={op}>{op}</option>
              ))}
            </select>
          </div>

          <div className={classes.formRow}>
            <label htmlFor="seasonSelector" className={classes.labelColumn}>Season:</label>
            <select
              id="seasonSelector"
              name="seasonSelector"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              required
              className={classes.inputColumn}
            >
              <option value="">Select Season</option>
              {predefinedSeasons.map((season, index) => (
                <option key={index} value={season}>{season}</option>
              ))}
            </select>
          </div>
        </>
      )}

      <h3 className={classes.sectionTitle}>Control Variable</h3>

      <div className={classes.deviceRow}>
        {devices.map((device, index) => (
          <div key={index} className={classes.deviceCheckbox}>
            <label htmlFor={`device_${device}`} className={classes.deviceLabel}>
              <input
                type="checkbox"
                id={`device_${device}`}
                name={`device_${device}`}
                value={device}
                onChange={() => handleDeviceSelectionChange(device)}
              />
              {device}
            </label>
          </div>
        ))}
      </div>

      {Object.keys(selectedDevices).includes('AC') && (
        <>
          <div className={classes.formRow}>
            <label htmlFor="acTemperatureSelector" className={classes.labelColumn}>AC Temperature (°C):</label>
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

          <div className={classes.formRow}>
            <label htmlFor="acMode" className={classes.labelColumn}>AC Mode:</label>
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
              <option value="on">On</option>
              <option value="off">Off</option>
            </select>
          </div>
        </>
      )}

      {Object.keys(selectedDevices).filter(device => device !== 'AC').map((device, index) => (
        <div key={index} className={classes.formRow}>
          <label htmlFor={`deviceState_${device}`} className={classes.labelColumn}>{device} State:</label>
          <select
            id={`deviceState_${device}`}
            name={`deviceState_${device}`}
            value={selectedDevices[device] || ''}
            onChange={(e) => handleDeviceStateChange(device, e.target.value)}
            required
            className={classes.inputColumn}
            aria-label={`Select state for ${device}`}
          >
            <option value="">Select State</option>
            <option value="on">On</option>
            <option value="off">Off</option>
          </select>
        </div>
      ))}

      <div className={classes.formRow}>
        <button type="submit" className={classes.RulesDashboardButton} disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Rule'}
        </button>
      </div>
    </form>
  );
};

AddRuleComponent.defaultProps = {
  spaceId: '', // Provide a default value for Space_ID if not provided
  fullName: '', // Provide a default value for full name if not provided
};

export default AddRuleComponent;
