import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Stack,
  Chip,
  CircularProgress,
  Button,
  Divider,
} from "@mui/material";
import {
  Schedule,
  CalendarMonth,
  School,
  Groups,
  ArrowForward,
  Add as AddIcon,
  Timer,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const PlannerPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    
    // 1. Fetch Global Courses to map IDs to Names
    try {
      const coursesRes = await api.get("/courses"); 
      setAllCourses(coursesRes.data || []);
    } catch (err) {
      console.warn("Course lookup failed, showing IDs instead");
    }

    // 2. Fetch User's Groups and their respective Sessions
    try {
      const groupsRes = await api.get("/study-groups?type=my");
      const myGroups = groupsRes.data.data || [];

      const sessionPromises = myGroups.map((group) =>
        api.get(`/study-sessions/${group._id}`)
      );

      const allRes = await Promise.all(sessionPromises);
      const combined = allRes.flatMap((res) => res.data || []);
      
      // Sort: Soonest sessions first
      const sorted = combined.sort((a, b) => new Date(a.date) - new Date(b.date));
      setSessions(sorted);
    } catch (err) {
      console.error("Session fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Map user.enrolledCourses (IDs) to full Course Objects (Names/Codes)
  const mappedCourses = useMemo(() => {
    const userCourseIds = user?.enrolledCourses || [];
    return userCourseIds.map(courseRef => {
      if (typeof courseRef === 'object' && courseRef !== null) return courseRef;
      const match = allCourses.find(c => String(c._id) === String(courseRef));
      return match || { _id: courseRef, code: "Course", name: `ID: ...${String(courseRef).slice(-4)}` };
    });
  }, [user, allCourses]);

  // Calculate stats from the data we already have
  const totalStudyMins = useMemo(() => 
    sessions.reduce((acc, curr) => acc + (Number(curr.duration) || 0), 0), 
  [sessions]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress thickness={5} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", pb: 6 }}>
      <Typography variant="h4" fontWeight="900" sx={{ mb: 4, color: "text.primary" }}>
        Academic Planner
      </Typography>

      <Grid container spacing={4}>
        {/* LEFT: MAIN AGENDA */}
        <Grid item xs={12} lg={8.2}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 2, md: 4 }, 
              borderRadius: 4, 
              border: "1px solid", 
              borderColor: "divider",
              bgcolor: 'background.paper' 
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 4 }}>
              <CalendarMonth color="primary" fontSize="large" />
              <Typography variant="h5" fontWeight="800">Upcoming Agenda</Typography>
            </Stack>

            {sessions.length === 0 ? (
              <Box sx={{ py: 10, textAlign: "center", border: '2px dashed', borderColor: 'divider', borderRadius: 4 }}>
                <Typography color="text.secondary" variant="h6">No upcoming sessions</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Join a study group to see your schedule here.
                </Typography>
                <Button variant="contained" onClick={() => navigate("/study-groups")}>Find Groups</Button>
              </Box>
            ) : (
              <Stack spacing={2.5}>
                {sessions.map((session) => (
                  <Paper
                    key={session._id}
                    variant="outlined"
                    sx={{
                      p: 2.5,
                      borderRadius: 4,
                      transition: "0.3s",
                      border: '1px solid',
                      borderColor: 'divider',
                      "&:hover": { 
                        borderColor: "primary.main", 
                        bgcolor: "rgba(99, 102, 241, 0.02)",
                        transform: 'translateY(-2px)'
                      },
                    }}
                  >
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item xs={12} sm={2.5}>
                        <Box sx={{ textAlign: "center", bgcolor: "primary.main", color: "white", py: 1.5, borderRadius: 3 }}>
                          <Typography variant="caption" sx={{ fontWeight: "900", display: "block", textTransform: 'uppercase' }}>
                            {new Date(session.date).toLocaleString([], { month: "short" })}
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: "900" }}>
                            {new Date(session.date).getDate()}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6.5}>
                        <Typography variant="h6" fontWeight="800" sx={{ mb: 0.5 }}>
                          {session.topic}
                        </Typography>
                        <Stack direction="row" spacing={1.5} flexWrap="wrap">
                          <Chip icon={<Schedule sx={{ fontSize: 16 }} />} label={session.startTime} size="small" variant="outlined" />
                          <Chip icon={<Timer sx={{ fontSize: 16 }} />} label={`${session.duration}m`} size="small" variant="outlined" />
                          <Chip icon={<Groups sx={{ fontSize: 16 }} />} label="Group Study" size="small" color="primary" sx={{ fontWeight: 'bold' }} />
                        </Stack>
                      </Grid>

                      <Grid item xs={12} sm={3} sx={{ textAlign: { sm: "right" } }}>
                        <Button 
                          variant="outlined" 
                          endIcon={<ArrowForward />}
                          onClick={() => navigate(`/study-groups/${session.group}`)}
                          sx={{ borderRadius: 2, textTransform: "none", fontWeight: 'bold' }}
                        >
                          Details
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* RIGHT: SIDEBAR STATS & COURSES */}
        <Grid item xs={12} lg={3.8}>
          <Stack spacing={4}>
            {/* My Courses Section */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
              <Typography variant="h6" fontWeight="800" sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
                <School color="primary" /> My Courses
              </Typography>
              
              <Stack spacing={1.5}>
                {mappedCourses.length > 0 ? (
                  mappedCourses.map((course) => (
                    <Box 
                      key={course._id} 
                      onClick={() => navigate(`/courses/${course._id}`)}
                      sx={{ 
                        p: 2, 
                        bgcolor: "action.hover", 
                        borderRadius: 3,
                        cursor: 'pointer',
                        border: '1px solid transparent',
                        transition: '0.2s',
                        "&:hover": { borderColor: 'primary.main', bgcolor: 'primary.50' } 
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="900" color="primary">
                        {course.code}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight="500" noWrap>
                        {course.name}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                    Not enrolled in any courses yet.
                  </Typography>
                )}
                
                <Button 
                  fullWidth 
                  variant="text" 
                  startIcon={<AddIcon />}
                  onClick={() => navigate("/courses")}
                  sx={{ mt: 1, textTransform: 'none', fontWeight: 'bold' }}
                >
                  Browse Courses
                </Button>
              </Stack>
            </Paper>

            {/* Weekly Overview - Derived Data */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 4, 
                bgcolor: "grey.900", 
                color: "white" 
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>Weekly Stats</Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>Sessions Booked</Typography>
                  <Typography variant="body2" fontWeight="bold">{sessions.length}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>Total Minutes</Typography>
                  <Typography variant="body2" fontWeight="bold">{totalStudyMins} mins</Typography>
                </Box>
                <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                <Typography variant="caption" sx={{ opacity: 0.6, fontStyle: 'italic', textAlign: 'center', display: 'block' }}>
                  Keep up the great work, {user?.name?.split(' ')[0]}!
                </Typography>
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlannerPage;