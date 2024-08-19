import React from "react";
import { Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

export default function NotFound() {
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
      <Container maxWidth="md">
        <Grid container spacing={2}>
          <Grid xs={6} item={true}>
            <Typography variant="h1">404</Typography>
            <Typography variant="h6">
              The page you’re looking for does’t exist.
            </Typography>
            <Button variant="contained" component={Link} to="/">
              Continue Shopping
            </Button>
          </Grid>
          <Grid xs={6} item={true}>
            <img
              src="https://cdn.pixabay.com/photo/2017/03/09/12/31/error-2129569__340.jpg"
              alt=""
              width={500}
              height={250}
            />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
