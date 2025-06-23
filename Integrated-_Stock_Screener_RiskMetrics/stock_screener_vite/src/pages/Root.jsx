import * as React from "react";
import { Link, Outlet } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CustomBasketMenu from "@/components/pages/AppBar/CustomBasketMenu";

export default function Root() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "rgb(55 65 81)" }}>
        <Toolbar variant="dense" sx={{ minHeight: 50, height: 50 }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/">Stock Screener</Link>
          </Typography>
          <CustomBasketMenu />
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
}
