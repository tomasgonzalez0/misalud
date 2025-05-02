
import Styles from "./SectionButton.module.css";

export default function SectionButton({ label, image, subtitle }) {
  return (
    <section className={Styles["SectionButton"]}>
      <div className={Styles["SectionButtonContainer"]}>
        <h2 className={Styles["SectionButtonName"]}>{label}</h2>
        {subtitle && <p className={Styles["SectionButtonSubtitle"]}>{subtitle}</p>}
        <img src={image} alt={label} />
      </div>
    </section>
  );
}
