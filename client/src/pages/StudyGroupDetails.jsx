// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Box, CircularProgress, Typography } from "@mui/material";
// import api from "../api/axios";
// import GroupHeader from "../components/GroupHeader";
// import GroupMeta from "../components/GroupMeta";
// import StudySessionList from "../components/StudySessionList";
// import { useAuth } from "../context/AuthContext";

// const StudyGroupDetails = () => {
//   const { id } = useParams();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [group, setGroup] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const userId = user._id; // stored during login

//   const fetchGroup = async () => {
//     try {
//       const res = await api.get(`/study-groups/${id}`);
//       setGroup(res.data);

//       // Check membership
//       const isMember = res.data.members.some((m) => m._id === userId);
//       if (!isMember) {
//         toast.info("You must join this group to view details");
//         navigate("/study-groups");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to load group");
//       navigate("/study-groups");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user) fetchGroup();
//   }, [id, user]);

//   const handleJoin = async () => {
//     await api.put(`/study-groups/${id}/join`);
//     fetchGroup();
//   };

//   const handleLeave = async () => {
//     await api.put(`/study-groups/${id}/leave`);
//     navigate("/study-groups");
//   };

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           height: "70vh",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (!group) {
//     return <Typography>Group not found</Typography>;
//   }

//   const isMember = group.members.some((m) => m._id === userId);

//   return (
//     <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
//       <GroupHeader
//         group={group}
//         isMember={isMember}
//         onJoin={handleJoin}
//         onLeave={handleLeave}
//       />

//       <Box mt={4}>
//         <GroupMeta group={group} />
//         <StudySessionList groupId={group._id} />
//       </Box>
//     </Box>
//   );
// };

// export default StudyGroupDetails;

// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Box, CircularProgress, Typography } from "@mui/material";
// import { toast } from "react-toastify";
// import api from "../api/axios";
// import GroupHeader from "../components/GroupHeader";
// import GroupMeta from "../components/GroupMeta";
// import StudySessionList from "../components/StudySessionList";
// import { useAuth } from "../context/AuthContext";

// const StudyGroupDetails = () => {
//   const { id } = useParams();
//   const { user, loading: authLoading } = useAuth();
//   const navigate = useNavigate();

//   const [group, setGroup] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Fetch group
//   const fetchGroup = async () => {
//     if (!user) return;
//     setLoading(true);
//     try {
//       const res = await api.get(`/study-groups/${id}`);
//       setGroup(res.data);
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to load group");
//       navigate("/study-groups");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch on mount
//   useEffect(() => {
//     if (!authLoading && user) fetchGroup();
//   }, [id, user, authLoading]);

//   // Redirect non-members
//   useEffect(() => {
//     if (group && user?._id) {
//       const isMember = group.members?.some((m) => m._id === user._id);
//       if (!isMember) {
//         toast.info("You must join this group to view details");
//         navigate("/study-groups");
//       }
//     }
//   }, [group, user, navigate]);

//   // Join / Leave handlers
//   const handleLeave = async () => {
//     try {
//       await api.put(`/study-groups/${id}/leave`);
//       toast.success("You left the group");
//       navigate("/study-groups");
//     } catch (err) {
//       toast.error(err.response?.data?.msg || "Failed to leave group");
//     }
//   };

//   const handleJoin = async () => {
//     try {
//       await api.put(`/study-groups/${id}/join`);
//       toast.success("Joined the group");
//       fetchGroup();
//     } catch (err) {
//       toast.error(err.response?.data?.msg || "Failed to join group");
//     }
//   };

//   // Loading states
//   if (authLoading || loading) {
//     return (
//       <Box
//         sx={{
//           height: "70vh",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (!group) return <Typography>Group not found</Typography>;

//   // Safe member check
//   const isMember = group.members?.some((m) => m._id === user._id);

//   return (
//     <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
//       <GroupHeader
//         group={group}
//         isMember={isMember}
//         onJoin={handleJoin}
//         onLeave={handleLeave}
//       />

//       <Box mt={4}>
//         <GroupMeta group={group} />
//         <StudySessionList groupId={group._id} />
//       </Box>
//     </Box>
//   );
// };

// export default StudyGroupDetails;

import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  Avatar,
  Paper,
  Stack,
  Divider,
  Chip,
} from "@mui/material";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import api from "../api/axios";
import GroupHeader from "../components/GroupHeader";
import GroupMeta from "../components/GroupMeta";
import StudySessionList from "../components/StudySessionList";
import { useAuth } from "../context/AuthContext";

const StudyGroupDetails = () => {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch group data
  const fetchGroup = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get(`/study-groups/${id}`);
      setGroup(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load group");
      navigate("/study-groups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) fetchGroup();
  }, [id, user, authLoading]);

  // Memoize member check for performance and consistency
  const isMember = useMemo(() => {
    return group?.members?.some((m) => String(m._id) === String(user?._id));
  }, [group, user]);

  // Redirect logic
  useEffect(() => {
    if (group && user?._id && !isMember) {
      toast.info("You must join this group to view details");
      navigate("/study-groups");
    }
  }, [group, user, navigate, isMember]);

  const handleLeave = async () => {
    try {
      await api.put(`/study-groups/${id}/leave`);
      toast.success("You left the group");
      navigate("/study-groups");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to leave group");
    }
  };

  const handleJoin = async () => {
    try {
      await api.put(`/study-groups/${id}/join`);
      toast.success("Joined the group");
      fetchGroup();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to join group");
    }
  };

  if (authLoading || loading) {
    return (
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!group) return <Typography sx={{ p: 4 }}>Group not found</Typography>;

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        py: 4,
        px: { xs: 2, md: 6 },
      }}
    >
      {/* Back Navigation */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/study-groups")}
        sx={{
          mb: 3,
          fontWeight: "bold",
          color: "text.secondary",
          textTransform: "none",
        }}
      >
        Back to Study Groups
      </Button>

      {/* Hero Header Card */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          mb: 5,
        }}
      >
        <GroupHeader
          group={group}
          isMember={isMember}
          onJoin={handleJoin}
          onLeave={handleLeave}
        />
      </Paper>

      {/* Main Body Layout */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: 5,
          alignItems: "flex-start",
        }}
      >
        {/* Left Section: Overview and Sessions */}
        <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>
          <Stack spacing={{ xs: 6, md: 10 }}>
            {" "}
            {/* This ensures deep gaps between sections */}
            {/* Overview Section */}
            <Box>
              <Typography variant="h5" fontWeight="800" sx={{ mb: 3 }}>
                Group Overview
              </Typography>
              <GroupMeta group={group} />
            </Box>
            <Divider sx={{ opacity: 0.6 }} />
            {/* Sessions Section */}
            <Box>
              <Typography variant="h5" fontWeight="800" sx={{ mb: 3 }}>
                Upcoming Sessions
              </Typography>
              <StudySessionList groupId={group._id} />
            </Box>
          </Stack>
        </Box>

        {/* Right Section: Members Sidebar */}
        <Paper
          elevation={0}
          sx={{
            width: { xs: "80%", lg: 320 },
            p: 3,
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            position: { lg: "sticky" },
            top: 24,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <PersonIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Members ({group.members?.length || 0})
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Stack spacing={1}>
            {group.members?.map((member) => (
              <Box
                key={member._id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 1.2,
                  borderRadius: 3,
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    width: 36,
                    height: 36,
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                  }}
                >
                  {member.name?.charAt(0).toUpperCase()}
                </Avatar>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight="bold" noWrap>
                    {member.name}
                  </Typography>
                  {String(member._id) === String(user?._id) && (
                    <Typography
                      variant="caption"
                      color="primary"
                      fontWeight="bold"
                    >
                      (You)
                    </Typography>
                  )}
                </Box>

                {/* Badge for Group Host/Creator */}
                {String(group.creator) === String(member._id) && (
                  <Chip
                    label="Host"
                    size="small"
                    variant="outlined"
                    sx={{ height: 20, fontSize: "0.65rem", fontWeight: "bold" }}
                  />
                )}
              </Box>
            ))}
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default StudyGroupDetails;
