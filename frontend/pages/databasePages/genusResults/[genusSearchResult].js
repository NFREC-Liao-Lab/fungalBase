import styles from "../../../styles/Home.module.css"
import TaxonomyResultsTable from "../../../components/taxonomyResultsTable";
import GenusTableData from "../../../components/genusTableData";
import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";



export default function genusSearchResults(props){
    const genus = props.genus;
    const search = props.search;
    const availableSpecies = props.availableSpecies;
    const transporterData = props.transporterData;
    const [transporterSearch, setTransporterSearch] = useState("");
    const [transporterBarChartData, setTransporterBarChartData] = useState(props.nullChartData);
    const [chartID, setChartID] = useState({index: -1, value: ""});

    useEffect(() => {
        setChartID(getChartID(props.transporterIDs, transporterSearch));
    }, [transporterSearch])

    useEffect(() => {
        let newData = makeTransporterChartData(transporterData, chartID.index, availableSpecies)
        setTransporterBarChartData(newData);
    }, [chartID])

    const handleTransporterSearch = (event) => {
        event.preventDefault();
        const search = event.target[0].value;
        setTransporterSearch(search);
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
            <h2>Transporter Quantities in Genus</h2>
            <div className={styles.transporterTable}>
                <GenusTableData data={transporterData} transporterIDs={props.transporterIDs}/>
            </div>
            <div>
                <form onSubmit={handleTransporterSearch}>
                    <input placeholder="Enter Sequence ID to Compare Here..." type="text"></input>
                    <input type="submit"></input>
                </form>
            </div>
            <div>
                <h3>{transporterSearch}</h3>
            </div>
            <div className={styles.transporterBarChartWrapper}>
                <Bar data={transporterBarChartData}></Bar>
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

    let nullChartData = [{}]
    for(let i = 0; i < availableSpecies.length; i++){
        nullChartData[0][availableSpecies[i].species] = 0;
    }
    nullChartData = makeTransporterChartData(nullChartData, 0, availableSpecies);

    return{
        props: {
            genus: genus,
            availableSpecies: availableSpecies,
            search: search,
            transporterData: transporterData,
            transporterIDs: transporterIDs,
            nullChartData: nullChartData,
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
function makeTransporterChartData(transporterData, index, availableSpecies){
    let labels;
    if(index === -1){
        labels = availableSpecies
        index = 0;
    }
    else{
        labels = Object.keys(transporterData[index]);
    }
    const dataArr = [];
    for(let i = 0; i < labels.length; i++){
        dataArr.push(transporterData[index][labels[i]]);
    }
    dataArr[dataArr.length-1] = Number(dataArr[dataArr.length-1]);
    console.log(dataArr);
    const data = {
        labels: labels,
        datasets: [{
            label: "Transporter Quantities",
            data: dataArr,
            backGroundColor: [
                'rgb(41, 47, 54)',
                'rgb(78, 205, 196)',
                'rgb(247, 255, 247)',
                'rgb(255, 107, 107)',
                'rgb(255, 230, 109)',
            ],
        }]
    }
    return data;

}

function getChartID(transporterIDs, search){
    console.log("search is: ", search);
    for(let i = 0; i < transporterIDs.length; i++){
        if(transporterIDs[i] === search){
            return {
                index: i,
                value: transporterIDs[i],
            };
        }
    }
    return {
        index: -1,
        value: "",
    };
}