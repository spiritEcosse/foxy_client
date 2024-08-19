import React from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const InternalServerError = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh",
      }}
    >
      <h1>Internal Server Error</h1>
      <p>Sorry, something went wrong. Please try again later.</p>
      <Button variant="contained" component={Link} to="/">
        Continue Shopping
      </Button>
    </div>
  );
};

export default InternalServerError;
