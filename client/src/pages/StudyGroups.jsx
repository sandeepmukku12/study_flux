// import {
//   Box,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   CardActions,
//   Button,
//   Chip,
//   TextField,
//   Select,
//   MenuItem,
//   Stack,
// } from "@mui/material";
// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import api from "../api/axios";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const StudyGroupsPage = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [groups, setGroups] = useState([]);
//   const [page, setPage] = useState(1);
//   const [pagination, setPagination] = useState(null);

//   const [filters, setFilters] = useState({
//     search: "",
//     language: "",
//     skillLevel: "",
//     course: "",
//   });

//   const fetchGroups = async () => {
//     try {
//       const res = await api.get("/study-groups", {
//         params: {
//           ...filters,
//           page,
//           limit: 6,
//         },
//       });

//       setGroups(res.data.data);
//       setPagination(res.data.pagination);
//     } catch (err) {
//       toast.error(err.response?.data?.msg || "Failed to load study groups");
//     }
//   };

//   useEffect(() => {
//     fetchGroups();
//   }, [filters, page]);

//   // Navigate to details only if member
//   const handleShowStudyGroupDetails = (group) => {
//     const isMember = group.members.some((m) => m._id === user._id);
//     if (!isMember) {
//       toast.info("You are not a member of this group, join first");
//       return;
//     }
//     navigate(`/study-groups/${group._id}`);
//   };

//   // Join a group
//   const handleJoin = async (group) => {
//     const isMember = group.members.some((m) => m._id === user._id);
//     if (isMember) {
//       toast.info("You are already a member of this group");
//       return;
//     }

//     try {
//       await api.put(`/study-groups/${group._id}/join`);
//       toast.success("Joined study group");

//       // Optimistically update members array
//       setGroups((prev) =>
//         prev.map((g) =>
//           g._id === group._id
//             ? { ...g, members: [...g.members, { _id: user._id }] }
//             : g
//         )
//       );
//     } catch (err) {
//       toast.error(err.response?.data?.msg || "Join failed");
//     }
//   };

//   // Leave a group
//   const handleLeave = async (group) => {
//     const isMember = group.members.some((m) => m._id === user._id);
//     if (!isMember) {
//       toast.info("You are not a member of this group");
//       return;
//     }

//     try {
//       await api.put(`/study-groups/${group._id}/leave`);
//       toast.success("Left study group");

//       // Optimistically remove user from members
//       setGroups((prev) =>
//         prev.map((g) =>
//           g._id === group._id
//             ? { ...g, members: g.members.filter((m) => m._id !== user._id) }
//             : g
//         )
//       );
//     } catch (err) {
//       toast.error(err.response?.data?.msg || "Leave failed");
//     }
//   };

//   return (
//     <Box>
//       <Typography variant="h4" fontWeight="bold" mb={3}>
//         Study Groups
//       </Typography>

//       {/* Filters */}
//       <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={4}>
//         <TextField
//           label="Search"
//           value={filters.search}
//           onChange={(e) => setFilters({ ...filters, search: e.target.value })}
//           fullWidth
//         />

//         <Select
//           value={filters.language}
//           onChange={(e) => setFilters({ ...filters, language: e.target.value })}
//           displayEmpty
//           fullWidth
//         >
//           <MenuItem value="">All Languages</MenuItem>
//           <MenuItem value="English">English</MenuItem>
//           <MenuItem value="Hindi">Hindi</MenuItem>
//         </Select>

//         <Select
//           value={filters.skillLevel}
//           onChange={(e) =>
//             setFilters({ ...filters, skillLevel: e.target.value })
//           }
//           displayEmpty
//           fullWidth
//         >
//           <MenuItem value="">All Levels</MenuItem>
//           <MenuItem value="Beginner">Beginner</MenuItem>
//           <MenuItem value="Intermediate">Intermediate</MenuItem>
//           <MenuItem value="Advanced">Advanced</MenuItem>
//         </Select>
//       </Stack>

//       {/* Groups */}
//       {groups.length === 0 ? (
//         <Box
//           sx={{
//             width: "100%",
//             mt: 8,
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             opacity: 0.7,
//           }}
//         >
//           <Typography variant="h6" fontWeight="bold">
//             No study groups found
//           </Typography>
//           <Typography variant="body2" color="text.secondary" mt={1}>
//             Try adjusting your search or filters
//           </Typography>
//         </Box>
//       ) : (
//         <Grid container spacing={3}>
//           {groups.map((group) => (
//             <Grid item xs={12} sm={6} md={4} key={group._id}>
//               <Card
//                 onClick={() => handleShowStudyGroupDetails(group)}
//                 sx={{
//                   height: "100%",
//                   borderRadius: 3,
//                   cursor: "pointer",
//                   transition: "0.3s",
//                   "&:hover": {
//                     transform: "translateY(-6px)",
//                     boxShadow: 6,
//                   },
//                 }}
//               >
//                 <CardContent>
//                   <Typography variant="h6" fontWeight="bold">
//                     {group.name}
//                   </Typography>

//                   <Stack direction="row" spacing={1} mt={1} mb={2}>
//                     <Chip label={group.language} size="small" />
//                     <Chip label={group.skillLevel} size="small" />
//                   </Stack>

//                   <Typography variant="body2" color="text.secondary">
//                     Members: {group.members.length}
//                   </Typography>
//                 </CardContent>

//                 <CardActions>
//                   <Button
//                     fullWidth
//                     variant="contained"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleJoin(group);
//                     }}
//                   >
//                     Join
//                   </Button>

//                   <Button
//                     fullWidth
//                     variant="outlined"
//                     color="error"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleLeave(group);
//                     }}
//                   >
//                     Leave
//                   </Button>
//                 </CardActions>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       )}

//       {/* Pagination */}
//       {pagination && pagination.totalPages > 1 && (
//         <Stack direction="row" spacing={2} mt={4}>
//           <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
//             Prev
//           </Button>
//           <Typography mt={1}>
//             Page {pagination.page} of {pagination.totalPages}
//           </Typography>
//           <Button
//             disabled={page === pagination.totalPages}
//             onClick={() => setPage((p) => p + 1)}
//           >
//             Next
//           </Button>
//         </Stack>
//       )}
//     </Box>
//   );
// };

// export default StudyGroupsPage;

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  Select,
  MenuItem,
  Stack,
  Tabs,
  Tab,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const StudyGroupsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [myGroups, setMyGroups] = useState([]);
  const [discoverGroups, setDiscoverGroups] = useState([]);

  const [filters, setFilters] = useState({
    search: "",
    language: "",
    skillLevel: "",
  });

  const [tab, setTab] = useState(0);

  // Persist last selected tab
  useEffect(() => {
    const savedTab = localStorage.getItem("lastSelectedTab");
    if (savedTab !== null) setTab(Number(savedTab));
  }, []);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    localStorage.setItem("lastSelectedTab", newValue);
  };

  // Fetch my groups and discover groups once after login
  const fetchGroups = async () => {
    if (!user) return;

    try {
      const myGroupFilters = (tab === 0) ? filters : {};
      const discoverGroupFilters = (tab === 1) ? filters : {}; 
      const [myRes, discoverRes] = await Promise.all([
        api.get("/study-groups?type=my", { params: myGroupFilters }),
        api.get("/study-groups?type=discover", { params: discoverGroupFilters }),
      ]);

      setMyGroups(myRes.data.data || []);
      setDiscoverGroups(discoverRes.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to load study groups");
    }
  };

  useEffect(() => {
    if (!authLoading && user) fetchGroups();
  }, [authLoading, user, filters]);

  // Join/Leave handlers
  const handleJoin = async (group) => {
    try {
      await api.put(`/study-groups/${group._id}/join`);
      toast.success("Joined group");

      // Move group from discover → myGroups
      setDiscoverGroups((prev) => prev.filter((g) => g._id !== group._id));
      setMyGroups((prev) => [...prev, { ...group, members: [...group.members, { _id: user._id }] }]);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Join failed");
    }
  };

  const handleLeave = async (group) => {
    try {
      await api.put(`/study-groups/${group._id}/leave`);
      toast.success("Left group");

      // Move group from myGroups → discover
      setMyGroups((prev) => prev.filter((g) => g._id !== group._id));
      setDiscoverGroups((prev) => [...prev, { ...group, members: group.members.filter((m) => m._id !== user._id) }]);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Leave failed");
    }
  };

  // Filtered groups based on search input
  const filteredGroups =
    tab === 0
      ? myGroups.filter((g) =>
          g.name.toLowerCase().includes(filters.search.toLowerCase())
        )
      : discoverGroups.filter((g) =>
          g.name.toLowerCase().includes(filters.search.toLowerCase())
        );

  if (authLoading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Study Groups
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
        <TextField
          label="Search"
          fullWidth
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <Select
          value={filters.language}
          onChange={(e) => setFilters({ ...filters, language: e.target.value })}
          displayEmpty
          fullWidth
        >
          <MenuItem value="">All Languages</MenuItem>
          <MenuItem value="English">English</MenuItem>
          <MenuItem value="Hindi">Hindi</MenuItem>
        </Select>
        <Select
          value={filters.skillLevel}
          onChange={(e) => setFilters({ ...filters, skillLevel: e.target.value })}
          displayEmpty
          fullWidth
        >
          <MenuItem value="">All Levels</MenuItem>
          <MenuItem value="Beginner">Beginner</MenuItem>
          <MenuItem value="Intermediate">Intermediate</MenuItem>
          <MenuItem value="Advanced">Advanced</MenuItem>
        </Select>
      </Stack>

      <Tabs
        value={tab}
        onChange={handleTabChange}
        sx={{
          mb: 3,
          "& .MuiTab-root": { mx: 1, color: "#555" },
          "& .Mui-selected": { color: "#1976d2", fontWeight: "bold" },
          "& .MuiTabs-indicator": { backgroundColor: "#1976d2" },
        }}
      >
        <Tab label={`My Groups (${myGroups.length})`} />
        <Tab label={`Discover (${discoverGroups.length})`} />
      </Tabs>

      {filteredGroups.length === 0 ? (
        <Typography color="text.secondary">
          {tab === 0
            ? "You haven’t joined any study groups yet."
            : "No study groups available to join."}
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredGroups.map((group) => (
            <Grid item xs={12} sm={6} md={4} key={group._id}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  cursor: "pointer",
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-6px)", boxShadow: 6 },
                }}
                onClick={() => tab === 0 && navigate(`/study-groups/${group._id}`)}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {group.name}
                  </Typography>
                  <Stack direction="row" spacing={1} mt={1} mb={2}>
                    <Chip label={group.language} size="small" />
                    <Chip label={group.skillLevel} size="small" />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Members: {group.members.length}
                  </Typography>
                </CardContent>
                <CardActions onClick={(e) => e.stopPropagation()}>
                  {tab === 0 ? (
                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      onClick={() => handleLeave(group)}
                    >
                      Leave
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => handleJoin(group)}
                    >
                      Join
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default StudyGroupsPage;

