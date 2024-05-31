// import React, { useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import '@fortawesome/fontawesome-free/css/all.min.css';
// import EditIcon from "@mui/icons-material/Edit";
// import SaveIcon from "@mui/icons-material/Save"; // Import Save icon
// import CancelIcon from "@mui/icons-material/Cancel"; // Import Cancel icon
// import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
// import { RuleSwitch } from "../UI/Switch/RuleSwitch";
// import classes from "./RulesTable.module.scss";
// import {
//   TableStyled,
//   ThStyled,
//   TitleStyled,
//   TableContainer
// } from "../Suggestions/suggestions.styles";
// import { ActionContainer, ActionTdStyled, ActiveCellStyled, Circle, RuleCell, TrStyled } from "./rules.styles";
// import { SERVER_URL } from "../../consts";

// const RulesTable = ({ rules, onRuleClick, selectedRule }) => {
//   const [currentRules, setCurrentRules] = useState(rules);
//   const [editRuleId, setEditRuleId] = useState(null);
//   const [editValue, setEditValue] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [ruleToDelete, setRuleToDelete] = useState(null);

//   console.log("RulesTable rendered with rules:", rules);

//   const handleEditClick = (rule) => {
//     setEditRuleId(rule.id);
//     setEditValue(rule.description);
//     console.log(`Editing rule ${rule.id}`);
//   };

//   const handleEditChange = (event) => {
//     setEditValue(event.target.value);
//     console.log("Edit value changed:", event.target.value);
//   };

//   const handleSaveEdit = async (ruleId) => {
//     console.log(`Saving edit for rule ${ruleId} with new description:`, editValue);
//     try {
//       const response = await axios.put(`${SERVER_URL}/api-rule/rules/${ruleId}`, { description: editValue });
//       if (response.status === 200) {
//         toast.success("Rule updated successfully!");
//         const updatedRules = currentRules.map(rule => rule.id === ruleId ? { ...rule, description: editValue } : rule);
//         setCurrentRules(updatedRules);
//         setEditRuleId(null); // Exit edit mode
//         console.log("Edit saved successfully.");
//       } else {
//         toast.error("Failed to update rule.");
//         console.log("Failed to save edit due to non-200 status code.");
//       }
//     } catch (error) {
//       console.error("Failed to update rule:", error);
//       toast.error("Failed to update rule.");
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditRuleId(null); // Exit edit mode without saving
//     setEditValue(""); // Reset edit value
//     console.log("Edit cancelled.");
//   };

//   const promptDeleteRule = (id) => {
//     setIsModalOpen(true);
//     setRuleToDelete(id);
//     console.log(`Prompting to delete rule ${id}`);
//   };

//   const confirmDeleteRule = async () => {
//     console.log(`Confirming delete for rule ${ruleToDelete}`);
//     if (ruleToDelete === null) return;
//     try {
//       const response = await axios.delete(`${SERVER_URL}/api-rule/rules/${ruleToDelete}`);
//       if (response.status === 200) {
//         const newRules = currentRules.filter((rule) => rule.id !== ruleToDelete);
//         setCurrentRules(newRules);
//         toast.success("Rule has been deleted.");
//         console.log("Rule deleted successfully.");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to delete rule.");
//     } finally {
//       setIsModalOpen(false);
//       setRuleToDelete(null);
//     }
//   };

//   return (
//     <div className={classes.TableContainer}>
//       <TableContainer>
//         <TitleStyled>Rules</TitleStyled>
//         <TableStyled className={classes.RulesTable}>
//           <thead>
//             <TrStyled>
//               <ThStyled>Active</ThStyled>
//               <ThStyled>Rule</ThStyled>
//               <ThStyled>Action</ThStyled>
//             </TrStyled>
//           </thead>
//           <tbody>
//             {currentRules.map((rule) => (
//               !rule.isHidden && (
//                 <TrStyled
//                   key={rule.id}
//                   onClick={() => onRuleClick(rule.id)}
//                   isSelected={rule.id === selectedRule}
//                 >
//                   <ActiveCellStyled>
//                     <Circle color={rule.isActive ? "green" : "red"} />
//                   </ActiveCellStyled>
//                   <RuleCell>
//                     {editRuleId === rule.id ? (
//                       <div style={{ display: "flex", alignItems: "center" }}>
//                         <input
//                           type="text"
//                           value={editValue}
//                           onChange={handleEditChange}
//                           style={{ flexGrow: 1 }}
//                         />
//                         <SaveIcon
//                           onClick={() => handleSaveEdit(rule.id)}
//                           style={{ cursor: "pointer", marginLeft: "8px" }}
//                         />
//                         <CancelIcon
//                           onClick={handleCancelEdit}
//                           style={{ cursor: "pointer", marginLeft: "8px" }}
//                         />
//                       </div>
//                     ) : (
//                       <span>{rule.description}</span>
//                     )}
//                   </RuleCell>
//                   <ActionTdStyled>
//                     <ActionContainer>
//                       <RuleSwitch isActive={rule.isActive} id={rule.id} rule={rule.rule} currentRules={currentRules} setCurrentRules={setCurrentRules} />
//                       <i
//                         className="fa fa-trash"
//                         onClick={(e) => {
//                           e.stopPropagation(); // Prevent the row click event
//                           promptDeleteRule(rule.id);
//                         }}
//                         style={{
//                           cursor: "pointer",
//                           color: "red",
//                           fontSize: "20px",
//                           marginRight: "8px",
//                         }}
//                       />
//                       <EditIcon
//                         style={{ cursor: "pointer" }}
//                         onClick={(e) => {
//                           e.stopPropagation(); // Prevent row selection
//                           handleEditClick(rule);
//                         }}
//                       />
//                     </ActionContainer>
//                   </ActionTdStyled>
//                 </TrStyled>
//               )
//             ))}
//           </tbody>
//         </TableStyled>
//       </TableContainer>
//       <ConfirmationModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onConfirm={confirmDeleteRule}
//         message="Are you sure you want to delete this rule?"
//       />
//     </div>
//   );
// };

// export default RulesTable;



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import '@fortawesome/fontawesome-free/css/all.min.css';
// import EditIcon from "@mui/icons-material/Edit";
// import SaveIcon from "@mui/icons-material/Save"; // Import Save icon
// import CancelIcon from "@mui/icons-material/Cancel"; // Import Cancel icon
// import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
// import { RuleSwitch } from "../UI/Switch/RuleSwitch";
// import classes from "./RulesTable.module.scss";
// import {
//   TableStyled,
//   ThStyled,
//   TitleStyled,
//   TableContainer
// } from "../Suggestions/suggestions.styles";
// import { ActionContainer, ActionTdStyled, ActiveCellStyled, Circle, RuleCell, TrStyled } from "./rules.styles";
// import { SERVER_URL } from "../../consts";

// const RulesTable = ({ rules, onRuleClick, selectedRule }) => {
//   const [currentRules, setCurrentRules] = useState(rules);
//   const [editRuleId, setEditRuleId] = useState(null);
//   const [editValue, setEditValue] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [ruleToDelete, setRuleToDelete] = useState(null);

//   useEffect(() => {
//     setCurrentRules(rules);
//   }, [rules]);

//   console.log("RulesTable rendered with rules:", rules);

//   const handleEditClick = (rule) => {
//     setEditRuleId(rule.id);
//     setEditValue(rule.description);
//     console.log(`Editing rule ${rule.id}`);
//   };

//   const handleEditChange = (event) => {
//     setEditValue(event.target.value);
//     console.log("Edit value changed:", event.target.value);
//   };

//   const handleSaveEdit = async (ruleId) => {
//     console.log(`Saving edit for rule ${ruleId} with new description:`, editValue);
//     try {
//       const response = await axios.put(`${SERVER_URL}/api-rule/rules/${ruleId}`, { description: editValue });
//       if (response.status === 200) {
//         toast.success("Rule updated successfully!");
//         const updatedRules = currentRules.map(rule => rule.id === ruleId ? { ...rule, description: editValue } : rule);
//         setCurrentRules(updatedRules);
//         setEditRuleId(null); // Exit edit mode
//         console.log("Edit saved successfully.");
//       } else {
//         toast.error("Failed to update rule.");
//         console.log("Failed to save edit due to non-200 status code.");
//       }
//     } catch (error) {
//       console.error("Failed to update rule:", error);
//       toast.error("Failed to update rule.");
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditRuleId(null); // Exit edit mode without saving
//     setEditValue(""); // Reset edit value
//     console.log("Edit cancelled.");
//   };

//   const promptDeleteRule = (id) => {
//     setIsModalOpen(true);
//     setRuleToDelete(id);
//     console.log(`Prompting to delete rule ${id}`);
//   };

//   const confirmDeleteRule = async () => {
//     console.log(`Confirming delete for rule ${ruleToDelete}`);
//     if (ruleToDelete === null) return;
//     try {
//       const response = await axios.delete(`${SERVER_URL}/api-rule/rules/${ruleToDelete}`);
//       if (response.status === 200) {
//         const newRules = currentRules.filter((rule) => rule.id !== ruleToDelete);
//         setCurrentRules(newRules);
//         toast.success("Rule has been deleted.");
//         console.log("Rule deleted successfully.");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to delete rule.");
//     } finally {
//       setIsModalOpen(false);
//       setRuleToDelete(null);
//     }
//   };

//   return (
//     <div className={classes.TableContainer}>
//       <TableContainer>
//         <TitleStyled>Rules</TitleStyled>
//         <TableStyled className={classes.RulesTable}>
//           <thead>
//             <TrStyled>
//               <ThStyled>Active</ThStyled>
//               <ThStyled>Rule</ThStyled>
//               <ThStyled>Action</ThStyled>
//             </TrStyled>
//           </thead>
//           <tbody>
//             {currentRules.map((rule) => (
//               !rule.isHidden && (
//                 <TrStyled
//                   key={rule.id}
//                   onClick={() => onRuleClick(rule.id)}
//                   isSelected={rule.id === selectedRule}
//                 >
//                   <ActiveCellStyled>
//                     <Circle color={rule.isActive ? "green" : "red"} />
//                   </ActiveCellStyled>
//                   <RuleCell>
//                     {editRuleId === rule.id ? (
//                       <div style={{ display: "flex", alignItems: "center" }}>
//                         <input
//                           type="text"
//                           value={editValue}
//                           onChange={handleEditChange}
//                           style={{ flexGrow: 1 }}
//                         />
//                         <SaveIcon
//                           onClick={() => handleSaveEdit(rule.id)}
//                           style={{ cursor: "pointer", marginLeft: "8px" }}
//                         />
//                         <CancelIcon
//                           onClick={handleCancelEdit}
//                           style={{ cursor: "pointer", marginLeft: "8px" }}
//                         />
//                       </div>
//                     ) : (
//                       <span>{rule.description}</span>
//                     )}
//                   </RuleCell>
//                   <ActionTdStyled>
//                     <ActionContainer>
//                       <RuleSwitch isActive={rule.isActive} id={rule.id} rule={rule.rule} currentRules={currentRules} setCurrentRules={setCurrentRules} />
//                       <i
//                         className="fa fa-trash"
//                         onClick={(e) => {
//                           e.stopPropagation(); // Prevent the row click event
//                           promptDeleteRule(rule.id);
//                         }}
//                         style={{
//                           cursor: "pointer",
//                           color: "red",
//                           fontSize: "20px",
//                           marginRight: "8px",
//                         }}
//                       />
//                       <EditIcon
//                         style={{ cursor: "pointer" }}
//                         onClick={(e) => {
//                           e.stopPropagation(); // Prevent row selection
//                           handleEditClick(rule);
//                         }}
//                       />
//                     </ActionContainer>
//                   </ActionTdStyled>
//                 </TrStyled>
//               )
//             ))}
//           </tbody>
//         </TableStyled>
//       </TableContainer>
//       <ConfirmationModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onConfirm={confirmDeleteRule}
//         message="Are you sure you want to delete this rule?"
//       />
//     </div>
//   );
// };

// export default RulesTable;







import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save"; // Import Save icon
import CancelIcon from "@mui/icons-material/Cancel"; // Import Cancel icon
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import { RuleSwitch } from "../UI/Switch/RuleSwitch";
import RulesModal from "./../../components/RulesModal/RulesModal";
import AddRuleComponent from '../../components/AddRuleComponent/AddRuleComponent';
import AddDetectionRuleComponent from '../../components/AddDetectionRuleComponent/AddDetectionRuleComponent';
import classes from "./RulesTable.module.scss";
import {
  TableStyled,
  ThStyled,
  TitleStyled,
  TableContainer
} from "../Suggestions/suggestions.styles";
import { ActionContainer, ActionTdStyled, ActiveCellStyled, Circle, RuleCell, TrStyled } from "./rules.styles";
import { SERVER_URL } from "../../consts";
import { useSpace } from './../../contexts/SpaceContext';
const RulesTable = ({ rules, onRuleClick, selectedRule }) => {
  const [currentRules, setCurrentRules] = useState(rules);
  const [editRuleId, setEditRuleId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState(null);
  const [openAddRuleModal, setOpenAddRuleModal] = useState(false);
  const [componentToShow, setComponentToShow] = useState('');
  const [temperature, setTemperature] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('>');
  const [acMode, setAcMode] = useState('Cool');
  const [acState, setacState] = useState('Cool');
  const [acTemperature, setAcTemperature] = useState(26);
  const { spaceId } = useSpace();
  useEffect(() => {
    setCurrentRules(rules);
  }, [rules]);

  const handleEditClick = (rule) => {
    setEditRuleId(rule.id);
    setEditValue(rule.description);
  };

  const handleEditChange = (event) => {
    setEditValue(event.target.value);
  };

  const handleSaveEdit = async (ruleId) => {
    try {
      const response = await axios.put(`${SERVER_URL}/api-rule/rules/${ruleId}`, { description: editValue });
      if (response.status === 200) {
        toast.success("Rule updated successfully!");
        const updatedRules = currentRules.map(rule => rule.id === ruleId ? { ...rule, description: editValue } : rule);
        setCurrentRules(updatedRules);
        setEditRuleId(null);
      } else {
        toast.error("Failed to update rule.");
      }
    } catch (error) {
      toast.error("Failed to update rule.");
    }
  };

  const handleCancelEdit = () => {
    setEditRuleId(null);
    setEditValue("");
  };

  const promptDeleteRule = (id) => {
    setIsModalOpen(true);
    setRuleToDelete(id);
  };

  const confirmDeleteRule = async () => {
    if (ruleToDelete === null) return;
    try {
      const response = await axios.delete(`${SERVER_URL}/api-rule/rules/${ruleToDelete}`);
      if (response.status === 200) {
        const newRules = currentRules.filter((rule) => rule.id !== ruleToDelete);
        setCurrentRules(newRules);
        toast.success("Rule has been deleted.");
      }
    } catch (err) {
      toast.error("Failed to delete rule.");
    } finally {
      setIsModalOpen(false);
      setRuleToDelete(null);
    }
  };

  const handleOpenAddRuleModal = () => {
    setOpenAddRuleModal(true);
  };

  const handleCloseAddRuleModal = () => {
    setOpenAddRuleModal(false);
  };

  const renderRuleForm = () => {
    if (componentToShow === 'AC') {
      return (
        <AddRuleComponent
          temperature={temperature}
          setTemperature={setTemperature}
          selectedOperator={selectedOperator}
          setSelectedOperator={setSelectedOperator}
          acTemperature={acTemperature}
          setAcTemperature={setAcTemperature}
          acMode={acMode}
          setAcMode={setAcMode}
          acState={acState}
          setacState={setacState}
          spaceId={spaceId}
        />
      );
    } else if (componentToShow === 'Light') {
      return <AddDetectionRuleComponent />;
    }
    return null;
  };

  return (
    <div className={classes.TableContainer}>
      <div className={classes.TableHeader}>
        <TitleStyled>Rules</TitleStyled>
        <button className={classes.Button} onClick={handleOpenAddRuleModal}>
          Add Rule
        </button>
        <RulesModal show={openAddRuleModal} onCloseModal={handleCloseAddRuleModal}>
          <h2>Add Rule</h2>
          <div className={classes.RuleTypeButtons}>
            <button
              className={`${classes.RuleTypeButton} ${componentToShow === 'AC' ? classes.Active : ''}`}
              onClick={() => setComponentToShow('AC')}
            >
              AC
            </button>
            <button
              className={`${classes.RuleTypeButton} ${componentToShow === 'Light' ? classes.Active : ''}`}
              onClick={() => setComponentToShow('Light')}
            >
              Light
            </button>
          </div>
          <div className={classes.SelectContainer}>
            {renderRuleForm()}
          </div>
        </RulesModal>
      </div>
      <TableContainer>
        <TableStyled className={classes.RulesTable}>
          <thead>
            <TrStyled>
              <ThStyled>Active</ThStyled>
              <ThStyled>Rule</ThStyled>
              <ThStyled>Action</ThStyled>
            </TrStyled>
          </thead>
          <tbody>
            {currentRules.map((rule) => (
              !rule.isHidden && (
                <TrStyled
                  key={rule.id}
                  onClick={() => onRuleClick(rule.id)}
                  isSelected={rule.id === selectedRule}
                >
                  <ActiveCellStyled>
                    <Circle color={rule.isActive ? "green" : "red"} />
                  </ActiveCellStyled>
                  <RuleCell>
                    {editRuleId === rule.id ? (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                          type="text"
                          value={editValue}
                          onChange={handleEditChange}
                          style={{ flexGrow: 1 }}
                        />
                        <SaveIcon
                          onClick={() => handleSaveEdit(rule.id)}
                          style={{ cursor: "pointer", marginLeft: "8px" }}
                        />
                        <CancelIcon
                          onClick={handleCancelEdit}
                          style={{ cursor: "pointer", marginLeft: "8px" }}
                        />
                      </div>
                    ) : (
                      <span>{rule.description}</span>
                    )}
                  </RuleCell>
                  <ActionTdStyled>
                    <ActionContainer>
                      <RuleSwitch isActive={rule.isActive} id={rule.id} rule={rule.rule} currentRules={currentRules} setCurrentRules={setCurrentRules} />
                      <i
                        className="fa fa-trash"
                        onClick={(e) => {
                          e.stopPropagation();
                          promptDeleteRule(rule.id);
                        }}
                        style={{
                          cursor: "pointer",
                          color: "red",
                          fontSize: "20px",
                          marginRight: "8px",
                        }}
                      />
                      <EditIcon
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(rule);
                        }}
                      />
                    </ActionContainer>
                  </ActionTdStyled>
                </TrStyled>
              )
            ))}
          </tbody>
        </TableStyled>
      </TableContainer>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDeleteRule}
        message="Are you sure you want to delete this rule?"
      />
    </div>
  );
};

export default RulesTable;
