import { Card, CardContent, Typography, Stack } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventIcon from "@mui/icons-material/Event";

const StudySessionCard = ({ session }) => {
  return (
    <Card
      sx={{
        borderRadius: 2,
        height: "100%",
        transition: "0.3s",
        "&:hover": {
          boxShadow: 5,
          transform: "translateY(-4px)",
        },
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {session.topic}
        </Typography>

        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <EventIcon fontSize="small" />
            <Typography variant="body2">
              {new Date(session.date).toLocaleDateString()}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <AccessTimeIcon fontSize="small" />
            <Typography variant="body2">
              {session.startTime} • {session.duration} mins
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default StudySessionCard;
