



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
  const [openSuccessSnackBar, setOpenSuccessSnackbar] = useState(false);
  const [openFailureSnackBar, setOpenFailureSnackBar] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedRule, setSelectedRule] = useState(null);
  const { user } = useContext(UserContext);
  const { spaceId } = useSpace();
  
  const fetchRules = async () => {
    if (!spaceId) return;
    try {
      const response = await axios.get(`${SERVER_URL}/api-rule/rules/${spaceId}`);
      setRules(response.data);
      toast.info("Rules fetched successfully!");
    } catch (error) {
      console.error("Failed to fetch rules:", error);
      toast.error("Failed to fetch rules.");
    }
  };

  useEffect(() => {
    fetchRules();
  }, [spaceId]);

  const onSearchInputChange = (event) => {
    setSearch(event.target.value);
  };

  const getFilteredRules = () => {
    if (!search) return rules;

    const searchTerms = search.toLowerCase().split(" ").filter(term => term);

    return rules.filter((rule) =>
      rule.rule && searchTerms.every(term => rule.rule.toLowerCase().includes(term))
    );
  };

  const handleCloseSnackBar = () => {
    setOpenSuccessSnackbar(false);
    setOpenFailureSnackBar(false);
  };

  const filteredRules = getFilteredRules();

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
        {search && filteredRules.length > 0 && (
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
        rules={filteredRules}
        onRuleClick={(id) => setSelectedRule(id)}
        selectedRule={selectedRule}
        fetchRules={fetchRules} // Pass the fetchRules function as a prop
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