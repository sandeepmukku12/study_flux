import { Button, Stack, TextField } from "@mui/material";
import AuthCard from "../components/AuthCard";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await signup(form.name, form.email, form.password);
      toast.success("🎉 Account created!");
      navigate("/study-groups");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <AuthCard title="Signup">
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <Button type="submit" variant="contained" size="large">
            Signup
          </Button>
          <Button component={Link} to="/login">
            Already have an account? Login
          </Button>
        </Stack>
      </form>
    </AuthCard>
  );
};

export default Signup;
