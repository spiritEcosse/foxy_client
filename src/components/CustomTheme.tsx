import { createTheme } from "@mui/material/styles";
import { styled } from "@mui/material";
import { Link } from "react-router-dom";

export const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: "none", // Optional: removes underline from links
  "&:hover": {
    textDecoration: "underline", // Optional: adds underline on hover
  },
}));

const CustomTheme = createTheme({
  palette: {
    primary: {
      main: "#78C59B",
      contrastText: "#fff",
    },
    secondary: {
      main: "#00617A",
      contrastText: "#fff",
    },
  },
});
CustomTheme.typography.h1 = {
  fontSize: "1rem",
  "@media (min-width:600px)": {
    fontSize: "1.5rem",
  },
  [CustomTheme.breakpoints.up("md")]: {
    fontSize: "2.4rem",
  },
};

export default CustomTheme;
