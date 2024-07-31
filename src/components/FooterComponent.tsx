import * as React from "react";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { Box, Container, Divider, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";

export default function FooterComponent() {
  const socialMediaLinks = [
    { id: 1, url: "https://www.facebook.com", icon: <FacebookRoundedIcon /> },
    { id: 2, url: "https://www.pinterest.com", icon: <PinterestIcon /> },
    { id: 3, url: "https://www.twitter.com", icon: <TwitterIcon /> },
    { id: 4, url: "https://www.instagram.com", icon: <InstagramIcon /> },
    { id: 5, url: "https://www.linkedin.com", icon: <LinkedInIcon /> },
  ];

  return (
    <div className="Footer">
      <Box
        sx={{
          width: "100%",
          backgroundColor: "secondary.main",
          paddingTop: "1rem",
          paddingBottom: "1rem",
          color: "white",
        }}
      >
        <Container maxWidth="lg">
          <Grid container direction="column" alignItems="center">
            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {socialMediaLinks.map((link) => (
                  <React.Fragment key={link.id}>
                    <IconButton
                      color="inherit"
                      component="a"
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.icon}
                    </IconButton>
                    <Divider orientation="vertical" />
                  </React.Fragment>
                ))}
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                <Typography variant="subtitle1">
                  {`${new Date().getFullYear()} © ${import.meta.env.PROJECT_NAME}. All rights reserved.`}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  );
}
