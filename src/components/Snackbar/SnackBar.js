import { Snackbar, IconButton } from "@mui/material";
import React, { useState } from "react";
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import ErrorIcon from "@mui/icons-material/Error";
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
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Center the Snackbar
        message={
          <SnackBarMessage
            text={message}
            icon={color === "red" ? "error" : "success"}
          />
        }
        ContentProps={{
          style: { backgroundColor: color, color: "#fff" }, // set the background and text color
        }}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
};
