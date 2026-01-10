// import { Box, Button, Typography } from "@mui/material";

// const GroupHeader = ({ group, isMember, onJoin, onLeave }) => {
//   return (
//     <Box
//       sx={{
//         p: 3,
//         borderRadius: 3,
//         background: "linear-gradient(135deg, #6a11cb, #2575fc)",
//         color: "#fff",
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         flexWrap: "wrap",
//         gap: 2,
//       }}
//     >
//       <Box>
//         <Typography variant="h4" fontWeight="bold">
//           {group.name}
//         </Typography>
//         <Typography variant="body2" sx={{ opacity: 0.9 }}>
//           {group.course?.name}
//         </Typography>
//       </Box>

//       {isMember ? (
//         <Button
//           variant="outlined"
//           onClick={onLeave}
//           sx={{ color: "#fff", borderColor: "#fff" }}
//         >
//           Leave Group
//         </Button>
//       ) : (
//         <Button
//           variant="contained"
//           onClick={onJoin}
//           sx={{
//             bgcolor: "#fff",
//             color: "#2575fc",
//             fontWeight: "bold",
//           }}
//         >
//           Join Group
//         </Button>
//       )}
//     </Box>
//   );
// };

// export default GroupHeader;

import { Box, Button, Typography, Stack } from "@mui/material";

const GroupHeader = ({ group, isMember, onJoin, onLeave }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 3,
        width: "100%"
      }}
    >
      <Box>
        <Typography variant="h3" fontWeight="800" sx={{ mb: 1, fontSize: { xs: '2rem', md: '2.5rem' } }}>
          {group.name}
        </Typography>
        <Typography variant="h6" color="text.secondary" fontWeight="500">
          {group.course?.name || "General Study Group"}
        </Typography>
      </Box>

      <Stack direction="row" spacing={2}>
        {isMember ? (
          <Button
            variant="outlined"
            color="error"
            size="large"
            onClick={onLeave}
            sx={{ borderRadius: 3, fontWeight: "bold", borderWidth: 2, "&:hover": { borderWidth: 2 } }}
          >
            Leave Group
          </Button>
        ) : (
          <Button
            variant="contained"
            size="large"
            onClick={onJoin}
            sx={{ borderRadius: 3, fontWeight: "bold", px: 4 }}
          >
            Join Group
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default GroupHeader;