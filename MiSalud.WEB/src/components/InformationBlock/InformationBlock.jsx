import Styles from "./InformationBlock.module.css";

export default function InformationBlock({title, text}){
    return(
        <div className={Styles["InformationBlock"]}>
            <div className={Styles["TextContainer"]}>
                <h2>{title}</h2>
                <p>{text.map(line =>{
                    return(
                        <span key={line}>
                            {line}
                            <br/>
                        </span>
                    )
            })}</p>
            </div>
        </div>
    )
}