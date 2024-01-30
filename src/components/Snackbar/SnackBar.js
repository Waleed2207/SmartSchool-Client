import { Snackbar, IconButton } from "@material-ui/core";
import React, { useState } from "react";
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
} from "@material-ui/icons";
import ErrorIcon from "@material-ui/icons/Error";
// '#2fa324' green

const SnackBarMessage = ({ text, icon }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      {icon === "error" ? (
        <ErrorIcon style={{ marginRight: "8px" }} />
      ) : (
        <CheckCircleIcon style={{ marginRight: "8px" }} />
      )}
      {text}
    </div>
  );
};

export const SnackBar = ({
  isOpen,
  handleCloseSnackBar,
  color,
  message = "Device changed",
}) => {
  const [open, setOpen] = useState(isOpen);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    handleCloseSnackBar();
  };

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={
          <SnackBarMessage
            text={message}
            icon={color === "red" ? "error" : "success"}
          />
        }
        ContentProps={{
          style: { backgroundColor: color, color: "#fff" }, // set the background and text color
        }}
      />
    </>
  );
};
