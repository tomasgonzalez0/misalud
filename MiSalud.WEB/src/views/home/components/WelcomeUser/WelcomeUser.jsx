import UserAvatar from '../../../../assets/UserAvatar.png';
import Styles from './WelcomeUser.module.css';

export default function WelcomeUser(){
    return(
        <section className={Styles["WelcomeUser"]}>
            <p className={Styles["WelcomeUserMessage"]}>👋🏻 Hola Admin!</p>

            <div className={Styles["userAvatarContainer"]}>
                <img src={UserAvatar} alt="user avatar" />
            </div>
        </section>
    );
}