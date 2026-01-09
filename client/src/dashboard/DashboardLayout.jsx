// import {
//   Box,
//   Drawer,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Typography,
//   AppBar,
//   Toolbar,
//   IconButton,
//   Avatar,
//   Button,
// } from "@mui/material";
// import { Menu, Group, Book, CalendarToday, Event } from "@mui/icons-material";
// import { useState } from "react";
// import { Link, Outlet, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { toast } from "react-toastify";

// const drawerWidth = 240;

// const DashboardLayout = () => {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   const drawer = (
//     <Box sx={{ p: 2, height: "100%", bgcolor: "#1e1e2f", color: "#fff" }}>
//       <Box sx={{ mb: 4, textAlign: "center" }}>
//         <Avatar sx={{ mx: "auto", mb: 1, bgcolor: "#6a11cb" }}>
//           {user?.name?.charAt(0).toUpperCase()}
//         </Avatar>
//         <Typography variant="subtitle1">{user?.name}</Typography>
//         <Typography variant="body2">{user?.email}</Typography>
//       </Box>
//       <List>
//         <ListItem button component={Link} to="/study-groups">
//           <ListItemIcon sx={{ color: "#fff" }}>
//             <Group />
//           </ListItemIcon>
//           <ListItemText primary="Study Groups" />
//         </ListItem>
//         <ListItem button component={Link} to="/courses">
//           <ListItemIcon sx={{ color: "#fff" }}>
//             <Book />
//           </ListItemIcon>
//           <ListItemText primary="Courses" />
//         </ListItem>
//         <ListItem button component={Link} to="/planner">
//           <ListItemIcon sx={{ color: "#fff" }}>
//             <CalendarToday />
//           </ListItemIcon>
//           <ListItemText primary="Planner" />
//         </ListItem>
//         <ListItem button component={Link} to="/study-sessions">
//           <ListItemIcon sx={{ color: "#fff" }}>
//             <Event />
//           </ListItemIcon>
//           <ListItemText primary="Sessions" />
//         </ListItem>
//       </List>
//     </Box>
//   );

//   return (
//     <Box sx={{ display: "flex", minHeight: "100vh" }}>
//       {/* Sidebar */}
//       <Drawer
//         variant="temporary"
//         open={mobileOpen}
//         onClose={handleDrawerToggle}
//         ModalProps={{ keepMounted: true }}
//         sx={{
//           display: { xs: "block", sm: "none" },
//           "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
//         }}
//       >
//         {drawer}
//       </Drawer>
//       <Drawer
//         variant="permanent"
//         sx={{
//           display: { xs: "none", sm: "block" },
//           "& .MuiDrawer-paper": {
//             boxSizing: "border-box",
//             width: drawerWidth,
//             bgcolor: "#1e1e2f",
//           },
//         }}
//         open
//       >
//         {drawer}
//       </Drawer>

//       {/* Main Content */}
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           bgcolor: "#f4f5f7",
//           p: 3,
//           ml: { sm: `${drawerWidth}px` },
//         }}
//       >
//         {/* Topbar */}
//         <AppBar
//           position="static"
//           color="transparent"
//           elevation={0}
//           sx={{
//             bgcolor: "#fe2354",
//             borderRadius: "8px",
//             mb: 3,
//             // ml: { sm: `${drawerWidth}px` },
//           }}
//         >
//           <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
//             <IconButton
//               color="inherit"
//               edge="start"
//               onClick={handleDrawerToggle}
//               sx={{ display: { sm: "none" } }}
//             >
//               <Menu />
//             </IconButton>
//             <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//               Welcome, {user?.name}!
//             </Typography>
//             <Button
//               onClick={() => {
//                 logout();
//                 toast.success("Logged out successfully ✅");
//                 navigate("/login");
//               }}
//               sx={{
//                 background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
//                 color: "#fff",
//                 "&:hover": { opacity: 0.9 },
//               }}
//             >
//               Logout
//             </Button>
//           </Toolbar>
//         </AppBar>

//         {/* Render pages here */}
//         <Outlet />
//       </Box>
//     </Box>
//   );
// };

// export default DashboardLayout;


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
import { Menu, Group, Book, CalendarToday, Event, AccountCircle } from "@mui/icons-material";
import { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const drawerWidth = 240;

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully ✅", { position: "top-right" });
    navigate("/login");
  };

  const drawer = (
    <Box
      sx={{
        height: "100%",
        bgcolor: "#1e1e2f",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 2,
      }}
    >
      <Box>
        {/* User Info */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Avatar sx={{ mx: "auto", mb: 1, bgcolor: "#6a11cb" }}>
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="subtitle1">{user?.name}</Typography>
          <Typography variant="body2">{user?.email}</Typography>
        </Box>

        {/* Navigation Links */}
        <List>
          {[
            { text: "Study Groups", icon: <Group />, path: "/study-groups" },
            { text: "Courses", icon: <Book />, path: "/courses" },
            { text: "Planner", icon: <CalendarToday />, path: "/planner" },
            { text: "Sessions", icon: <Event />, path: "/study-sessions" }, { text: "Profile", icon: <AccountCircle />, path: "/profile" },
          ].map((item) => (
            <ListItem
              key={item.text}
              button
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                mb: 1,
                borderRadius: 1,
                "&.Mui-selected": { bgcolor: "rgba(106,17,203,0.3)" },
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
              }}
            >
              <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Logout Button */}
      <Box sx={{ textAlign: "center" }}>
        <Button
          onClick={handleLogout}
          sx={{
            width: "100%",
            mt: 2,
            background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
            color: "#fff",
            "&:hover": { opacity: 0.9 },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <ToastContainer />

      {/* Mobile Drawer */}
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

      {/* Permanent Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            bgcolor: "#1e1e2f",
            position: "fixed", // FIX: keeps drawer fixed
            top: 0,
            height: "100vh",
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
          ml: { sm: `${drawerWidth}px` }, // leave space for drawer
          height: "100vh",
          overflowY: "auto", // FIX: make content scrollable
        }}
      >
        {/* Topbar */}
        <AppBar
          position="sticky"
          color="transparent"
          elevation={3}
          sx={{
            bgcolor: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
            borderRadius: "8px",
            mb: 3,
            p: 1,
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { sm: "none" }, color: "#fff" }}
            >
              <Menu />
            </IconButton>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#000" }}
            >
              Welcome, {user?.name}!
            </Typography>
            <Button
              onClick={handleLogout}
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

        {/* Page Content */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;

