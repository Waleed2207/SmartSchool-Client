// import React, { useState, useEffect,useContext  } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import '@fortawesome/fontawesome-free/css/all.min.css';
// import EditIcon from "@mui/icons-material/Edit";
// import SaveIcon from "@mui/icons-material/Save";
// import CancelIcon from "@mui/icons-material/Cancel";
// import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
// import { RuleSwitch } from "../UI/Switch/RuleSwitch";
// import RulesModal from "../../components/RulesModal/RulesModal";
// import AddRuleComponent from '../../components/AddRuleComponent/AddRuleComponent';
// import classes from "./RulesTable.module.scss";
// import {
//   TableStyled,
//   ThStyled,
//   TitleStyled,
//   TableContainer
// } from "../Suggestions/suggestions.styles";
// import { ActionContainer, ActionTdStyled, ActiveCellStyled, Circle, RuleCell, TrStyled } from "./rules.styles";
// import { SERVER_URL } from "../../consts";
// import { useSpace } from '../../contexts/SpaceContext';
// import UserContext from "../../contexts/UserContext";

// const RulesTable = ({ rules, onRuleClick, selectedRule }) => {
//   const [currentRules, setCurrentRules] = useState(rules);
//   const [editRuleId, setEditRuleId] = useState(null);
//   const [editValue, setEditValue] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [ruleToDelete, setRuleToDelete] = useState(null);
//   const [openAddRuleModal, setOpenAddRuleModal] = useState(false);
//   const { spaceId } = useSpace();
//   const { user } = useContext(UserContext);
//   const fullName = user?.fullName || "";

  
//   useEffect(() => {
//     setCurrentRules(rules);
//   }, [rules]);

//   const handleEditClick = (rule) => {
//     setEditRuleId(rule.id);
//     setEditValue(rule.description);
//   };

//   const handleEditChange = (event) => {
//     setEditValue(event.target.value);
//   };

//   const handleSaveEdit = async (ruleId) => {
//     try {
//       const response = await axios.put(`${SERVER_URL}/api-rule/rules/${ruleId}`, { description: editValue });
//       if (response.status === 200) {
//         toast.success("Rule updated successfully!");
//         const updatedRules = currentRules.map(rule => rule.id === ruleId ? { ...rule, description: editValue } : rule);
//         setCurrentRules(updatedRules);
//         setEditRuleId(null);
//       } else {
//         toast.error("Failed to update rule.");
//       }
//     } catch (error) {
//       toast.error("Failed to update rule.");
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditRuleId(null);
//     setEditValue("");
//   };

//   const promptDeleteRule = (id) => {
//     setIsModalOpen(true);
//     setRuleToDelete(id);
//   };

//   const confirmDeleteRule = async () => {
//     if (ruleToDelete === null) return;
//     try {
//       const response = await axios.delete(`${SERVER_URL}/api-rule/rules/${ruleToDelete}`);
//       if (response.status === 200) {
//         const newRules = currentRules.filter((rule) => rule.id !== ruleToDelete);
//         setCurrentRules(newRules);
//         toast.success("Rule has been deleted.");
//       }
//     } catch (err) {
//       toast.error("Failed to delete rule.");
//     } finally {
//       setIsModalOpen(false);
//       setRuleToDelete(null);
//     }
//   };

//   const handleOpenAddRuleModal = () => {
//     setOpenAddRuleModal(true);
//   };

//   const handleCloseAddRuleModal = () => {
//     setOpenAddRuleModal(false);
//   };

//   return (
//     <div className={classes.TableContainer}>
//       <div className={classes.TableHeader}>
//         <TitleStyled>Rules</TitleStyled>
//         <button className={classes.Button} onClick={handleOpenAddRuleModal}>
//           Add Rule
//         </button>
//         <RulesModal show={openAddRuleModal} onCloseModal={handleCloseAddRuleModal}>
//           <h2>Add Rule</h2>
//           <AddRuleComponent spaceId={spaceId} fullName={fullName} onSuccess={() => {
//             setOpenAddRuleModal(false);
//             // Optionally refresh the list of rules here
//           }} />
//         </RulesModal>
//       </div>
//       <TableContainer>
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
//                           e.stopPropagation();
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
//                           e.stopPropagation();
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






import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import { RuleSwitch } from "../UI/Switch/RuleSwitch";
import RulesModal from "../../components/RulesModal/RulesModal";
import AddRuleComponent from '../../components/AddRuleComponent/AddRuleComponent';
import classes from "./RulesTable.module.scss";
import {
  TableStyled,
  ThStyled,
  TitleStyled,
  TableContainer
} from "../Suggestions/suggestions.styles";
import { ActionContainer, ActionTdStyled, ActiveCellStyled, Circle, RuleCell, TrStyled } from "./rules.styles";
import { SERVER_URL } from "../../consts";
import { useSpace } from '../../contexts/SpaceContext';
import UserContext from "../../contexts/UserContext";

const RulesTable = ({ rules, onRuleClick, selectedRule, onAddRule }) => {
  const [currentRules, setCurrentRules] = useState(rules);
  const [editRuleId, setEditRuleId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState(null);
  const [openAddRuleModal, setOpenAddRuleModal] = useState(false);
  const { spaceId } = useSpace();
  const { user } = useContext(UserContext);
  const fullName = user?.fullName || "";

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

  return (
    <div className={classes.TableContainer}>
      <div className={classes.TableHeader}>
        <TitleStyled>Rules</TitleStyled>
        <button className={classes.Button} onClick={handleOpenAddRuleModal}>
          Add Rule
        </button>
        <RulesModal show={openAddRuleModal} onCloseModal={handleCloseAddRuleModal}>
          <h2>Add Rule</h2>
          <AddRuleComponent spaceId={spaceId} fullName={fullName} onSuccess={() => {
            setOpenAddRuleModal(false);
          }} onAddRule={(newRule) => {
            onAddRule(newRule);
            handleCloseAddRuleModal();
          }} />
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
