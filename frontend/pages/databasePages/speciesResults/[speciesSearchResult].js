import { useState } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import TransporterTable from "../../../components/transporterTable";
import styles from "../../../styles/Home.module.css";
import CarouselCard from "../../../components/carouselCard";


export default function speciesSearchResult(props){

    const numberOfTransporters = 10;
    const transporterData = props.transporterData;
    //Full Taxonomy, GenomeID, Publication Link, JGI Link, Species Wikipedia Link, TaxID, Gene Size, 
    const transporterDensityLevel1 = getTransporterDensity(transporterData, numberOfTransporters, "Transporter_level1");
    const transporterDensityLevel2 = getTransporterDensity(transporterData, numberOfTransporters, "Transporter_level2");
    const transporterDensityLevel3 = getTransporterDensity(transporterData, numberOfTransporters, "Transporter_level3");
    const transporterDensityLevel4 = getTransporterDensity(transporterData, numberOfTransporters, "Transporter_level4");
    const transporterDensityLevel5 = getTransporterDensity(transporterData, numberOfTransporters, "Transporter_id")

    const [tableLevelState, setTableLevelState] = useState(
        {
            "selected": transporterDensityLevel5,
            "value": "Transporter Density Level 5"
        }   
     );
    
    //data for charts
    const chartsData = makeChartsData(transporterDensityLevel1, transporterDensityLevel2, transporterDensityLevel3, transporterDensityLevel4, transporterDensityLevel5);

    const handleLevelChange = e => {
        let choice = e.target.value;
        let level;
        switch(choice){
            case("level5"):
                level = transporterDensityLevel5;
                break;
            case("level4"):
                level = transporterDensityLevel4;
                break;
            case("level3"):
                level = transporterDensityLevel3;
                break;
            case("level2"):
                level = transporterDensityLevel2;
                break;
            case("level1"):
                level = transporterDensityLevel1;
                break;
            default:
                throw "not a valid transporter density level";
        }
        setTableLevelState({"selected": level, "value": choice});
    }
    let speciesData = props.speciesData;
    speciesData = removeNulls(speciesData[0]);
    const carouselData = makeCarouselData(speciesData);
    const binomialNomenclature = makeBinomialNomenclature(props.species);
    return(
        <div>
            <h1 className={styles.title}>
                {props.species}
            </h1>
                <div className={styles.carouselContainer}>
                    <CarouselCard data={carouselData.taxonomyInfo} binomialNomenclature={binomialNomenclature}/>
                    <CarouselCard data={carouselData.speciesInfo}/>
                    <CarouselCard data={carouselData.genomicInfo}/>
                </div>

            <div className={styles.transporterDataWrapper}>
                <div className={styles.transporterChartsWrapperWrapper}>
                    <h2>10 Most Abundant Transporter Genes Distribution</h2>
                <div className={styles.transporterChartsWrapper}>
                        <div className={styles.transporterChart}>
                            <h3>Level 5 Transporters</h3>
                            <Pie data={chartsData.level5PieData}></Pie>
                        </div>
                        <div className={styles.transporterChart}>
                            <h3>Level 4 Transporters</h3>
                            <Pie data={chartsData.level4PieData}></Pie>
                        </div>
                        <div className={styles.transporterChart}>
                            <h3>Level 3 Transporters</h3>
                            <Pie data={chartsData.level3PieData}></Pie>
                        </div>
                        <div className={styles.transporterChart}>
                            <h3>Level 2 Transporters</h3>
                            <Pie data={chartsData.level2PieData}></Pie>
                        </div>
                        <div className={styles.transporterChart}>
                            <h3>Level 1 Transporters</h3>
                            <Pie data={chartsData.level1PieData}></Pie>
                        </div>
                    </div>
                </div>
                <div className={styles.transporterTableWrapper}>
                    <select className={styles.button}
                        onChange={handleLevelChange}
                        value={tableLevelState.value}
                    >
                        <option value="level5">Transporter Level 5</option>
                        <option value="level4">Transporter Level 4</option>
                        <option value="level3">Transporter Level 3</option>
                        <option value="level2">Transporter Level 2</option>
                        <option value="level1">Transporter Level 1</option>
                    </select>
                    <h3 id={styles.tableTitle}>Full Species Transporter Gene Data</h3>
                    <div className={styles.transporterTable}>
                        <TransporterTable transporterDensity={tableLevelState.selected}></TransporterTable>
                    </div>
                </div>
            </div>
        </div>
    );
}

export async function getServerSideProps(context){
    const species = JSON.parse(context.query.species);
    const speciesDataOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "species": species,
        }),
    }

    //get data to display
    const res = await fetch("http://localhost:4000/retrieveSpeciesData", speciesDataOptions);
    const speciesData = await res.json();

    return{
        props: {
            "species": species,
            "transporterData": speciesData.data,
            "speciesData": speciesData.speciesData,
        }
    }
}

export function getTransporterDensity(originalData, numberOfTransporters, level){
    //Array of objects where each object has transporter value and number there are
    
    //get array of transporters
    let transporters = [];
    originalData.map((element, index) => {
        transporters.push(element[level]);
    });

    //sort so matching transporters are next to each other
    transporters.sort();

    let data = [];
    for(let i = 0; i < transporters.length; i++){
        if(transporters[i] === transporters[i-1]){
            //if this transporter is the same as previous
            data[data.length-1].count += 1;
        }
        else{
            //if it's  a new transporter
            //get matching seqID
            let seqID;
            for(let j = 0; j < originalData.length; j++){
                if(originalData[j][level] === transporters[i]){
                    seqID = originalData[j].SeqID;
                }
            }
            let obj = {"transporter": transporters[i], "count": 1, "seqID": seqID};
            data.push(obj);
        }
    }

    //sort data by count
    data.sort((a, b) => (a.count < b.count) ? 1 : -1)

    //make table data that is array of objects that have props of seqID, transporterID, and quantity

    //if the number of unique transporters is less than numberOfTransporters
    if(data.length < numberOfTransporters){
        numberOfTransporters = data.length;
    }

    let finalDataObjects = [];
    // const stopCondition = data.length-(numberOfTransporters+1);
    for(let i = 0; i < numberOfTransporters; i++){
        finalDataObjects.push(data[i]);
    }

    let finalDataCounts = [];
    for(let i = 0; i < numberOfTransporters; i++){
        finalDataCounts.push(finalDataObjects[i].count);
    }

    let finalDataLabels = [];
    for(let i = 0; i < numberOfTransporters; i++){
        finalDataLabels.push(finalDataObjects[i].transporter);
    }    

    const finalData = {
        "labels": finalDataLabels,
        "counts": finalDataCounts,
        "tableData": data,
    }
    return finalData;
}

function makeChartsData(transporterDensityLevel1, transporterDensityLevel2, transporterDensityLevel3, transporterDensityLevel4, transporterDensityLevel5){
    const level1PieData = {
        labels: transporterDensityLevel1.labels,
        datasets: [{
            label: "transporters",
            data: transporterDensityLevel1.counts,
            backgroundColor: [
                'rgb(41, 47, 54)',
                'rgb(78, 205, 196)',
                'rgb(247, 255, 2471)',
                'rgb(255, 107, 107)',
                'rgb(255, 230, 109)',
            ],
          }]
    };
    const level2PieData = {
        labels: transporterDensityLevel2.labels,
        datasets: [{
            label: "transporters",
            data: transporterDensityLevel2.counts,
            backgroundColor: [
                'rgb(89, 41, 65)',
                'rgb(73, 132, 103)',
                'rgb(154, 152, 181)',
                'rgb(181, 248, 254)',
                'rgb(16, 255, 203)',
            ],
          }]
    };
    const level3PieData = {
        labels: transporterDensityLevel3.labels,
        datasets: [{
            label: "transporters",
            data: transporterDensityLevel3.counts,
            backgroundColor: [
                'rgb(72, 99, 156)',
                'rgb(76, 76, 157)',
                'rgb(113, 47, 121)',
                'rgb(151, 99, 145)',
                'rgb(116, 165, 127)',
            ],
          }]
    };
    const level4PieData = {
        labels: transporterDensityLevel4.labels,
        datasets: [{
            label: "transporters",
            data: transporterDensityLevel4.counts,
            backgroundColor: [
                'rgb(98, 144, 195)',
                'rgb(194, 231, 218)',
                'rgb(241, 255, 231)',
                'rgb(26, 27, 65)',
                'rgb(186, 255, 41)',
            ],
          }]
    };
    const level5PieData = {
        labels: transporterDensityLevel5.labels,
        datasets: [{
            label: "transporters",
            data: transporterDensityLevel5.counts,
            backgroundColor: [
                'rgb(6, 141, 157)',
                'rgb(83, 89, 154)',
                'rgb(109, 157, 197)',
                'rgb(128, 222, 217)',
                'rgb(174, 236, 239)',
            ],
          }]
    };

    return {
        level1PieData: level1PieData,
        level2PieData: level2PieData,
        level3PieData: level3PieData,
        level4PieData: level4PieData,
        level5PieData: level5PieData,
    }
}

export function removeNulls(data){
    for(let key in data){
        if(!data[key]){
            delete data[key];
        }
    }
    return data;
}

function makeCarouselData(speciesData){
    let taxonomyInfo = {};
    let genomicInfo = {};
    let speciesInfo = {};
    for(let key in speciesData){
        if(key === "phylum" || key === "class" || key === "orderColumn" || key === "family" || key === "TaxID"){
            taxonomyInfo[key] = speciesData[key];
        }
        else if(key === "Genome_id" || key === "JGI_link" || key === "Assembly_Length" || key === "Gene_number" || key === "Publish_link"){
            genomicInfo[key] = speciesData[key];
        }
        else{
            speciesInfo[key] = speciesData[key];
        }
    }
    
    //remove underscores and capitalize
    taxonomyInfo = cleanData(taxonomyInfo);
    genomicInfo = cleanData(genomicInfo);
    speciesInfo = cleanData(speciesInfo);

    taxonomyInfo["Title"] = "Taxonomy";
    genomicInfo["Title"] = "Genomic Information";
    speciesInfo["Title"] = "General Information";

    return {
        taxonomyInfo: taxonomyInfo,
        genomicInfo: genomicInfo,
        speciesInfo: speciesInfo,
    }
}

export function cleanData(data){
    let newData = {}
    //replace underscores with spaces
    //check values
    for(let key in data){
        if(key === "OrderColumn"){
            data["Order"] = data[key];
            delete data[key];
            key = "Order";
        }
        else if(key === "TaxID"){
            data["Taxonomy ID"] = data[key];
            delete data[key];
            key = "Taxonomy ID";
        }

        if(typeof(data[key]) === "string"){
           newData[key] = data[key].replace(/_/g, " ");
        }
        else{
            newData[key] = data[key];
        }
    }
    //check keys
    let keys = Object.keys(newData);
    let newKeys = []
    for(let i = 0; i < keys.length; i++){
        if(keys[i].includes("_")){
            newKeys[i] = keys[i].replace(/_/g, " ");
            //change the key in newData
            newData[newKeys[i]] = newData[keys[i]];
            delete newData[keys[i]];
        }
    }
    //Capitalize letter after spaces
    //For properties
    for(let key in newData){
        newData[key] = capitalizeValues(newData, key);
    }
    //For keys
    let capitalKeys = Object.keys(newData);
    capitalKeys = capitalizeKeys(capitalKeys);    
    for(let i = 0; i < capitalKeys.length; i++){
        if(capitalKeys[i].slice(capitalKeys[i].length-8, capitalKeys[i].length) === "Template"){
            capitalKeys[i] = capitalKeys[i].slice(0, capitalKeys[i].length-9);
        }
    }
    let count = 0;
    for(let key in newData){
        if(key !== capitalKeys[count]){
            newData[capitalKeys[count]] = newData[key];
            delete newData[key];
        }
        count += 1;
    }
    // remove "template"
    return newData;
}

function capitalizeValues(newData, key){
    if(typeof(newData[key]) === "string"){
        //first letter
        newData[key] = newData[key].charAt(0).toUpperCase() + newData[key].slice(1, newData[key].length);
        //letters after spaces
        for(let i = 0; i < newData[key].length; i++){
            if(newData[key].charAt(i) === " "){
                const upper = newData[key].charAt(i+1).toUpperCase();
                newData[key] = newData[key].slice(0, i+1) + upper + newData[key].slice(i+2, newData[key].length);
            }
        }
    }
    return newData[key];
}

function capitalizeKeys(capitalKeys){
    for(let i = 0; i < capitalKeys.length; i++){
        if(typeof(capitalKeys[i]) === "string"){
            //capitalize first letter
            capitalKeys[i] = capitalKeys[i].charAt(0).toUpperCase() + capitalKeys[i].slice(1, capitalKeys[i].length);
            for(let j = 0; j < capitalKeys[i].length; j++){
                if(capitalKeys[i].charAt(j) === " "){
                    const upper = capitalKeys[i].charAt(j+1).toUpperCase();
                    capitalKeys[i] = capitalKeys[i].slice(0, j+1) + upper + capitalKeys[i].slice(j+2, capitalKeys[i].length);
                }
            }
        }
    }
    return capitalKeys;
}

function makeBinomialNomenclature(binomialNomenclature){
    const spaceIndex = binomialNomenclature.indexOf(" ");
    const Genus = binomialNomenclature.slice(0, spaceIndex);
    const Species = binomialNomenclature.slice(spaceIndex+1, binomialNomenclature.length);
    return {
        Genus: Genus,
        Species: Species
    }

}