import styles from "../../../styles/Home.module.css"
import TaxonomyResultsTable from "../../../components/taxonomyResultsTable";
import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { useQuery, useMutation } from "@tanstack/react-query";
import GenusTableData from "../../../components/genusTableData";

export default function genusSearchResults(props){
    const genus = props.genus;
    const search = props.search;
    const availableSpecies = props.availableSpecies;
    const [transporterSearch, setTransporterSearch] = useState("init");
    const [initialStatus, setInitialStatus] = useState(true);
    const [transporterBarChartData, setTransporterBarChartData] = useState();
    const [chartID, setChartID] = useState({index: 0, value: null});
    const [chartLoaded, setChartLoaded] = useState(false);
    const [transporterLevelState, setTransporterLevelState] = useState("Level 5");
    const [foundState, setFoundState] = useState(false);

    const { 
        isLoading: loadingTableData,
        isSuccess: tableDataSuccessful,
        data: genusTableData,
        mutate: addGenusTableData 
    } = useMutation(retrieveGenusTableData); 

    useEffect(() => {
        let newData;
        if(genusTableData){
            newData = makeTransporterChartData(genusTableData.data, chartID.index)
            setTransporterBarChartData(newData);
            setChartLoaded(true);
        }
    }, [chartID])

    useEffect(() => {
        addGenusTableData(
            {
                transporterLevelState: transporterLevelState,
                availableSpecies: availableSpecies,
                genus: genus,
            });
    }, [transporterLevelState]);

    const handleLevelChange = (event) => {
        setTransporterLevelState(event.target.value); 
    }
    const handleTransporterSearch = (event) => {
        event.preventDefault();
        const search = event.target[0].value;
        setTransporterSearch(search);
        const chartID = getChartID(genusTableData.keys, search);
        console.log("Chart ID is: ", chartID);
        if(chartID.value){
            setFoundState(true)
            setChartID(chartID)
        }
        else {
            setFoundState(false)
        }
        setInitialStatus(false);
        setChartID(chartID);
    }
    return(
        <div className={styles.genusPageWrapper}>
            <h1 className={styles.title}>Genus- {genus}</h1>
            <ul className={styles.taxonomyList}>
                {
                    availableSpecies.map((species, index) => (
                        <div className={styles.taxonomyListItem} key={index}>
                            <TaxonomyResultsTable search={search} filters={"genus"} data={species} levelToDisplay={"species"}/>
                        </div>
                    ))
                }
            </ul>
            <div id={styles.genusTransporterLevelWrapper}>
                <h2>Transporter Quantities in Genus</h2>
                <select onChange={handleLevelChange}
                        value={transporterLevelState}
                        className={styles.button}
                    >
                        <option value="Level 5">Transporter Level 5</option>
                        <option value="Level 4">Transporter Level 4</option>
                        <option value="Level 3">Transporter Level 3</option>
                        <option value="Level 2">Transporter Level 2</option>
                        <option value="Level 1">Transporter Level 1</option>
                    </select>
            </div>
            {
                loadingTableData && 
                <h3>Loading Table...</h3>
            }
            {
                tableDataSuccessful &&
                <div className={styles.transporterTableWrapper}>
                    <div className={styles.transporterTable}>
                        <GenusTableData data={genusTableData.data} transporterIDs={genusTableData.keys}/>
                    </div>
                </div>
            }
            <h3 id={styles.transporterSearchHeader}>Search Transporter IDs to Compare Across Genus</h3>
            <div className={styles.tranporterIDSearchWrapper}>
                <form onSubmit={handleTransporterSearch}>
                    <input className={styles.transporterIDSearch} placeholder="Enter Transporter ID to Compare Here..." type="text"></input>
                    <button className={styles.button} type="submit">Compare</button>
                </form>
            </div>
            {
                foundState && chartLoaded &&
                <div className={styles.transporterBarChartWrapperWrapper}>
                    <h3>Transporter ID- {transporterSearch}</h3>
                    <div className={styles.transporterBarChartWrapper}>
                        <Bar data={transporterBarChartData}></Bar>
                    </div>
                </div>
            }
            {
                foundState && !chartLoaded &&
                    <h3>Loading Chart...</h3>
            }
            {
                !foundState && !initialStatus &&
                <h3>Transporter ID- {transporterSearch} not found</h3>
            }

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

    return{
        props: {
            genus: genus,
            availableSpecies: availableSpecies,
            search: search,
        }
    }
}

export function countTransporters(data, speciesObj, level){
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
        if(data[i][level] in dataObj){
            dataObj[data[i][level]][data[i].species] += 1;
        }
        else{
            dataObj[data[i][level]] = {};
            //add each species as a prop
            for(let j = 0; j < species.length; j++){
                dataObj[data[i][level]][species[j]] = 0;
            }
            //increment the species that was first found to one
            dataObj[data[i][level]][data[i].species] = 1;
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
function makeTransporterChartData(transporterData, index){
    console.log({transporterData, index});
    const labels = Object.keys(transporterData[index]);
    const dataArr = [];
    for(let i = 0; i < labels.length; i++){
        dataArr.push(transporterData[index][labels[i]]);
    }
    dataArr[dataArr.length-1] = Number(dataArr[dataArr.length-1]);
    const data = {
        labels: labels,
        datasets: [{
            label: "Transporter Quantities",
            data: dataArr,
            backgroundColor: [
                'rgb(6, 141, 157)',
                'rgb(83, 89, 154)',
                'rgb(109, 157, 197)',
                'rgb(128, 222, 217)',
                'rgb(174, 236, 239)',
            ],
        }]
    }
    return data;

}

function getChartID(transporterIDs, search){
    console.log({transporterIDs, search})
    for(let i = 0; i < transporterIDs.length; i++){
        if(transporterIDs[i] === search){
            return {
                index: i,
                value: transporterIDs[i],
            };
        }
    }
    return {
        index: 0,
        value: null,
    };
}

export function getLevelSQLName(level){
    switch(level){
        case("Level 5"):
            level = "Transporter_id"
            break;
        case("Level 4"):
            level = "Transporter_level4"
            break;
        case("Level 3"):
            level = "Transporter_level3"
            break;
        case("Level 2"):
            level = "Transporter_level2"
            break;
        case("Level 1"):
            level = "Transporter_level1"
            break;
        default:
            level = ""
            throw "Error in getting level"
    }
    return level;
}

const retrieveGenusTableData = async (variables) => {
    const retrieveGenusDataOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            genus: variables.genus,
            level: variables.transporterLevelState
        })
    };
    const res = await fetch("http://localhost:4000/retrieveGenusData", retrieveGenusDataOptions);
    const tableResData = await res.json();
    const sqlName = getLevelSQLName(variables.transporterLevelState);
    const countedTransporters = countTransporters(tableResData.data, variables.availableSpecies, sqlName);
    return countedTransporters;
}

