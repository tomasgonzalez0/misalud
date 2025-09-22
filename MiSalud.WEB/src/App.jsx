import "./styles/DefaultStyles.css";
import Home from "./views/home/Home";
import Administracion from "./views/administracion/Administracion";
import FooterBar from "./components/FooterBar/FooterBar";
import FormView from "./views/PacientForm/Form";
import Agenda from "./views/Agenda/Agenda";
import Login from "./views/login/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/authContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout />
      </Router>
    </AuthProvider>
  );
}

function Layout() {
  const { isAuthenticated } = useAuth();
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={
          <ProtectedRoute><Home /></ProtectedRoute>
        } />
        <Route path="/agenda" element={
          <ProtectedRoute><Agenda /></ProtectedRoute>
        } />
        <Route path="/administracion" element={
          <ProtectedRoute><Administracion /></ProtectedRoute>
        } />
        <Route path="/formulario/add" element={
          <ProtectedRoute><FormView type="añadir" /></ProtectedRoute>
        } />
        <Route path="/formulario/edit/:registroId" element={
          <ProtectedRoute><FormView type="editar" /></ProtectedRoute>
        } />
        <Route path="*" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      </Routes>

      {isAuthenticated && <FooterBar />}
    </>
  );
}

export default App;