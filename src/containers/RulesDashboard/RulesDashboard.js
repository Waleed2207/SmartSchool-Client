import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addRule } from "./../../store/rules/rules.actions";
import RulesModal from "./../../components/RulesModal/RulesModal";
import axios from "axios";
import RulesTable from "./../../components/RulesTable/RulesTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import classes from "./RulesDashboard.module.scss";
import { SnackBar } from "../../components/Snackbar/SnackBar";
import styled from "styled-components";
import UserContext from "../../contexts/UserContext";
import { SERVER_URL } from "../../consts";
import { SearchRuleInput } from "../../components/RulesTable/rules.styles";
import { toast } from "react-toastify";
import AddRuleComponent from '../../components/AddRuleComponent/AddRuleComponent';
import AddDetectionRuleComponent from '../../components/AddDetectionRuleComponent/AddDetectionRuleComponent';

const ErrorMessage = styled.p`
  color: red;
`;

const RulesDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [displayIntro, setDisplayIntro] = useState(true);
  const [rules, setRules] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredRules, setFilteredRules] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [isAddingDetectionRule, setIsAddingDetectionRule] = useState(false); // New state to toggle between rule forms

  const { user } = useContext(UserContext);
  const userRole = user?.role || "User";

  const fetchRules = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/api-rule/rules`);
      toast.info("Rules fetched successfully!");
      return response.data;
    } catch (error) {
      toast.error("Failed to fetch rules.");
      return [];
    }
  };

  useEffect(() => {
    const fetchAllRules = async () => {
      const fetchedRules = await fetchRules();
      setRules(fetchedRules);
    };
    fetchAllRules();
  }, []);

  const onSearchInputChange = (event) => {
    const value = event.target.value;
    setSearch(value);
    if (value) {
      const filtered = rules.filter((rule) =>
        rule.rule.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredRules(filtered);
    } else {
      setFilteredRules([]);
    }
  };

  const handleRuleFormToggle = () => {
    setIsAddingDetectionRule(!isAddingDetectionRule);
  };

  return (
    <div className={classes.RulesDashboard}>
      {!displayIntro && (
        <button onClick={() => {setDisplayIntro(true); setShowTable(false);}} className={classes.BackButton}>
          <FontAwesomeIcon icon={faChevronLeft} /> <span>Back</span>
        </button>
      )}

      {displayIntro ? (
        <div className={classes.IntroContainer}>
          <h3>Welcome to the Rules Dashboard</h3>
          <p>Would you like to:</p>
          <button className={classes.RulesDashboardButton} onClick={() => setShowTable(true)}>Show Rules</button>
          <button className={classes.RulesDashboardButton} onClick={() => setDisplayIntro(false)}>Add Rule</button>
        </div>
      ) : showTable ? (
        <>
          <div className={classes.SearchContainer}>
            <SearchRuleInput type="text" value={search} onChange={onSearchInputChange} placeholder="Search for a rule..." />
            <FontAwesomeIcon icon={faSearch} className={classes.SearchIcon} />
          </div>
          <RulesTable rules={rules} searchText={search} userRole={userRole} />
        </>
      ) : (
        <>
          <h3>Add Rule</h3>
          <button onClick={handleRuleFormToggle} className={classes.ToggleFormButton}>
            {isAddingDetectionRule ? "Switch to AC Rule" : "Switch to Detection Rule"}
          </button>
          {isAddingDetectionRule ? <AddDetectionRuleComponent /> : <AddRuleComponent />}
        </>
      )}
    </div>
  );
};

RulesDashboard.propTypes = {
  addRule: PropTypes.func.isRequired,
};

export default connect(null, { addRule })(RulesDashboard);
