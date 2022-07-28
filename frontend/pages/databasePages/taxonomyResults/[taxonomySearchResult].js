import { useRouter } from "next/router";
import TaxonomyResultsTable from "../../../components/taxonomyResultsTable";
import styles from "../../../styles/Home.module.css";


//Display all the organisms in our database one taxonomic level below the search
//Clicking on an organism displays everything in one taxonomic level below that and so on until species
//Once species a species has been selected, display informatic data about that species
export default function searchResult(props){
    const router = useRouter();
    if(props.status === 500){
        router.push("/searchError");
    }

    const data = props.data;
    const filters = props.filters;
    const levelToDisplay = props.levelToDisplay;
    const taxonomyLevel = props.taxonomyLevel;
    const capitalizedTaxonomyLevel = capitalizeFirstLetter(taxonomyLevel);
    const capitalizedLevelToDisplay = capitalizeFirstLetter(levelToDisplay);
    const genomeData = removeNulls(data.genomeData, levelToDisplay);
    const pluralizedTaxonomyLevelToDisplay = pluralizeTaxonomyLevel(capitalizedLevelToDisplay);
    const search = props.search;
    return(
        <div>
            <h1 className={styles.title}>Select the Next Taxonomic Rank</h1>
            <div className={styles.taxonomyRunningName}>
            {
                    search.map((element, index) =>(
                        <p>{filters[index]}: {element},&nbsp;</p>
                    ))
            }
            </div>
            <div className={styles.taxonomyListWrapper}>
                <h4 className={styles.taxonomyListTitle}>{pluralizedTaxonomyLevelToDisplay} Available</h4>
                <ul className={styles.taxonomyList}>
                    {
                        genomeData.map((element) => (
                            <div className={styles.taxonomyListItem}>
                                <TaxonomyResultsTable search={props.search} filters={filters} data={element} levelToDisplay={levelToDisplay}/>
                            </div>
                        ))
                    }
                </ul>
            </div>

        </div>
    );
}

export async function getServerSideProps(context){
    try{
        let search = JSON.parse(context.query.search);
        let taxonomyLevel = context.query.taxonomyLevel;
        let filters = JSON.parse(context.query.filters);
        console.log("tax level: ", taxonomyLevel);

        filters.push(taxonomyLevel);

        let levelToDisplay;
        if(taxonomyLevel !== "species"){
            levelToDisplay = getNextLevel(taxonomyLevel);
        }
        else{

        }

        const retrieveSpeciesDataOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "search": search[search.length-1],
                "taxonomyLevel": taxonomyLevel,
                "levelToDisplay": levelToDisplay,
                "filters": filters[filters.length-1],
            }),
        }
        //post query to back end
        const res = await fetch("http://localhost:4000/retrieveTaxonomySearchData", retrieveSpeciesDataOptions);
        const searchData = await res.json();

        return{
            props: {
                "data": searchData.data,
                "search": search,
                "levelToDisplay": levelToDisplay,
                "taxonomyLevel": taxonomyLevel,
                "filters": filters,
            }
        }
    }
    catch(err){
        console.error(err);
        return{
            props:{"status": 500}
        }
    }
}

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getNextLevel(taxonomyLevel){
    const taxonomyLevels = ["phylum", "class", "order", "family", "genus", "species"];
    let levelToDisplay;
    console.log("taxLevel here: ", taxonomyLevel);
    //select the taxonomy level after the searched level
    taxonomyLevels.map((element, index) =>{
        if(element === taxonomyLevel){
            levelToDisplay = taxonomyLevels[index + 1];       
    }
    });
    if(!levelToDisplay){
        throw "taxonomy level is not valid";
    }
    return levelToDisplay;

}   

export function pluralizeTaxonomyLevel(level){
    let pluralLevel;
    if(level === "Genus" || level === "Class"){
        pluralLevel = level + "es";
    }
    else if(level === "Family"){
        level = level.slice(0, (level.length)-1)
        pluralLevel = level + "ies";
    }
    else if(level === "Species"){
        pluralLevel = level;
    }
    else{
        pluralLevel = level + "s";
    }
    return pluralLevel;
}

export function removeNulls(genomeData, levelToDisplay){
    console.log("genome Data is: ", genomeData);
    //loop through arr, if null remove
    for(let i = 0; i < genomeData.length; i++){
        if(!genomeData[i][levelToDisplay]){
            genomeData.splice(i, 1);
        }
    }

    return genomeData;

}