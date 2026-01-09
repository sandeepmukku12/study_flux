import { useState, useEffect } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import api from "../api/axios";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setFormData({ name: user.name, email: user.email });
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (formData.newPassword && formData.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters ❌");
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name,
      };

      // Only send password fields if user wants to change password
      if (formData.currentPassword && formData.newPassword) {
        payload.currentPassword = formData.currentPassword;
        payload.newPassword = formData.newPassword;
      }

      const res = await api.put("/users/me", payload);

      updateUser(res.data); // merge safely
      toast.success("Profile updated successfully ✅");

      // Clear password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto" }}>
      <Typography variant="h5" mb={3}>
        Update Profile
      </Typography>
      <TextField
        fullWidth
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <Typography variant="caption" color="text.secondary">
        Leave password fields empty if you don't want to change it
      </Typography>
      <TextField
        fullWidth
        type="password"
        label="Current Password"
        name="currentPassword"
        value={formData.currentPassword || ""}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        type="password"
        label="New Password"
        name="newPassword"
        value={formData.newPassword || ""}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={loading}
        sx={{ background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)" }}
      >
        {loading ? "Updating..." : "Update Profile"}
      </Button>
    </Box>
  );
};

export default ProfilePage;
