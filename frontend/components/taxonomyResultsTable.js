import Link from "next/link";



export default function TaxonomyResultsTable(props){
    const element = props.data;
    const levelToDisplay = props.levelToDisplay;
    let nextLevelPath;
    let filters = props.filters;
    let filtersJSON = JSON.stringify(props.filters);
    let search = props.search;
    let numberOfFilters = filters.length;
    console.log("element is: ", element);
    //search is array of the previous choices
    //reset search to only jave the previous searches, not results
    let newSearch = [];
    for(let i = 0; i < numberOfFilters; i++){
        newSearch.push(search[i]);
    }
    search = newSearch;
    search.push(element[levelToDisplay]);
    let searchJSON = JSON.stringify(search);


    if(levelToDisplay === "genus"){
        nextLevelPath = {
            pathname: `/databasePages/genusResults/${element[levelToDisplay]}`,
            query: {
                "taxonomyLevel": levelToDisplay,
                "filters": filtersJSON,
                "search": searchJSON,
                // "species": JSON.stringify([element[levelToDisplay]]),
            }
        }
    }
    else if(levelToDisplay === "species"){
        nextLevelPath = {
            pathname: `/databasePages/speciesResults/${element[levelToDisplay]}`,
            query: {
                species: JSON.stringify(element[levelToDisplay]),
            }
        }
    }
    else{
            nextLevelPath = {
            pathname: `/databasePages/taxonomyResults/${element[levelToDisplay]}`,
            query: {
                "taxonomyLevel": levelToDisplay,
                "filters": filtersJSON,
                "search": searchJSON,
            }
        }
    }
    
    console.log("path", nextLevelPath.pathname);
    return(
        <div>
            <Link href={nextLevelPath}>
                <li>{element[levelToDisplay]}</li>
            </Link>
        </div>
    );
}

