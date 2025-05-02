import BackButtonImage from "../../assets/BackButton.png";
import Styles from './BackButton.module.css';
import { useNavigate } from "react-router-dom";

export default function BackButton({route}){
    const navigate = useNavigate();
    return(
        <section className={Styles["WelcomeUser"]}>

            <div className={Styles["userAvatarContainer"]} onClick={() => navigate(route)}>
                <img src={BackButtonImage} alt="user avatar" />
                
            </div>
        </section>
    );
}