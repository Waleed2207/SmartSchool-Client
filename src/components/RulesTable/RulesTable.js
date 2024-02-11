import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, IconButton } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "font-awesome/css/font-awesome.min.css";
import { SERVER_URL } from "../../consts";
import classes from "./RulesTable.module.scss";
import {Circle, ActiveCellStyled} from "./rules.styles"

const RulesTable = ({ searchText }) => {
  const [rules, setRules] = useState([]);
  const [editRuleId, setEditRuleId] = useState(null);
  const [editRuleValue, setEditRuleValue] = useState("");

  // Standalone fetchRules function
  const fetchRules = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/rules`, {
      
      });
      setRules(response.data);
      toast.info("Rules fetched successfully!");
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else {
        console.error("Failed to fetch rules:", error);
        toast.error("Failed to fetch rules.");
      }
    }

  };

  useEffect(() => {
    fetchRules();
    // No clean-up function needed since there's no cancel token being used
  }, []);

  const handleEditChange = (event) => {
    setEditRuleValue(event.target.value);
  };

  const handleSaveEdit = async (ruleId) => {
    try {
      await axios.put(`${SERVER_URL}/rules/${ruleId}`, { rule: editRuleValue });
      toast.success("Rule updated successfully!");
      setEditRuleId(null);
      setEditRuleValue("");
      fetchRules(); // Optionally, refetch the rules list to reflect the update
    } catch (error) {
      console.error("Failed to update rule:", error);
      toast.error("Failed to update rule.");
    }
  };

  const handleDeleteRule = async (ruleId) => {
    try {
      await axios.delete(`${SERVER_URL}/rules/${ruleId}`);
      toast.success("Rule deleted successfully!");
      fetchRules(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete rule:", error);
      toast.error("Failed to delete rule.");
    }
  };

  return (
    <div className={classes.TableContainer}>
      <h2>Rules</h2>
      <table className={classes.TableStyled}>
        <thead>
          <tr>
            <th>Active</th>
            <th></th>
            <th>Rule</th>
            <th>Action</th>
          </tr>
        </thead>
       
        <tbody>
  {rules
    .filter(rule => {
      const ruleLowercased = rule.rule && rule.rule.toLowerCase();
      const searchTextLowercased = searchText && searchText.toLowerCase();
      return ruleLowercased && searchTextLowercased 
        ? ruleLowercased.includes(searchTextLowercased)
        : true; // If searchText is undefined, all rules pass the filter
    })
    .map((rule) => (          
        <tr key={rule.id}>
              <ActiveCellStyled>
                <Circle color={rule.isActive ? "green" : "red"} />
              </ActiveCellStyled>
              <td>
                {editRuleId === rule.id ? (
                  <input
                    type="text"
                    value={editRuleValue}
                    onChange={handleEditChange}
                  />
                ) : (
                  rule.rule
                )}
              </td>
              <td>
              <td>
          {editRuleId === rule.id ? (
            <input
              type="text"
              value={editRuleValue}
              onChange={handleEditChange}
            />
          ) : (
            rule.description // Display the rule description here
          )}
        </td>
              </td>
              <td>
                {editRuleId === rule.id ? (
                  <>
                    <Button size="small" onClick={() => handleSaveEdit(rule.id)}>Save</Button>
                    <Button size="small" onClick={() => { setEditRuleId(null); setEditRuleValue(""); }}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <IconButton size="small" onClick={() => { setEditRuleId(rule.id); setEditRuleValue(rule.rule); }}><EditIcon /></IconButton>
                    <IconButton size="small" onClick={() => handleDeleteRule(rule.id)}><DeleteIcon /></IconButton>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default RulesTable;