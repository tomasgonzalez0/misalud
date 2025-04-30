import Styles from "./FooterBar.module.css";
import HomeButton from "../../assets/HomeButton.png";
export default function FooterBar() {
    return(
        <section className={Styles["FooterBar"]}>
            <img src={HomeButton} alt="" />
        </section>
    );
}