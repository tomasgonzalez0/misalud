import Input from "../../components/Input/Input";
import BackButton from "../../components/BackButton/BackButton";
import MiSalud from "../../assets/MiSalud.png";
import { useState, useEffect } from "react";
import Styles from "./Login.module.css";
import { useAuth } from "../../context/authContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  return (
    <main className={Styles.page}>
      <BackButton route="/" />
      <LoginContent />
    </main>
  );
}

function LoginContent() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/agenda";

  const [emailOrUser, setEmailOrUser] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    emailOrUser: "",
    password: ""
  });
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  function validarEmailOrUser(value) {
    if (!value.trim()) return "Requerido";
    if (value.includes("@")) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Email inválido";
    }
    return "";
  }

  function validarPassword(value) {
    if (!value.trim()) return "Requerida";
    return "";
  }

  function handleUserChange(e) {
    const value = e.target.value;
    setEmailOrUser(value);
    setErrors(prev => ({ ...prev, emailOrUser: validarEmailOrUser(value) }));
  }

  function handlePasswordChange(e) {
    const value = e.target.value;
    setPassword(value);
    setErrors(prev => ({ ...prev, password: validarPassword(value) }));
  }

  const formValid =
    emailOrUser &&
    password &&
    !errors.emailOrUser &&
    !errors.password;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formValid || submitting) return;
    setServerError("");
    setSubmitting(true);
    try {
      await login(emailOrUser.trim(), password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setServerError(err.message || "Error al iniciar sesión");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className={Styles.card} aria-labelledby="login-title">
      <img src={MiSalud} alt="MiSalud" className={Styles.logo} draggable="false" />

      {serverError && (
        <div className={Styles.serverError} role="alert">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className={Styles.form} noValidate>
        <div className={Styles.fieldGroup}>
          <Input
            id="emailOrUser"
            placeholder="Email"
            value={emailOrUser}
            onChange={handleUserChange}
            type="text"
            errorMessage={errors.emailOrUser}
            className={Styles.loginInput}
          />
        </div>

        <div className={Styles.fieldGroup}>
            <Input
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordChange}
              type="password"
              errorMessage={errors.password}
              autoComplete="current-password"
              className={Styles.loginInput}
            />
        </div>

        <div className={Styles.metaRow}>
          <span className={Styles.forgotPassword}>¿Olvidaste tu contraseña?</span>
        </div>

        <button
          type="submit"
          disabled={!formValid || submitting}
          className={`${Styles.submitButton} ${submitting ? Styles.loading : ""}`}
        >
          {submitting ? "Ingresando..." : "Iniciar sesión"}
        </button>

        <p className={Styles.registerHint}>
          ¿No tienes una cuenta?{" "}
          <span tabIndex={0} role="button">Crear cuenta</span>
        </p>
      </form>
    </section>
  );
}   