import { formatPrimaryData } from "../blast/blastResults";
import { numberOfResults } from "..";

export const totalNumberOfCategories = 9;
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

export default async function handler(req, res){
    let data = req.body;
    const numberOfSequences = data.numberOfSequences;
    let fullFilename = req.body.fileName;
    console.log("fullFileName is: ", fullFilename);
    let filename;
    const queries = req.body.queries;
    let found = false;

    for(let i = 0; i < fullFilename.length; i++){
        if(fullFilename.charAt(i) === "."){
            filename = fullFilename.slice(0, i);
            filename += ".csv";
            found = true;
        }
    }
    if(!found){
        throw(". not found in file name");
    }
    const primaryData = formatPrimaryData(data.results, data.numberOfSequences);



    let csvData = [];
    for(let i = 0; i < numberOfSequences; i++){
        for(let j = 0; j < numberOfResults; j++){
            let csvObj = {};
            csvObj["query"] = queries[i];
            csvObj["sequenceID"] = primaryData[i][j].sequenceID;
            csvObj["totalScore"] = primaryData[i][j].totalScore;
            csvObj["queryCoverage"] = primaryData[i][j].queryCoverage;
            csvObj["eValue"] = primaryData[i][j].eValue;
            csvObj["identityValue"] = primaryData[i][j].identityValue;
            csvObj["transporterID"] = data.supportingDataKey[i][j][0].Transporter_id;
            csvObj["species"] = data.genomeInfoKey[i][j][0].Species;
            csvObj["lifestyle"] = data.genomeInfoKey[i][j][0].primary_lifestyle;
            csvData.push(csvObj);
        }
    }

    const csvWriterPath = `${process.env.defaultPath}frontend/public/`;
    const csvWriter = createCsvWriter({
        path: `${csvWriterPath}${filename}`,
        header: [
            {id: "query", title: "QUERY"},
            {id: "sequenceID", title: "SEQUENCE_ID"},
            {id: "totalScore", title: "TOTAL_SCORE"},
            {id: "queryCoverage", title: "QUERY_COVERAGE"},
            {id: "eValue", title: "E_VALUE"},
            {id: "identityValue", title: "IDENTITY_VALUE"},
            {id: "transporterID", title: "TRANSPORTER_ID"},
            {id: "species", title: "SPECIES"},
            {id: "lifestyle",  title:"LIFESTYLE"},
        ],
    })
    
    await csvWriter.writeRecords(csvData);
    res.status(200).json({"filename": `${filename}`});

}

