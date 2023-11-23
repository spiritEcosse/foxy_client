import {createTheme} from "@mui/material/styles";

const CustomTheme = createTheme({
    palette: {
        primary: {
            main: "#78C59B",
            contrastText: "#fff"
        },
        secondary: {
            main: "#00617A",
            contrastText: "#fff"
        },
    },
});
export default CustomTheme;
