import styles from "./RegisterPage.module.css"
import RegisterForm from "../components/RegisterForm";


const RegisterPage = () => {
  return (
    <div className={styles.page}>
      <RegisterForm/>   
    </div>
  );
};

export default RegisterPage