// import { Card, CardContent, Typography, Stack } from "@mui/material";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import EventIcon from "@mui/icons-material/Event";

// const StudySessionCard = ({ session }) => {
//   return (
//     <Card
//       sx={{
//         borderRadius: 2,
//         height: "100%",
//         transition: "0.3s",
//         "&:hover": {
//           boxShadow: 5,
//           transform: "translateY(-4px)",
//         },
//       }}
//     >
//       <CardContent>
//         <Typography variant="h6" fontWeight="bold" gutterBottom>
//           {session.topic}
//         </Typography>

//         <Stack spacing={1}>
//           <Stack direction="row" spacing={1} alignItems="center">
//             <EventIcon fontSize="small" />
//             <Typography variant="body2">
//               {new Date(session.date).toLocaleDateString()}
//             </Typography>
//           </Stack>

//           <Stack direction="row" spacing={1} alignItems="center">
//             <AccessTimeIcon fontSize="small" />
//             <Typography variant="body2">
//               {session.startTime} • {session.duration} mins
//             </Typography>
//           </Stack>
//         </Stack>
//       </CardContent>
//     </Card>
//   );
// };

// export default StudySessionCard;

import { Card, CardContent, Typography, IconButton, Box, Chip, Stack } from "@mui/material";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const StudySessionCard = ({ session, onDelete }) => {
  
  const formatDateTime = (dateVal, timeVal) => {
    if (!dateVal) return "Date not set";
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return "Invalid Date";

      const dateString = d.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });

      const timeString = timeVal ? ` at ${timeVal}` : "";
      return `${dateString}${timeString}`;
    } catch (e) {
      return "Error parsing date";
    }
  };

  return (
    <Card 
      elevation={0} 
      sx={{ 
        height: '100%',
        borderRadius: 4, 
        border: '1px solid', 
        borderColor: 'divider',
        position: 'relative', // Necessary for absolute positioning if needed
        transition: '0.2s',
        '&:hover': { 
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)', 
            borderColor: 'primary.main' 
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header Section with fixed button width */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          
          {/* Text Container: Takes remaining space but won't crush the button */}
          <Box sx={{ flex: 1, minWidth: 0, pr: 1 }}>
            <Typography 
              variant="h6" 
              fontWeight="bold" 
              sx={{ 
                lineHeight: 1.2, 
                mb: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {session.topic || "Untitled Session"}
            </Typography>
            
            <Stack spacing={0.5}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                <CalendarMonthIcon sx={{ fontSize: 16 }} />
                <Typography variant="caption" fontWeight="bold">
                  {formatDateTime(session.date, session.startTime)}
                </Typography>
              </Box>
            </Stack>
          </Box>
          
          {/* Action Button: flex-shrink-0 prevents crushing */}
          <IconButton 
            size="small" 
            color="error" 
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            sx={{ 
              flexShrink: 0, // CRITICAL FIX: Stops the button from being squashed
              ml: 1,
              p: 0.8, // Adjusting padding to make it perfectly circular
              bgcolor: 'rgba(211, 47, 47, 0.05)', 
              '&:hover': { 
                bgcolor: 'error.main', 
                color: 'white',
                boxShadow: '0 2px 8px rgba(211, 47, 47, 0.3)'
              } 
            }}
          >
            <DeleteOutlineIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip 
              label={`${session.duration || 0} mins`} 
              size="small" 
              sx={{ 
                fontWeight: '700', 
                borderRadius: 1.5, 
                bgcolor: '#eef2ff', 
                color: '#4f46e5',
                px: 0.5
              }} 
            />
            <Typography variant="caption" color="text.secondary" fontWeight="500">
              Study Session
            </Typography>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StudySessionCard;