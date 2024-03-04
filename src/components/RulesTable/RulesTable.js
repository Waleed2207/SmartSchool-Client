import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "font-awesome/css/font-awesome.min.css";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save"; // Import Save icon
import CancelIcon from "@material-ui/icons/Cancel"; // Import Cancel icon
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import { RuleSwitch } from "../UI/Switch/RuleSwitch";
import classes from "./RulesTable.module.scss";
import {
  TableStyled,
  ThStyled,
  TitleStyled,
  TableContainer
} from "../Suggestions/suggestions.styles";
import { ActionContainer, ActionTdStyled, ActiveCellStyled, Circle, RuleCell, TrStyled } from "./rules.styles";
import { SERVER_URL } from "../../consts";

const RulesTable = ({ rules, onRuleClick, selectedRule }) => {
  const [currentRules, setCurrentRules] = useState(rules);
  const [editRuleId, setEditRuleId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState(null);

  console.log("RulesTable rendered with rules:", rules);

  const handleEditClick = (rule) => {
    setEditRuleId(rule.id);
    setEditValue(rule.description);
    console.log(`Editing rule ${rule.id}`);
  };

  const handleEditChange = (event) => {
    setEditValue(event.target.value);
    console.log("Edit value changed:", event.target.value);
  };

  const handleSaveEdit = async (ruleId) => {
    console.log(`Saving edit for rule ${ruleId} with new description:`, editValue);
    try {
      const response = await axios.put(`${SERVER_URL}/api-rule/rules/${ruleId}`, { description: editValue });
      if (response.status === 200) {
        toast.success("Rule updated successfully!");
        const updatedRules = currentRules.map(rule => rule.id === ruleId ? { ...rule, description: editValue } : rule);
        setCurrentRules(updatedRules);
        setEditRuleId(null); // Exit edit mode
        console.log("Edit saved successfully.");
      } else {
        toast.error("Failed to update rule.");
        console.log("Failed to save edit due to non-200 status code.");
      }
    } catch (error) {
      console.error("Failed to update rule:", error);
      toast.error("Failed to update rule.");
    }
  };

  const handleCancelEdit = () => {
    setEditRuleId(null); // Exit edit mode without saving
    setEditValue(""); // Reset edit value
    console.log("Edit cancelled.");
  };

  const promptDeleteRule = (id) => {
    setIsModalOpen(true);
    setRuleToDelete(id);
    console.log(`Prompting to delete rule ${id}`);
  };

  const confirmDeleteRule = async () => {
    console.log(`Confirming delete for rule ${ruleToDelete}`);
    if (ruleToDelete === null) return;
    try {
      const response = await axios.delete(`${SERVER_URL}/api-rule/rules/${ruleToDelete}`);
      if (response.status === 200) {
        const newRules = currentRules.filter((rule) => rule.id !== ruleToDelete);
        setCurrentRules(newRules);
        toast.success("Rule has been deleted.");
        console.log("Rule deleted successfully.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete rule.");
    } finally {
      setIsModalOpen(false);
      setRuleToDelete(null);
    }
  };

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
                      <EditIcon
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row selection
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
