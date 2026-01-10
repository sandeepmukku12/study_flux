// import { useEffect, useState } from "react";
// import { Box, Typography, Grid, Button } from "@mui/material";
// import api from "../api/axios";
// import StudySessionCard from "./StudySessionCard";
// import AddSessionDialog from "./AddSessionDialog";

// const StudySessionList = ({ groupId }) => {
//   const [sessions, setSessions] = useState([]);
//   const [open, setOpen] = useState(false);

//   const fetchSessions = async () => {
//     try {
//       const res = await api.get(`/study-sessions/${groupId}`);
//       setSessions(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchSessions();
//   }, [groupId]);

//   return (
//     <Box mt={5}>
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           mb: 2,
//         }}
//       >
//         <Typography variant="h5" fontWeight="bold">
//           Study Sessions
//         </Typography>

//         <Button variant="contained" onClick={() => setOpen(true)}>
//           Add Session
//         </Button>
//       </Box>

//       {sessions.length === 0 ? (
//         <Typography color="text.secondary">
//           No study sessions scheduled yet.
//         </Typography>
//       ) : (
//         <Grid container spacing={3}>
//           {sessions.map((session) => (
//             <Grid item xs={12} sm={6} md={4} key={session._id}>
//               <StudySessionCard session={session} />
//             </Grid>
//           ))}
//         </Grid>
//       )}

//       <AddSessionDialog
//         open={open}
//         onClose={() => setOpen(false)}
//         groupId={groupId}
//         onCreated={fetchSessions}
//       />
//     </Box>
//   );
// };

// export default StudySessionList;

import { useEffect, useState, useCallback } from "react";
import { Box, Typography, Grid, Button, Paper, CircularProgress } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import api from "../api/axios";
import StudySessionCard from "./StudySessionCard";
import AddSessionDialog from "./AddSessionDialog";
import { toast } from "react-toastify";

const StudySessionList = ({ groupId }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const fetchSessions = useCallback(async () => {
    if (!groupId) return;
    try {
      setLoading(true);
      const res = await api.get(`/study-sessions/${groupId}`);
      // Handle different possible API response structures
      const data = res.data?.data || res.data || [];
      setSessions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch sessions error:", err);
      toast.error("Failed to load study sessions");
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm("Are you sure you want to delete this session?")) return;
    try {
      await api.delete(`/study-sessions/${sessionId}`);
      setSessions(prev => prev.filter(s => s._id !== sessionId));
      toast.success("Session deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Could not delete session");
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" fontWeight="800" sx={{ color: 'text.primary' }}>
          Study Sessions
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{ borderRadius: 2, fontWeight: 'bold', textTransform: 'none', px: 3 }}
        >
          New Session
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress size={30} thickness={5} />
        </Box>
      ) : sessions.length === 0 ? (
        <Paper 
          variant="outlined"
          sx={{ 
            p: 6, 
            textAlign: "center", 
            borderRadius: 4, 
            bgcolor: "action.hover", 
            borderStyle: "dashed",
            borderColor: 'divider'
          }} 
        >
          <Typography color="text.secondary" variant="body1">
            No sessions scheduled yet. Be the first to start a session!
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {sessions.map((session) => (
            <Grid item xs={12} sm={6} key={session._id}>
              <StudySessionCard 
                session={session} 
                onDelete={() => handleDeleteSession(session._id)} 
              />
            </Grid>
          ))}
        </Grid>
      )}

      <AddSessionDialog
        open={open}
        onClose={() => setOpen(false)}
        groupId={groupId}
        onCreated={fetchSessions}
      />
    </Box>
  );
};

export default StudySessionList;