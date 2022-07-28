import styles from "../../styles/Home.module.css"
import BlastSearch from "../../components/blastSearch";

export default function Blast() {

    return(
        <main>
            <h1 className={styles.title}>Blast</h1>
            <BlastSearch/>
        </main>
    );
}

