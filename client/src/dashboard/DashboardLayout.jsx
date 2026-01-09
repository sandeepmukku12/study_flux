import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Button,
} from "@mui/material";
import { Menu, Group, Book, CalendarToday, Event } from "@mui/icons-material";
import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const drawerWidth = 240;

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ p: 2, height: "100%", bgcolor: "#1e1e2f", color: "#fff" }}>
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Avatar sx={{ mx: "auto", mb: 1, bgcolor: "#6a11cb" }}>
          {user?.name?.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="subtitle1">{user?.name}</Typography>
        <Typography variant="body2">{user?.email}</Typography>
      </Box>
      <List>
        <ListItem button component={Link} to="/study-groups">
          <ListItemIcon sx={{ color: "#fff" }}>
            <Group />
          </ListItemIcon>
          <ListItemText primary="Study Groups" />
        </ListItem>
        <ListItem button component={Link} to="/courses">
          <ListItemIcon sx={{ color: "#fff" }}>
            <Book />
          </ListItemIcon>
          <ListItemText primary="Courses" />
        </ListItem>
        <ListItem button component={Link} to="/planner">
          <ListItemIcon sx={{ color: "#fff" }}>
            <CalendarToday />
          </ListItemIcon>
          <ListItemText primary="Planner" />
        </ListItem>
        <ListItem button component={Link} to="/study-sessions">
          <ListItemIcon sx={{ color: "#fff" }}>
            <Event />
          </ListItemIcon>
          <ListItemText primary="Sessions" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            bgcolor: "#1e1e2f",
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#f4f5f7",
          p: 3,
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        {/* Topbar */}
        <AppBar
          position="static"
          color="transparent"
          elevation={0}
          sx={{ 
            bgcolor: "#fe2354",
            borderRadius: "8px",
            mb: 3 ,
            // ml: { sm: `${drawerWidth}px` },
        }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { sm: "none" } }}
            >
              <Menu />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Welcome, {user?.name}!
            </Typography>
            <Button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              sx={{
                background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
                color: "#fff",
                "&:hover": { opacity: 0.9 },
              }}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        {/* Render pages here */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
