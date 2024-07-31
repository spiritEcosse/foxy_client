import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { CurrencyContext } from "./CurrencyContext";
import { useContext } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { fetchData } from "../utils";

interface HeaderComponentProps {
  window?: () => Window;
}

export default function HeaderComponent(props: Readonly<HeaderComponentProps>) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navItems = [
    { id: 1, title: "About", link: "/page/about" },
    { id: 2, title: "Contact", link: "/page/contact" },
  ];
  const { setCurrency } = useContext(CurrencyContext);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        {import.meta.env.PROJECT_NAME}
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              sx={{ textAlign: "center" }}
              component={Link}
              to={item.link}
            >
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav" position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { sm: "block" } }}
            >
              {import.meta.env.PROJECT_NAME}
            </Typography>
          </Link>
          <Box sx={{ display: { xs: "none", sm: "flex", marginLeft: "auto" } }}>
            <Button variant="contained" onClick={() => setCurrency("USD")}>
              USD
            </Button>
            <Button variant="contained" onClick={() => setCurrency("EUR")}>
              EUR
            </Button>
            {navItems.map((item) => (
              <Button
                component={Link}
                key={item.id}
                sx={{ color: "#fff" }}
                to={item.link}
              >
                {item.title}
              </Button>
            ))}
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                if (credentialResponse.credential) {
                  fetchData("", "auth/google_login", "POST", {
                    credentials: credentialResponse.credential,
                  })
                    .then((data) => {
                      console.log(data);
                    })
                    .catch(({ code, message }) => {
                      console.log(code, message);
                    });

                  const decoded = jwtDecode(credentialResponse.credential);
                } else {
                }
              }}
              onError={() => {}}
            />
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}
