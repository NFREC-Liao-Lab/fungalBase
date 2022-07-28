import { numberOfResults } from "../pages";
import styles from "../styles/Home.module.css"

export default function ResultsTable(props) {
    let data = props.data;
    let supportingData = props.supportingData;
    let genomeInfo = props.genomeInfo;
    const query = props.query;

    return (
        <div>
            <table className={styles.resultsTable}>
                <thead>
                    <tr>
                        <th className={styles.resultsTable}>Query ID</th>
                        <th className={styles.resultsTable}>Subject Sequence ID</th>
                        <th className={styles.resultsTable}>Total Score</th>
                        <th className={styles.resultsTable}>Query Coverage</th>
                        <th className={styles.resultsTable}>E value</th>
                        <th className={styles.resultsTable}>Identity Value</th>
                        <th className={styles.resultsTable}>TransporterID<br />(Click for more info)</th>
                        <th className={styles.resultsTable}>Species</th>
                        <th className={styles.resultsTable}>Lifestyle</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((dataCategory, index) =>{
                            return(
                                <tr key={index}>
                                    <td className={styles.resultsTable}>{query}</td>
                                    <td className={styles.resultsTable}>{dataCategory.sequenceID}</td>
                                    <td className={styles.resultsTable}>{dataCategory.totalScore}</td>
                                    <td className={styles.resultsTable}>{dataCategory.queryCoverage}</td>
                                    <td className={styles.resultsTable}>{dataCategory.eValue}</td>
                                    <td className={styles.resultsTable}>{dataCategory.identityValue}</td>
                                    <td className={styles.resultsTable}><a className={styles.transporterLink} href={`https://www.tcdb.org/search/result.php?tc=${supportingData[index][0].Transporter_id}`} target="_blank">{supportingData[index][0].Transporter_id}</a></td>
                                    <td className={styles.resultsTable}>{genomeInfo[index][0].Species}</td>
                                    <td className={styles.resultsTable}>{genomeInfo[index][0].primary_lifestyle}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    );
}