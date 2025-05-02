import WelcomeUser from "./components/WelcomeUser/WelcomeUser";
import SectionButton from "../../components/SectionButton/SectionButton";
import Styles from "./Home.module.css";
import { sectionButtonsByRole } from "../../data/rolesData.js"; //Esto son nuestras constantes, los botones que tenemos
import { useNavigate } from "react-router-dom";


export default function Home() {
  const navigate = useNavigate();
  const botones = sectionButtonsByRole["administrador"] || [];

  const handleClick = (path) => {
    navigate(path);
  };

  return (
    <article className={Styles["home"]}>
      <WelcomeUser />
      {botones.map((btn, i) => (
        <div key={i} onClick={() => handleClick(btn.path)} >
          <SectionButton
            label={btn.label}
            image={btn.img}
          />
        </div>
      ))}
    </article>
  );
}