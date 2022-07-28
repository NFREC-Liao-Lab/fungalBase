import styles from "../styles/Home.module.css";

export default function TransporterTable(props){
    const transporterDensity = props.transporterDensity;
    return(
            <table className={styles.resultsTable}>
                <thead>
                        <tr>
                            <th className={styles.resultsTable}>Sequence ID</th>
                            <th className={styles.resultsTable}>Transporter ID <br></br> &#40;Click for more info&#41;</th>
                            <th className={styles.resultsTable}>Transporter Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transporterDensity.tableData.map((element, index) => (
                            <tr key={index}>
                                <td className={styles.resultsTable}>{element.seqID}</td>
                                <td className={styles.resultsTable}>
                                    <a className={styles.transporterLink}
                                        target="_blank" href={`https://www.tcdb.org/search/result.php?tc=${element.transporter}`}>
                                        {element.transporter}
                                    </a>
                                </td>
                                <td className={styles.resultsTable}>{element.count}</td>
                            </tr>
                        ))}
                    </tbody>
            </table>
    );
}