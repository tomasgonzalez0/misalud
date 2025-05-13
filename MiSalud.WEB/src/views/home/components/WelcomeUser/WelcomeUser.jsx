import UserAvatar from '../../../../assets/UserAvatar.png';
import Styles from './WelcomeUser.module.css';

export default function WelcomeUser({rol}){
    return(
        <section className={Styles["WelcomeUser"]}>
            <p className={Styles["WelcomeUserMessage"]}>👋🏻 Hola {rol}!</p>

            <div className={Styles["userAvatarContainer"]}>
                <img src={UserAvatar} alt="user avatar" />
            </div>
        </section>
    );
}