import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addRule } from "./../../store/rules/rules.actions";
import axios from "axios";
import RulesTable from "./../../components/RulesTable/RulesTable";
import classes from "./RulesDashboard.module.scss";
import { SnackBar } from "../../components/Snackbar/SnackBar";
import UserContext from "../../contexts/UserContext";
import { SERVER_URL } from "../../consts";
import { SearchRuleInput } from "../../components/RulesTable/rules.styles";
import { toast } from "react-toastify";
import { useSpace } from './../../contexts/SpaceContext';
const RulesDashboard = () => {
  const [rules, setRules] = useState([]);
  const [openAddRuleModal, setOpenAddRuleModal] = useState(false);
  const [openSuccessSnackBar, setOpenSuccessSnackbar] = useState(false);
  const [openFailureSnackBar, setOpenFailureSnackBar] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredRules, setFilteredRules] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const { user } = useContext(UserContext);
  const userRole = user?.role || "User";
  const { spaceId } = useSpace();
  const fetchRules = async (spaceId) => {
    try {
      const response = await axios.get(`${SERVER_URL}/api-rule/rules/${spaceId}`);
      toast.info("Rules fetched successfully!");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch rules:", error);
      toast.error("Failed to fetch rules.");
      return [];
    }
  };

  useEffect(() => {
    const fetchAllRules = async () => {
      if (spaceId) {
        const fetchedRules = await fetchRules(spaceId);
        setRules(fetchedRules);
      }
    };
    fetchAllRules();
  }, [spaceId]);

  const onSearchInputChange = (event) => {
    setSearch(event.target.value);
    if (event.target.value) {
      const filtered = rules.filter((rule) =>
        rule.rule.toLowerCase().includes(event.target.value.toLowerCase())
      );
      setFilteredRules(filtered);
    } else {
      setFilteredRules([]);
    }
  };
  const handleCloseSnackBar = () => {
    setOpenSuccessSnackbar(false);
    setOpenFailureSnackBar(false);
  };

  return (
    <div className={classes.RulesDashboard}>
      <div className={classes.SearchContainer}>
        <SearchRuleInput
          type="text"
          value={search}
          onChange={onSearchInputChange}
          placeholder="Search for a rule..."
          className={classes.SearchInput}
        />
        {filteredRules.length > 0 && (
          <div className={classes.FilteredRules}>
            {filteredRules.map((rule) => (
              <div
                key={rule.id}
                className={classes.FilteredRule}
                onClick={() => setSelectedRule(rule.id)}
              >
                {rule.rule}
              </div>
            ))}
          </div>
        )}
      </div>
 
      <RulesTable
        rules={rules}
        onRuleClick={(id) => setSelectedRule(id)}
        selectedRule={selectedRule}
      />
      {openSuccessSnackBar && (
        <SnackBar
          message={"Rule is activated"}
          isOpen={true}
          handleCloseSnackBar={handleCloseSnackBar}
          color="green"
        />
      )}
      {openFailureSnackBar && (
        <SnackBar
          message={"Error adding rule"}
          isOpen={true}
          handleCloseSnackBar={handleCloseSnackBar}
          color="red"
        />
      )}
    </div>
  );
};

RulesDashboard.propTypes = {
  addRule: PropTypes.func,
};

const mapDispatchToProps = {
  addRule,
};

export default connect(null, mapDispatchToProps)(RulesDashboard);
