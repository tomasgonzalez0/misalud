import WelcomeUser from "./components/WelcomeUser/WelcomeUser";
import SectionButton from "../../components/SectionButton/SectionButton";
import Styles from "./Home.module.css";
import { sectionButtonsByRole } from "../../data/rolesData.js"; //Esto son nuestras constantes, los botones que tenemos

export default function Home() {
  const botones = sectionButtonsByRole["administrador"] || []; 
  //Le enviamos un rol a nuestro arreglo de botones, y nos devuelve el arreglo de administrador
  //Despues lo haremos con la API, para que el rol se lo pase desde la API

  return (
    <article className={Styles["home"]}>
      <WelcomeUser />
      {botones.map((btn, i) => (
        <SectionButton
            key={i}
            label={btn.label}
            image={btn.img}
            />
      ))}  
    </article>
  );
}
    