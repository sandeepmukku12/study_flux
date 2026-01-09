import { useEffect, useState } from "react";
import { Box, Typography, Grid, Button } from "@mui/material";
import api from "../api/axios";
import StudySessionCard from "./StudySessionCard";
import AddSessionDialog from "./AddSessionDialog";

const StudySessionList = ({ groupId }) => {
  const [sessions, setSessions] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchSessions = async () => {
    try {
      const res = await api.get(`/study-sessions/${groupId}`);
      setSessions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [groupId]);

  return (
    <Box mt={5}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Study Sessions
        </Typography>

        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Session
        </Button>
      </Box>

      {sessions.length === 0 ? (
        <Typography color="text.secondary">
          No study sessions scheduled yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {sessions.map((session) => (
            <Grid item xs={12} sm={6} md={4} key={session._id}>
              <StudySessionCard session={session} />
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
