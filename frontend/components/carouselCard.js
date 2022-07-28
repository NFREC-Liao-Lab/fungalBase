import styles from "../styles/Home.module.css";
import { useState } from "react";

export default function CarouselCard(props){
    const data = props.data;
    if(props.binomialNomenclature){
        data["Genus"] = props.binomialNomenclature.Genus;
        data["Species"] = props.binomialNomenclature.Species;
    }
    let objKeys = Object.keys(data);
    const title = data["Title"];
    const titleIndex = objKeys.indexOf("Title");
    objKeys.splice(titleIndex, 1);
    let JGIStatus = false;
    let JGILink, publicationLink;
    if(objKeys.includes("JGI Link")){
        JGILink = data["JGI Link"];
        publicationLink = data["Publish Link"];
        objKeys.splice(objKeys.indexOf("JGI Link"), 1);
        objKeys.splice(objKeys.indexOf("Publish Link"), 1);
        JGIStatus = true;
    }
    return (
        <div className={styles.carouselCard}>
            <div className={styles.carouselCardTitle}>
                <div>
                    {title}
                </div>
            </div>
            <ul className={styles.carouselList}>
                {
                    JGIStatus && 
                    <div>
                        <li className={styles.carouselListItem} key="JGI">
                            <div className={styles.carouselCardKey}>JGI Link- </div>
                            <div className={styles.carouselCardValue}><a target="_blank" href={JGILink}>Click Here</a></div>
                        </li>
                        <li>
                            <div className={styles.carouselCardKey}>Publication Link- </div>
                            <div className={styles.carouselCardValue}><a target="_blank" href={publicationLink}>Click Here</a></div>
                        </li>
                    </div>
                }
                {
                    objKeys.map((element, index)=> {
                        return(
                            <li key={index} className={styles.carouselListItem}>
                                <div className={styles.carouselCardKey}>{element}-</div>  
                                <div className={styles.carouselCardValue}> {data[element]}</div>
                            </li>
                        );
                    }) 
                }
            </ul>
        </div>
    );
}