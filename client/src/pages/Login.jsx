import { Button, Stack, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
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
      await login(form.email, form.password);
      toast.success("✅ Login successful!");
      navigate("/study-groups");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Login failed");
    }
  };

  return (
    <AuthCard title="Login">
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
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
            Login
          </Button>
          <Button component={Link} to="/signup">
            Don't have an account? Signup
          </Button>
        </Stack>
      </form>
    </AuthCard>
  );
};

export default Login;
