import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/useAuth";
import styles from "./RegisterForm.module.css";

type FormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const {register} = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
    await register(form.name, form.email, form.password);
    navigate("/login"); 
  } catch (err: any) {
    console.log(err.message);
  }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Start your adventure today!</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            className={styles.input}
            name="name"
            placeholder="Username"
            value={form.name}
            onChange={handleChange}
          />

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

          <input
            className={styles.input}
            name="confirmPassword"
            placeholder="Confirm Password"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          <button className={styles.button} type="submit">
            Register
          </button>
          <div className={styles.divider}>OR</div>

				<button type="button" className={styles.footerButton} onClick = {()=> navigate("/login")}>
					Already have an account? <span>Log In</span>
				</button>
        </form>
      
      </div>
    </div>
  );
}