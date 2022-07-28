import Image from "next/image";
import styles from "../styles/Home.module.css";


export default function Searching(props){
    return(
        <div className={styles.searchingPage}>
            <div className={styles.searching}>
                <p>BLASTing...</p>
            </div>
            <p id={styles.searchingSubMessage}>&#40;this might take a second&#41;</p>
        </div>
    );
}