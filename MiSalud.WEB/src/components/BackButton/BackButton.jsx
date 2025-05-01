import BackButtonImage from "../../assets/BackButton.png";
import Styles from './BackButton.module.css';

export default function BackButton(){
    return(
        <section className={Styles["WelcomeUser"]}>

            <div className={Styles["userAvatarContainer"]}>
                <img src={BackButtonImage} alt="user avatar" />
            </div>
        </section>
    );
}