import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import Header from "./../../containers/Header/Header";
import SideDrawer from "../../containers/SideDrawer/SideDrawer";
import classes from "./Layout.module.scss";
import { closeErrorModal } from "./../../store/ui/ui.actions";
import Modal from "./../../components/UI/Modal/Modal";

const Layout = ({ children }) => {
  const error = useSelector(state => state.ui.error);
  const isSideDrawerOpen = useSelector(state => state.ui.openSideDrawer);
  const dispatch = useDispatch();

  const closeModalHandler = () => {
    dispatch(closeErrorModal());
  };

  return (
    <Fragment>
      <Header />
      <SideDrawer isOpen={isSideDrawerOpen} />
      <Modal
        data-test="errors-modal"
        show={!!error}
        onCloseModal={closeModalHandler}
      >
        {error && error.message}
      </Modal>
      <main className={classes.Main}>{children}</main>
    </Fragment>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
