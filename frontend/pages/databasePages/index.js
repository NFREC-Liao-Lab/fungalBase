import { useRouter } from "next/router";
import { useState } from "react";
import styles from "../../styles/Home.module.css"
import Link from "next/link";

export default function directSearch(props){
    const [taxonomyLevelState, setTaxonomyLevelState] = useState({"value": "binomialNomenclature"});
    const router = useRouter();

    //get phylums as array of objects
    const phylums = props.phylums.phylums;

    //push to next page after search
    const handleSearch = (event) => {
        event.preventDefault();
        const search = JSON.stringify([event.target[0].value]);
        const filters = JSON.stringify([]);

        if(taxonomyLevelState === "genus"){
            router.push({
                pathname: `/databasePages/genusResults/${search}`,
                query: {
                    "search": search,
                }
            })
        }
        else if(taxonomyLevelState === "binomialNomenclature"){
            router.push({
                pathname:  `/databasePages/speciesResults/${search}`,
                query: {
                    "species": search,
                }
            })
        }
        else{
            router.push({
                pathname: `/databasePages/taxonomyResults/${search}`,
                query: {
                    "search": search,
                    "taxonomyLevel": taxonomyLevelState,
                    "filters": filters,
                }
            })
        }
        
    }
    return(
        <div>
            <h1 className={styles.title}>Browse Our Fungal Database</h1>
            <div className={styles.databasePagesWrapper}>
                <div className={styles.phylumsWrapper}>
                    <div className={styles.phylumsTitle}>
                        <h3>Filter from Phylum: </h3>
                    </div>
                    {phylums.map((element, index) => (
                        <Link href={{
                            pathname: `/databasePages/taxonomyResults/${element}`,
                            query: {
                                "search": JSON.stringify([element.phylum]),
                                "taxonomyLevel": "phylum",
                                "filters": JSON.stringify([]),
                            }
                            }}>
                        <p className={styles.taxonomyListItem} key={index}>{element.phylum}</p>
                        </Link>
                    ))}
                </div>

                <div className={styles.searchField}>
                    <h3>Or Search Directly: </h3>
                    <select className={styles.button}
                        value={taxonomyLevelState}
                        onChange={(event) => {
                            setTaxonomyLevelState(event.target.value);
                    }}>
                        <option value="">Choose a Taxonomy Level to Search By</option>
                        <option value="binomialNomenclature">Binomial Nomenclature</option>
                        <option value="phylum">Phylum</option>
                        <option value="class">Class</option>
                        <option value="order">Order</option>
                        <option value="family">Family</option>
                        <option value="genus">Genus</option>
                    </select>
                    <form className={styles.directSearchSearchWrapper} onSubmit={handleSearch}>
                        <input className={styles.directSearchSearchField} placeholder="Search Here..." type="text" name="directSearchInput"></input>
                        <input className={styles.button} type="submit" value="Search"></input>
                    </form>
                </div>
            </div>
        </div>
    );
}

export async function getServerSideProps(){
    const res = await fetch("http://localhost:4000/getPhylums");
    const phylums = await res.json();

    return{
        props: {
            "phylums": phylums,
        }
    }
}