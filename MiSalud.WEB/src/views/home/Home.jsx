import WelcomeUser from "./components/WelcomeUser/WelcomeUser";
import SectionButton from "../../components/SectionButton/SectionButton";
import Styles from "./Home.module.css";
import { sectionButtonsByRole } from "../../data/rolesData.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const ROLE_PRIORITY = ["Administrador", "Secretaria", "Medico", "Paciente"];

function pickPrimaryRole(roles) {
  if (!roles || roles.length === 0) return "Paciente";
  for (const pr of ROLE_PRIORITY) {
    if (roles.includes(pr)) return pr;
  }
  return roles[0];
}

export default function Home() {
  const { roles, user } = useAuth();
  const navigate = useNavigate();

  const primaryRole = pickPrimaryRole(roles);
  const botones = sectionButtonsByRole[primaryRole] || [];

  const handleClick = (path) => navigate(path);

  return (
    <article className={Styles["home"]}>
      <WelcomeUser
        rol={primaryRole}
        nombre={
          user?.displayName ||
          user?.unique_name ||
          user?.email ||
          "Usuario"
        }
      />
      {botones.map((btn) => (
        <div key={btn.path} onClick={() => handleClick(btn.path)}>
          <SectionButton
            label={btn.label}
            image={btn.img}
          />
        </div>
      ))}
    </article>
  );
}