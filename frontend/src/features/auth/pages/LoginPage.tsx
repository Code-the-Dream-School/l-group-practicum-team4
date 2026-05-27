import styles from "./RegisterPage.module.css"
import LoginForm from "../components/LoginForm";


const LoginPage = () => {
  return (
    <div className={styles.page}>
      <LoginForm/>   
    </div>
  );
};

export default LoginPage