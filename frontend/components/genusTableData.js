import styles from "../styles/Home.module.css";

export default function GenusTableData(props){
    const species = props.species;
    //arr of objs where keys are transporterID, species names with quantity as values
    const data = props.data;
    const transporterIDs = props.transporterIDs;
    const dataKeys = Object.keys(data[0]);

    return(
        <table className={styles.resultsTable}>
            <thead>
                <tr>
                    <th className={styles.resultsTable}>Transporter ID <br></br> &#40;Click for more Info&#41;</th>
                    {dataKeys.map((key, index) => (
                        <th className={styles.resultsTable} key={index}>{key}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                    {
                        data.map((element, index) => {
                            return(
                                <tr key={index}>
                                    <td className={styles.resultsTable}>
                                        <a 
                                        href={`https://www.tcdb.org/search/result.php?tc=${transporterIDs[index]}`}
                                        target="_blank"
                                        className={styles.transporterLink}
                                        >
                                            {transporterIDs[index]}
                                        </a>
                                    </td>
                                    {
                                        dataKeys.map((key, index) => {
                                            return(
                                                <td className={styles.resultsTable} key={index}>{element[key]}</td>
                                            )
                                        })
                                    }
                                </tr>
                                
                            );
                        })
                    }
            </tbody>
        </table>
    );
}