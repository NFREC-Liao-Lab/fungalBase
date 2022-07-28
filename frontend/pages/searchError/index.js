import Link from "next/link";
import styles from "../../styles/Home.module.css";

export default function searchError(){
    return(
        <div>
            <h1 className={styles.title}>There was an error in your search :{'('}</h1>
            <div className={styles.searchErrorListWrapper}>
                <ul className={styles.searchErrorList}>
                    <li className={styles.searchErrorListItem}><h3>This is likely due to your input formatting:</h3></li> 
                    <li className={styles.searchErrorListItem}>&bull;&nbsp;&nbsp;Click&nbsp; 
                        <div className={styles.searchErrorListItemLink}>
                            <Link href="/searchError/exampleSearch"> here </Link>
                        </div>
                        &nbsp;to see an example of a valid search.
                    </li>
                    <li className={styles.searchErrorListItem}>&bull;&nbsp;&nbsp;Click&nbsp; 
                        <div className={styles.searchErrorListItemLink}>                    
                            <Link className={styles.searchErrorListItemLink} href="/blast"> here </Link>
                        </div>
                        &nbsp;to make another search.
                    </li>
                </ul>
            </div>
        </div>
    );
}