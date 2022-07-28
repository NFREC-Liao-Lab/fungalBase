import { useState } from "react";
import { httpQuery } from "..";
import { makeID } from "..";
import FileSaver, { saveAs } from "file-saver";
import styles from "../../../../styles/Home.module.css";

export default function download(props){
    //delete files after download
    const [CSVDownloadStatus, setCSVDownloadStatus] = useState(false);
    const [JSONDownloadStatus, setJSONDownloadStatus] = useState(false);
    const [CSVDeleteLoadStatus, setCSVDeleteLoadStatus] = useState(false);
    const [JSONDeleteLoadStatus, setJSONDeleteLoadStatus] = useState(false);

    let csvFileName = props.CSVFileName;
    async function deleteCSVDownload() {
        setCSVDownloadStatus(true);
        setCSVDeleteLoadStatus(true);
        try {
            const query = props.query;
            //make csv file
            console.log(props.fileName);
            csvFileName = await createDonwloadFile(query.primaryResults, query.supportingData, query.genomeInfo, query.numberOfSequences, query.queries, csvFileName);

            //download file
            FileSaver.saveAs(`/${csvFileName}`, csvFileName);

            //wait before deleting so the file can be downloaded
            setTimeout(async () => {
                //call node backend to delete File
                const JSONStringFileName = JSON.stringify({"fileName": csvFileName});
                console.log("id is: ", JSONStringFileName);
                const deleteCSVOptions = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSONStringFileName,
                };
                const res = await fetch("http://localhost:4000/deleteCSVDownload", deleteCSVOptions);
                const resStatus = await res.json();
                console.log("res stat: ", resStatus);
            }, 500);
        }
        catch (err) {
            console.log(err);
        }
        finally {
            setCSVDeleteLoadStatus(false);
        }
    }

    async function deleteJSONDownload() {
        setJSONDownloadStatus(true);
        setJSONDeleteLoadStatus(true);
        try{
            const query = props.query;

            //make JSON file
            const JSONFileName = props.JSONFileName;
            const JSONdata = {
                "hanledData": query.handledData,
                "supportingData": query.supportingData,
                "genomeInfoKey": query.genomeInfoKey,
                "numberOfSequences": query.numberOfSequences,
                "queries": query.queries,
                "fileName": JSONFileName,
            }
            const stringJSONData = JSON.stringify(JSONdata);
            const makeJSONOPtions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: stringJSONData,
            }
            const makeJSONres = await fetch("http://localhost:4000/makeJSONFile", makeJSONOPtions);
            const OutputJSONFileName = await makeJSONres.json();

            //save file
            FileSaver.saveAs(`/${JSONFileName}`, JSONFileName);

            //wait for file to be saved before deleting
            setTimeout(async () => {
                //call node backend to delete JSON file
                const JSONStringFileName = JSON.stringify({"fileName": JSONFileName});
                const deleteJSONOptions = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSONStringFileName,
                };
                const res = await fetch("http://localhost:4000/deleteJSONDownload", deleteJSONOptions);
                const resStatus = await res.json();
                console.log("res stat: ", resStatus);
            }, 500);
        }
        catch (err) {
            console.log(err);
        }
        finally {
            setJSONDeleteLoadStatus(false);
        }
    }

    return(
        <div>
            <h1 className={styles.title}>Download Results</h1>
            <div className={styles.buttonsWrapper}>
                {!CSVDownloadStatus && 
                    <p>
                        <button className={styles.downloadButton} onClick={() => {deleteCSVDownload()}}>Download as csv</button>
                    </p>
                }
                {CSVDownloadStatus && 
                    CSVDeleteLoadStatus &&
                    <p className={styles.downloadMessage}>loading...</p>
                }
                {CSVDownloadStatus &&
                    !CSVDeleteLoadStatus &&
                    <p className={styles.downloadMessage}>Thanks for downloading! <br/> Please cite: </p>
                }

                {!JSONDownloadStatus && 
                    <p>
                        {/* Click <a href={`/${props.JSONFileName}`} download onClick={
                            () => setTimeout(() => {
                                deleteJSONDownload();
                            }, 100)
                        }>here</a> to download results as JSON */}
                        <button className={styles.downloadButton} onClick={() => {deleteJSONDownload()}}>Download as JSON</button>
                    </p>
                }
                {JSONDownloadStatus && 
                    JSONDeleteLoadStatus && 
                    <p className={styles.downloadMessage}>loading...</p>
                }
                {JSONDownloadStatus &&
                    <p className={styles.downloadMessage}>Thanks for downloading! <br/> Please Cite: </p>
                }
            </div>
        </div>
    );
}


export async function getServerSideProps(context){
    //get data
    const ID = context.query.ID;
    let fileName = ID;
    console.log(typeof(ID));
    fileName += ".json";
    console.log("fileName: ", fileName);
    const CSVFileName = convertJSONToCSVName(fileName);
    const IDString = JSON.stringify({"ID": ID});
    const sqlOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: IDString,
    }
    //get table data from sql db
    const sqlRes = await fetch("http://localhost:4000/getSQLData", sqlOptions);
    const queryObj = await sqlRes.json();
    const query = JSON.parse(queryObj.data);
    
    
    return {
        props: {
            "query": query,
            "JSONFileName": fileName,
            "CSVFileName": CSVFileName
        },
    }
}

export async function createDonwloadFile(handledData, supportingData, genomeInfoKey, numberOfSequences, queries, fileName){
    //create resultsDownload
    // console.log("handled data is", handledData);
    console.log("filename here: ", fileName);
    const downloadOptionsBody = JSON.stringify({
        results: handledData,
        supportingDataKey: supportingData,
        genomeInfoKey: genomeInfoKey,
        numberOfSequences: numberOfSequences,
        queries: queries,
        fileName: fileName,
    });
    console.log("downloadOpt: ", downloadOptionsBody);
    const downloadOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: downloadOptionsBody,
    }
    const res = await fetch("http://localhost:3000/api/resultsDownload", downloadOptions);
    const filenameRes = await res.json();

    return filenameRes.filename;
}

export function convertJSONToCSVName(JSONFileName){
    let CSVFileName;
    for(let i = 0; i < JSONFileName.length; i++){
        if(JSONFileName.charAt(i) === "."){
            let tempFileName = JSONFileName.slice(0, i);
            CSVFileName = tempFileName + ".csv";
            return CSVFileName;
        }
    }
    console.log("error, . not found");
    return;
}

// export function convertCsvToJsonNames(fileNames){
//     const fileName = fileNames[0];
//     let newFileName;
//     let found = false;
//     for(let i = 0; i < fileName.length; i++){
//         if(fileName.charAt(i) === "."){
//             newFileName = fileName.slice(0, i);
//             newFileName += ".json";
//             found = true;
//         }
//     }
//     if(!found){
//         console.log("error, . not found in fileName");
//         return;  
//     }
//     else{
//         return newFileName;
//     }


// }