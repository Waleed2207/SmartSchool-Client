import axios from "axios";
import React, { useState } from "react";

import { Notification } from "../Notification/Notification";
import { RuleSwitch } from "../UI/Switch/RuleSwitch";
import classes from "./RulesTable.module.scss";
// import Switch from '@mui/material/Switch';
import { toast } from "react-toastify";
import "font-awesome/css/font-awesome.min.css";
//import { updateRule } from "../../services/rules.service";
import { SnackBar } from "../Snackbar/SnackBar";
//import EditIcon from "@material-ui/icons/Edit";
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';

import {
  TableStyled,
  ThStyled,
  TitleStyled,
  TableContainer
} from "../Suggestions/suggestions.styles";
import { ActionContainer, ActionTdStyled, ActiveCellStyled, Circle, RuleCell, TrStyled } from "./rules.styles";
import { SERVER_URL } from "../../consts";
import "react-toastify/dist/ReactToastify.css";
import "font-awesome/css/font-awesome.min.css";
const RulesTable = ({ rules, onRuleClick, selectedRule, userRole }) => {
  const [currentRules, setCurrentRules] = useState(rules);
  const [alertVisible] = useState(false);
  const [alertMessage] = useState("");
 
  const [openSeccessSnackBar, setOpenSuccessSnackbar] = useState(false);
  const [openFailureSnackBar, setOpenFailureSnackbar] = useState(false);
  // const [editRuleId, setEditRuleId] = useState(null);
  // const [editValue, setEditValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
const [ruleToDelete, setRuleToDelete] = useState(null);
const promptDeleteRule = (id) => {
  setIsModalOpen(true);
  setRuleToDelete(id);
};

  // Standalone fetchRules function
  const handleCloseSnackBar = () => {
    setOpenSuccessSnackbar(false);
    setOpenFailureSnackbar(false);
  };
  // const handleEditClick = (rule) => {
  //   setEditRuleId(rule.id);
  //   setEditValue(rule.normalizedRule || rule.description);
  // };

  // const handleSaveEdit = async () => {
  //   try {
  //     const response = await axios.put(`${SERVER_URL}/rules/${editRuleId}`, { rule: editValue });
  //     if (response.status === 200) {
  //       toast.success("Rule updated successfully!");
  //       // Update the rule in the local state to reflect the change immediately
  //       const updatedRules = rules.map(rule =>
  //         rule.id === editRuleId ? { ...rule, normalizedRule: editValue, description: editValue } : rule
  //       );
  //       onRuleClick(updatedRules); // Assuming onRuleClick can be repurposed to update rules list
  //       setEditRuleId(null);
  //     } else {
  //       toast.error("Failed to update rule.");
  //     }
  //   } catch (error) {
  //     console.error("Failed to update rule:", error);
  //     toast.error("Failed to update rule.");
  //   }
  // };

  // const handleCancelEdit = () => {
  //   setEditRuleId(null);
  //   setEditValue("");
  // };

  // const notifyAdmin = async (subject, text) => {
  //   try {
  //     await axios.post(`${SERVER_URL}/notifyadmin`, { subject, text });
  //   } catch (error) {
  //     console.error("Failed to send email notification to admin:", error);
  //   }
  // };
  // const deleteRule = async (id) => {
  //   try {
  //     const response = await axios.delete(`${SERVER_URL}/rules/${id}`);
  //     if (response.status === 200) {
  //       const newRules = rules.filter((rule) => rule.id !== id);
  //       setCurrentRules(newRules);
  //       toast.success("Rule has been deleted.");
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  const confirmDeleteRule = async () => {
    if (ruleToDelete === null) return;
  
    try {
      const response = await axios.delete(`${SERVER_URL}/rules/${ruleToDelete}`);
      if (response.status === 200) {
        const newRules = currentRules.filter((rule) => rule.id !== ruleToDelete);
        setCurrentRules(newRules);
        toast.success("Rule has been deleted.");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete rule.");
    } finally {
      setIsModalOpen(false);
      setRuleToDelete(null);
    }
  };
  
  // const isSearched = (rule) => {
  //   return rule.rule.toLowerCase().includes(searchText.toLowerCase());
  // };


  // const handleEditChange = (event) => {
  //   setEditRuleValue(event.target.value);
  // };

  // const handleSaveEdit = async (ruleId) => {
  //   try {
  //     await axios.put(`${SERVER_URL}/rules/${ruleId}`, { rule: editRuleValue });
  //     toast.success("Rule updated successfully!");
  //     setEditRuleId(null);
  //     setEditRuleValue("");
  //    // fetchRules(); // Optionally, refetch the rules list to reflect the update
  //  } catch (error) {
  //     console.error("Failed to update rule:", error);
  //     toast.error("Failed to update rule.");
  //  }
  // };

  // const handleDeleteRule = async (ruleId) => {
  //   try {
  //     await axios.delete(`${SERVER_URL}/rules/${ruleId}`);
  //     toast.success("Rule deleted successfully!");
  //     //fetchRules(); // Refresh the list
  //   } catch (error) {
  //     console.error("Failed to delete rule:", error);
  //     toast.error("Failed to delete rule.");
  //   }
  // };

  return (
    <div className={classes.TableContainer}>
   
      <TableContainer>
      <TitleStyled>Rules</TitleStyled>
      <TableStyled className={classes.RulesTable}>
        <thead>
          <TrStyled>
            <ThStyled>Active</ThStyled>
            <ThStyled>Rule</ThStyled>
            <ThStyled>Action</ThStyled>
          </TrStyled>
        </thead>
        <tbody>
          {currentRules.map((rule, index) => (
            !rule.isHidden &&
            <TrStyled
              key={rule.id}
              onClick={() => onRuleClick(rule.id)}
              isSelected={rule.id === selectedRule}
             // isSearched={isSearched(rule)}
              classes={classes}
              isStrict={rule.isStrict}
            >
              <ActiveCellStyled>
                <Circle color={rule.isActive ? "green" : "red"} />
              </ActiveCellStyled>
              <RuleCell>
              {rule.description} 
              </RuleCell>
              
              <ActionTdStyled>
                <ActionContainer>
                  <RuleSwitch isActive={rule.isActive} id={rule.id} rule={rule.rule} currentRules={currentRules} setCurrentRules={setCurrentRules} />
                  {/* ConfirmationModal usage */}
<ConfirmationModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onConfirm={confirmDeleteRule}
  message="Are you sure you want to delete this rule?"
/>
<i
  className="fa fa-trash"
  onClick={(e) => {
    e.stopPropagation(); // Prevent the row click event
    promptDeleteRule(rule.id);
  }}
  style={{
    cursor: "pointer",
    color: "red",
    fontSize: "20px",
    marginRight: "8px",
  }}
/>

           
                  {/* <EditIcon
                      style={{ cursor: "pointer" }}
                      onClick={() => setEditedRule(rule.id)}
                    /> */}
                </ActionContainer>
              </ActionTdStyled>
            </TrStyled>
          ))}
        </tbody>
      </TableStyled>
     
     
        {openSeccessSnackBar && (
        <SnackBar
          message={`Rule updated successfully`}
          isOpen={true}
          handleCloseSnackBar={handleCloseSnackBar}
          color="green"
        />
      )}
      {openFailureSnackBar && (
        <SnackBar
          message={`Cannot update rule`}
          isOpen={true}
          handleCloseSnackBar={handleCloseSnackBar}
          color="red"
        />
      )}

      {alertVisible && <Notification message={alertMessage} />}
 
       </TableContainer>
      
    </div>
  );
};

export default RulesTable;