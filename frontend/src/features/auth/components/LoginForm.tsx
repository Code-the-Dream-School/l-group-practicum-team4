import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/useAuth";
import styles from "./RegisterForm.module.css";

type FormState = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(form.email, form.password);
      navigate("/market");
    } catch (err: any) {
      console.log(err.message);
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome back!</h1>
        <p className={styles.subtitle}>Continue your adventure!</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            className={styles.input}
            name="email"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            className={styles.input}
            name="password"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />

          <button className={styles.button} type="submit">
            Login
          </button>

          <div className={styles.divider}>OR</div>

          <button type="button" className={styles.footerButton}>
            Don’t have an account? <span>Register</span>
          </button>
        </form>
      </div>
    </div>
  );
}