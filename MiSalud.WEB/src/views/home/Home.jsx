import WelcomeUser from "./components/WelcomeUser/WelcomeUser";
import Section from "../../components/Section/Section";

export default function Home(){
    return(
        <article className="home">
            <WelcomeUser/>
            <Section id={1}/> {/*Remplazar id por dato del admin de la base de datos */}
        </article>
    );
}