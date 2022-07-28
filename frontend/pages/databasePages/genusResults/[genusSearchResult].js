import styles from "../../../styles/Home.module.css"
import TaxonomyResultsTable from "../../../components/taxonomyResultsTable";
import { useRouter } from "next/router";
import GenusTableData from "../../../components/genusTableData";


export default function genusSearchResults(props){
    const genus = props.genus;
    const search = props.search;
    const availableSpecies = props.availableSpecies;
    const transporterData = props.transporterData;

    return(
        <div className={styles.genusPageWrapper}>
            <h1 className={styles.title}>Genus- {genus}</h1>
            <ul className={styles.taxonomyList}>
                {
                    availableSpecies.map((species) => (
                        <div className={styles.taxonomyListItem}>
                            <TaxonomyResultsTable search={search} filters={"genus"} data={species} levelToDisplay={"species"}/>
                        </div>
                    ))
                }
            </ul>
            <h2>Transporter Quantities in Genus</h2>
            <div className={styles.transporterTable}>
                <GenusTableData data={transporterData} transporterIDs={props.transporterIDs}/>
            </div>
        </div>
    );
}

export async function getServerSideProps(context){
    const search = JSON.parse(context.query.search);
    const genus = search[search.length-1]

    //query backend normally to get available species
    const retrieveSpeciesDataOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "search": genus,
            "levelToDisplay": "species",
            "filters": "genus",
        }),
    }
    const res = await fetch("http://localhost:4000/retrieveTaxonomySearchData", retrieveSpeciesDataOptions);
    const searchData = await res.json();
    const availableSpecies = searchData.data.genomeData;

    //query to get data about genus
    const retrieveGenusDataOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            genus: genus
        })
    }
    const genusDataRes = await fetch("http://localhost:4000/retrieveGenusData", retrieveGenusDataOptions);
    const genusData = await genusDataRes.json();

    //count transporters by species
    const tableData = countTransporters(genusData.data, availableSpecies);
    const transporterData = tableData.data;
    const transporterIDs = tableData.keys;


    return{
        props: {
            genus: genus,
            availableSpecies: availableSpecies,
            search: search,
            transporterData: transporterData,
            transporterIDs: transporterIDs,
        }
    }


}

export function countTransporters(data, speciesObj){
    //arr of objs where keys are transporterID, species names with quantity as values
    //make map of tarnsporters and their quantities
    //one map for each species

    //make obj, push id to obj with prop for each species if not there.
    //if there, increment the coressponding species count
    //then convert obj to arr
    let species = [];
    const speciesKeys = Object.keys(speciesObj);
    for(let i = 0; i < speciesKeys.length; i++){
        species.push(speciesObj[i]["species"]);
    }
    let dataObj = {};
    for(let i = 0; i < data.length; i++){
        if(data[i].Transporter_id in dataObj){
            dataObj[data[i].Transporter_id][data[i].species] += 1;
        }
        else{
            dataObj[data[i].Transporter_id] = {};
            //add each species as a prop
            for(let j = 0; j < species.length; j++){
                dataObj[data[i].Transporter_id][species[j]] = 0;
            }
            //increment the species that was first found to one
            dataObj[data[i].Transporter_id][data[i].species] = 1;
        }
    }
    let dataArr = [];
    const dataObjKeys = Object.keys(dataObj);
    for(let i = 0; i < dataObjKeys.length; i++){
        dataArr.push(dataObj[dataObjKeys[i]]);
    }

    dataArr = createAverages(dataArr);

    dataArr = dataArr.sort((a, b) => {return b.Average-a.Average})

    return {
        data: dataArr,
        keys: dataObjKeys
    };
}

function createAverages(data){
    for(let i = 0; i < data.length; i++){
        const keys = Object.keys(data[i])
        let total = 0;
        for(let j = 0; j < keys.length; j++){
            total += data[i][keys[j]];
        }
        let average = total / keys.length;
        average = average.toFixed(2);
        data[i]["Average"] = average;
    }
    return data;
}
